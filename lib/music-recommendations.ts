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

      const availableGenres = await spotifyService.getAvailableGenres();

      const songRecommendations = await llmService.generateSongRecommendations(
        personalityAnalysis,
        availableGenres
      );

      const songs = await this.findSpotifySongs(songRecommendations);

      const spotifyBasedSongs = await this.getSpotifyBasedRecommendations(
        personalityAnalysis
      );

      const allSongs = [...songs, ...spotifyBasedSongs];
      const uniqueSongs = this.deduplicateSongs(allSongs);

      return {
        personalityAnalysis,
        songs: uniqueSongs.slice(0, 6), // Return top 6 recommendations
      };
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
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
          const track = searchResults[0]; // Take the first result
          songs.push({
            id: track.id,
            title: track.name,
            artist: track.artists[0]?.name || 'Unknown Artist',
            embedUrl: `https://open.spotify.com/embed/track/${track.id}`,
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

  private async getSpotifyBasedRecommendations(
    personalityAnalysis: PersonalityAnalysis
  ): Promise<Song[]> {
    try {
      const recommendations = await spotifyService.getRecommendations({
        seed_genres: personalityAnalysis.musicPreferences.genres.slice(0, 3), // Max 3 seed genres
        target_energy: personalityAnalysis.musicPreferences.energy,
        target_valence: personalityAnalysis.musicPreferences.valence,
        target_danceability: personalityAnalysis.musicPreferences.danceability,
        target_acousticness: personalityAnalysis.musicPreferences.acousticness,
        limit: 10,
      });

      const songs: Song[] = [];

      for (const track of recommendations.slice(0, 3)) {
        songs.push({
          id: track.id,
          title: track.name,
          artist: track.artists[0]?.name || 'Unknown Artist',
          embedUrl: `https://open.spotify.com/embed/track/${track.id}`,
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

      return songs;
    } catch (error) {
      console.error('Error getting Spotify-based recommendations:', error);
      return [];
    }
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
