interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string; id: string }[];
  album: {
    name: string;
    images: { url: string; height: number; width: number }[];
  };
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

interface SpotifyRecommendationsResponse {
  tracks: SpotifyTrack[];
}

class SpotifyService {
  private accessToken: string | null = null;
  private tokenExpirationTime: number = 0;
  private readonly baseUrl = 'https://api.spotify.com/v1';

  private async ensureValidToken(): Promise<void> {
    const now = Date.now();

    if (!this.accessToken || now >= this.tokenExpirationTime) {
      await this.refreshToken();
    }
  }

  private async refreshToken(): Promise<void> {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Spotify credentials not configured');
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(
            `${clientId}:${clientSecret}`
          ).toString('base64')}`,
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SpotifyTokenResponse = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpirationTime = Date.now() + data.expires_in * 1000 - 60000;
    } catch (error) {
      console.error('Error getting Spotify access token:', error);
      throw new Error('Failed to authenticate with Spotify');
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<T> {
    await this.ensureValidToken();

    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Spotify API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async searchTracks(
    query: string,
    limit: number = 10
  ): Promise<SpotifyTrack[]> {
    try {
      const data = await this.makeRequest<SpotifySearchResponse>('/search', {
        q: query,
        type: 'track',
        limit: limit.toString(),
      });
      return data.tracks?.items || [];
    } catch (error) {
      console.error('Error searching tracks:', error);
      throw new Error('Failed to search tracks');
    }
  }

  async getTrack(trackId: string): Promise<SpotifyTrack> {
    try {
      return await this.makeRequest<SpotifyTrack>(`/tracks/${trackId}`);
    } catch (error) {
      console.error('Error getting track:', error);
      throw new Error('Failed to get track');
    }
  }

  async getArtist(artistId: string): Promise<any> {
    try {
      return await this.makeRequest<any>(`/artists/${artistId}`);
    } catch (error) {
      console.error('Error getting artist:', error);
      throw new Error('Failed to get artist');
    }
  }

  async getRecommendations(options: {
    seed_genres?: string[];
    seed_artists?: string[];
    seed_tracks?: string[];
    target_energy?: number;
    target_valence?: number;
    target_danceability?: number;
    target_acousticness?: number;
    limit?: number;
  }): Promise<SpotifyTrack[]> {
    try {
      const params: Record<string, string> = {
        limit: (options.limit || 20).toString(),
      };

      if (options.seed_genres?.length) {
        params.seed_genres = options.seed_genres.slice(0, 5).join(','); // Max 5 seeds
      }
      if (options.seed_artists?.length) {
        params.seed_artists = options.seed_artists.slice(0, 5).join(',');
      }
      if (options.seed_tracks?.length) {
        params.seed_tracks = options.seed_tracks.slice(0, 5).join(',');
      }
      if (options.target_energy !== undefined) {
        params.target_energy = options.target_energy.toString();
      }
      if (options.target_valence !== undefined) {
        params.target_valence = options.target_valence.toString();
      }
      if (options.target_danceability !== undefined) {
        params.target_danceability = options.target_danceability.toString();
      }
      if (options.target_acousticness !== undefined) {
        params.target_acousticness = options.target_acousticness.toString();
      }

      const data = await this.makeRequest<SpotifyRecommendationsResponse>(
        '/recommendations',
        params
      );
      return data.tracks || [];
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw new Error('Failed to get recommendations');
    }
  }

  async getAvailableGenres(): Promise<string[]> {
    try {
      const data = await this.makeRequest<{ genres: string[] }>(
        '/recommendations/available-genre-seeds'
      );
      return data.genres || [];
    } catch (error) {
      console.error('Error getting genres:', error);
      return [
        'acoustic',
        'afrobeat',
        'alt-rock',
        'alternative',
        'ambient',
        'blues',
        'brazil',
        'breakbeat',
        'british',
        'chill',
        'classical',
        'club',
        'country',
        'dance',
        'deep-house',
        'disco',
        'drum-and-bass',
        'dub',
        'dubstep',
        'edm',
        'electronic',
        'folk',
        'funk',
        'garage',
        'gospel',
        'groove',
        'grunge',
        'hip-hop',
        'house',
        'indie',
        'jazz',
        'latin',
        'metal',
        'new-age',
        'pop',
        'punk',
        'r-n-b',
        'reggae',
        'rock',
        'soul',
        'techno',
        'trance',
        'world-music',
      ];
    }
  }
}

export const spotifyService = new SpotifyService();
