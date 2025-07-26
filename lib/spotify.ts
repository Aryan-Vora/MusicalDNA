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
      const authHeader = `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString('base64')}`;

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': authHeader,
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data: SpotifyTokenResponse = await response.json();

      this.accessToken = data.access_token;
      this.tokenExpirationTime = Date.now() + data.expires_in * 1000 - 60000;
    } catch (error) {
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
      const errorText = await response.text();
      throw new Error(
        `Spotify API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    return data;
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
      console.error(`Error searching for "${query}":`, error);
      return [];
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
}

export const spotifyService = new SpotifyService();
