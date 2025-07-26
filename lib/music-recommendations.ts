import { llmService, PersonalityAnalysis, SongRecommendation } from './llm';
import { spotifyService } from './spotify';

export interface Song {
  id: string;
  title: string;
  artist: string;
  embedUrl: string;
  previewUrl?: string;
  imageUrl?: string;
  reason: string;
  personalityMatch: string[];
  mood: string;
  energy: 'High' | 'Medium' | 'Low';
  spotifyUrl: string;
}

export interface MusicRecommendationResult {
  personalityAnalysis: PersonalityAnalysis;
  songs: Song[];
}

class MusicRecommendationService {
  async getPersonalizedRecommendations(
    answers: Record<string, any>
  ): Promise<MusicRecommendationResult> {
    try {
      const personalityAnalysis = await llmService.analyzePersonality(answers);

      let finalSongs: Song[] = [];

      try {
        const spotifyRecs = await spotifyService.getRecommendations(
          personalityAnalysis.musicPreferences.genres,
          personalityAnalysis.musicPreferences,
          20
        );

        const validatedSpotifyTracks =
          await this.validateSpotifyRecommendations(
            spotifyRecs.tracks,
            personalityAnalysis
          );
        finalSongs.push(...validatedSpotifyTracks);
      } catch (error) {
        console.warn(
          'Spotify recommendations failed, falling back to LLM approach'
        );
      }

      if (finalSongs.length < 6) {
        const songRecommendations =
          await llmService.generateSongRecommendations(personalityAnalysis, []);

        const llmSongs = await this.findSpotifySongs(
          songRecommendations,
          personalityAnalysis
        );
        finalSongs.push(...llmSongs);
      }

      if (finalSongs.length < 6) {
        const searchBasedSongs = await this.getSearchBasedRecommendations(
          personalityAnalysis
        );
        finalSongs.push(...searchBasedSongs);
      }

      const uniqueSongs = this.deduplicateSongs(finalSongs);
      const resultSongs = uniqueSongs.slice(0, 6);

      return {
        personalityAnalysis,
        songs: resultSongs,
      };
    } catch (error) {
      throw new Error('Failed to generate music recommendations');
    }
  }

  private async findSpotifySongs(
    recommendations: SongRecommendation[],
    personalityAnalysis: PersonalityAnalysis
  ): Promise<Song[]> {
    const songs: Song[] = [];

    for (const rec of recommendations) {
      try {
        let searchResults = await spotifyService.searchTracks(rec.query, 5);

        if (searchResults.length === 0) {
          const simplifiedQuery = rec.query.replace(/[^\w\s]/g, ' ').trim();
          searchResults = await spotifyService.searchTracks(simplifiedQuery, 5);
        }

        for (const track of searchResults) {
          try {
            const audioFeatures = await spotifyService.getAudioFeatures(
              track.id
            );

            if (
              this.validateTrackWithAudioFeatures(
                audioFeatures,
                personalityAnalysis
              )
            ) {
              songs.push({
                id: track.id,
                title: track.name,
                artist: track.artists[0]?.name || 'Unknown Artist',
                embedUrl: `https://open.spotify.com/embed/track/${track.id}?utm_source=generator`,
                previewUrl: track.preview_url || undefined,
                imageUrl: track.album?.images?.[0]?.url,
                reason: rec.reason,
                personalityMatch: rec.personalityMatch,
                mood: rec.mood,
                energy: rec.energy,
                spotifyUrl:
                  track.external_urls?.spotify ||
                  `https://open.spotify.com/track/${track.id}`,
              });
              break;
            }
          } catch (error) {
            console.warn(
              `Could not get audio features for ${track.id}, using track anyway`
            );
            songs.push({
              id: track.id,
              title: track.name,
              artist: track.artists[0]?.name || 'Unknown Artist',
              embedUrl: `https://open.spotify.com/embed/track/${track.id}?utm_source=generator`,
              previewUrl: track.preview_url || undefined,
              imageUrl: track.album?.images?.[0]?.url,
              reason: rec.reason,
              personalityMatch: rec.personalityMatch,
              mood: rec.mood,
              energy: rec.energy,
              spotifyUrl:
                track.external_urls?.spotify ||
                `https://open.spotify.com/track/${track.id}`,
            });
            break;
          }
        }
      } catch (error) {
        console.error(`Error searching for "${rec.query}":`, error);
      }
    }

    return songs;
  }

