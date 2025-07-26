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

      const songRecommendations = await llmService.generateSongRecommendations(
        personalityAnalysis,
        []
      );

      const songs = await this.findSpotifySongs(songRecommendations);

      const searchBasedSongs = await this.getSearchBasedRecommendations(
        personalityAnalysis
      );

      const allSongs = [...songs, ...searchBasedSongs];
      const uniqueSongs = this.deduplicateSongs(allSongs);
      const finalSongs = uniqueSongs.slice(0, 6);

      return {
        personalityAnalysis,
        songs: finalSongs,
      };
    } catch (error) {
      throw new Error('Failed to generate music recommendations');
    }
  }

  private async findSpotifySongs(
    recommendations: SongRecommendation[]
  ): Promise<Song[]> {
    const songs: Song[] = [];

    for (const rec of recommendations) {
      try {
        const searchResults = await spotifyService.searchTracks(rec.query, 3);

        if (searchResults.length > 0) {
          const track = searchResults[0];

          songs.push({
            id: track.id,
            title: track.name,
            artist: track.artists[0]?.name || 'Unknown Artist',
            embedUrl: `https://open.spotify.com/embed/track/${track.id}?utm_source=generator&volume=0.5`,
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
        }
      } catch (error) {
        console.error(`Error searching for "${rec.query}":`, error);
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

      for (const query of searchQueries.slice(0, 4)) {
        try {
          const searchResults = await spotifyService.searchTracks(query, 5);

          if (searchResults.length > 0) {
            const track = searchResults[0];

            songs.push({
              id: track.id,
              title: track.name,
              artist: track.artists[0]?.name || 'Unknown Artist',
              embedUrl: `https://open.spotify.com/embed/track/${track.id}?utm_source=generator&volume=0.5`,
              previewUrl: track.preview_url || undefined,
              imageUrl: track.album?.images?.[0]?.url,
              reason: `This song matches your ${personalityAnalysis.type.toLowerCase()} personality with its ${this.getEnergyDescription(
                personalityAnalysis.musicPreferences.energy
              )} energy and ${this.getValenceDescription(
                personalityAnalysis.musicPreferences.valence
              )} vibe.`,
              personalityMatch: personalityAnalysis.traits.slice(0, 3),
              mood: this.getMoodFromValence(
                personalityAnalysis.musicPreferences.valence
              ),
              energy: this.getEnergyLevel(
                personalityAnalysis.musicPreferences.energy
              ),
              spotifyUrl:
                track.external_urls?.spotify ||
                `https://open.spotify.com/track/${track.id}`,
            });
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

    for (const genre of genres.slice(0, 3)) {
      queries.push(`genre:"${genre.toLowerCase()}"`);

      if (valence > 0.6) {
        queries.push(`${genre.toLowerCase()} upbeat`);
        queries.push(`${genre.toLowerCase()} happy`);
      } else if (valence < 0.4) {
        queries.push(`${genre.toLowerCase()} mellow`);
        queries.push(`${genre.toLowerCase()} chill`);
      }

      if (energy > 0.6) {
        queries.push(`${genre.toLowerCase()} energetic`);
      } else if (energy < 0.4) {
        queries.push(`${genre.toLowerCase()} relaxing`);
        queries.push(`${genre.toLowerCase()} ambient`);
      }
    }

    const personalityType = personalityAnalysis.type.toLowerCase();
    if (personalityType.includes('creative')) {
      queries.push('experimental indie');
      queries.push('avant-garde');
    }
    if (personalityType.includes('social')) {
      queries.push('party music');
      queries.push('dance pop');
    }
    if (personalityType.includes('thoughtful')) {
      queries.push('contemplative');
      queries.push('introspective folk');
    }

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