  private validateTrackWithAudioFeatures(
    audioFeatures: any,
    personalityAnalysis: PersonalityAnalysis
  ): boolean {
    const { energy, valence, danceability, acousticness } = audioFeatures;
    const personality = personalityAnalysis.musicPreferences;

    const energyDiff = Math.abs(energy - personality.energy);
    if (energyDiff > 0.4) return false;

    const valenceDiff = Math.abs(valence - personality.valence);
    if (valenceDiff > 0.4) return false;

    const danceabilityDiff = Math.abs(danceability - personality.danceability);
    if (danceabilityDiff > 0.4) return false;

    const acousticnessDiff = Math.abs(acousticness - personality.acousticness);
    if (acousticnessDiff > 0.4) return false;

    return true;
  }

  private async validateSpotifyRecommendations(
    tracks: any[],
    personalityAnalysis: PersonalityAnalysis
  ): Promise<Song[]> {
    const songs: Song[] = [];

    for (const track of tracks.slice(0, 10)) {
      try {
        const audioFeatures = await spotifyService.getAudioFeatures(track.id);

        if (
          this.validateTrackWithAudioFeatures(
            audioFeatures,
            personalityAnalysis
          )
        ) {
          songs.push({
            id: track.id,
            title: track.name,
            artist: track.artists[0]?.name || 'Unknown Artist',
            embedUrl: `https://open.spotify.com/embed/track/${track.id}?utm_source=generator`,
            previewUrl: track.preview_url || undefined,
            imageUrl: track.album?.images?.[0]?.url,
            reason: `This song matches your ${personalityAnalysis.type.toLowerCase()} personality profile.`,
            personalityMatch: personalityAnalysis.traits.slice(0, 3),
            mood: this.getMoodFromValence(audioFeatures.valence),
            energy: this.getEnergyLevel(audioFeatures.energy),
            spotifyUrl:
              track.external_urls?.spotify ||
              `https://open.spotify.com/track/${track.id}`,
          });
        }
      } catch (error) {
        console.warn(`Could not validate track ${track.id}`);
      }
    }

    return songs;
  }

  private async getSearchBasedRecommendations(
    personalityAnalysis: PersonalityAnalysis
  ): Promise<Song[]> {
    try {
      const songs: Song[] = [];
      const searchQueries = this.generateSearchQueries(personalityAnalysis);

      for (const query of searchQueries.slice(0, 3)) {
        try {
          const searchResults = await spotifyService.searchTracks(query, 5);

          for (const track of searchResults) {
            try {
              const audioFeatures = await spotifyService.getAudioFeatures(
                track.id
              );

              if (
                this.validateTrackWithAudioFeatures(
                  audioFeatures,
                  personalityAnalysis
                )
              ) {
                songs.push({
                  id: track.id,
                  title: track.name,
                  artist: track.artists[0]?.name || 'Unknown Artist',
                  embedUrl: `https://open.spotify.com/embed/track/${track.id}?utm_source=generator`,
                  previewUrl: track.preview_url || undefined,
                  imageUrl: track.album?.images?.[0]?.url,
                  reason: `This song matches your ${personalityAnalysis.type.toLowerCase()} personality with its ${this.getEnergyDescription(
                    audioFeatures.energy
                  )} energy and ${this.getValenceDescription(
                    audioFeatures.valence
                  )} vibe.`,
                  personalityMatch: personalityAnalysis.traits.slice(0, 3),
                  mood: this.getMoodFromValence(audioFeatures.valence),
                  energy: this.getEnergyLevel(audioFeatures.energy),
                  spotifyUrl:
                    track.external_urls?.spotify ||
                    `https://open.spotify.com/track/${track.id}`,
                });
                break;
              }
            } catch (error) {
              console.warn(`Could not get audio features for ${track.id}`);
            }
          }
        } catch (error) {
          console.error(`Error searching for "${query}":`, error);
        }
      }

      return songs;
    } catch (error) {
      console.error('Error getting search-based recommendations:', error);
      return [];
    }
  }

  private generateSearchQueries(
    personalityAnalysis: PersonalityAnalysis
  ): string[] {
    const queries: string[] = [];
    const genres = personalityAnalysis.musicPreferences.genres;
    const energy = personalityAnalysis.musicPreferences.energy;
    const valence = personalityAnalysis.musicPreferences.valence;

    for (const genre of genres.slice(0, 2)) {
      const genreKey = genre.toLowerCase();

      queries.push(`${genreKey} hits`);
      queries.push(`top ${genreKey}`);
      queries.push(`${genreKey} charts`);
      queries.push(`popular ${genreKey}`);

      if (energy > 0.7) {
        queries.push(`${genreKey} energetic`);
        queries.push(`${genreKey} upbeat`);
        queries.push(`${genreKey} pump up`);
      } else if (energy < 0.4) {
        queries.push(`${genreKey} chill`);
        queries.push(`${genreKey} relaxing`);
        queries.push(`${genreKey} mellow`);
      }

      if (valence > 0.7) {
        queries.push(`${genreKey} happy`);
        queries.push(`${genreKey} feel good`);
        queries.push(`${genreKey} positive`);
      } else if (valence < 0.4) {
        queries.push(`${genreKey} emotional`);
        queries.push(`${genreKey} melancholic`);
        queries.push(`${genreKey} thoughtful`);
      }
    }

    if (valence > 0.7) {
      queries.push('feel good hits');
      queries.push('happy songs');
      queries.push('mood booster');
      queries.push('good vibes');
    } else if (valence < 0.4) {
      queries.push('chill vibes');
      queries.push('emotional songs');
      queries.push('introspective music');
      queries.push('quiet storm');
    }

    if (energy > 0.7) {
      queries.push('workout motivation');
      queries.push('pump up songs');
      queries.push('high energy hits');
      queries.push('party anthems');
    } else if (energy < 0.4) {
      queries.push('study playlist');
      queries.push('background chill');
      queries.push('calm focus');
      queries.push('peaceful music');
    }

    const personalityType = personalityAnalysis.type.toLowerCase();
    if (
      personalityType.includes('creative') ||
      personalityType.includes('artistic')
    ) {
      queries.push('creative flow');
      queries.push('indie discoveries');
      queries.push('alternative hits');
    }
    if (
      personalityType.includes('social') ||
      personalityType.includes('outgoing')
    ) {
      queries.push('party playlist');
      queries.push('crowd favorites');
      queries.push('sing along hits');
    }
    if (
      personalityType.includes('thoughtful') ||
      personalityType.includes('introspective')
    ) {
      queries.push('deep lyrics');
      queries.push('singer songwriter');
      queries.push('acoustic sessions');
    }

    queries.push('trending now');
    queries.push('viral hits');
    queries.push('current favorites');
    queries.push('chart toppers');
    queries.push('most popular');

    queries.push('2020s hits');
    queries.push('2010s favorites');
    queries.push('modern classics');

    return [...new Set(queries)];
  }

  private deduplicateSongs(songs: Song[]): Song[] {
    const seen = new Set<string>();
    return songs.filter((song) => {
      const key = `${song.title.toLowerCase()}-${song.artist.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private getEnergyDescription(energy: number): string {
    if (energy > 0.7) return 'high';
    if (energy > 0.4) return 'moderate';
    return 'calm';
  }

  private getValenceDescription(valence: number): string {
    if (valence > 0.7) return 'upbeat';
    if (valence > 0.4) return 'balanced';
    return 'mellow';
  }

  private getMoodFromValence(valence: number): string {
    if (valence > 0.8) return 'Euphoric';
    if (valence > 0.6) return 'Uplifting';
    if (valence > 0.4) return 'Balanced';
    if (valence > 0.2) return 'Melancholic';
    return 'Introspective';
  }

  private getEnergyLevel(energy: number): 'High' | 'Medium' | 'Low' {
    if (energy > 0.6) return 'High';
    if (energy > 0.3) return 'Medium';
    return 'Low';
  }
}

export const musicRecommendationService = new MusicRecommendationService();
