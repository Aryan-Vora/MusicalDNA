import { NextRequest, NextResponse } from 'next/server';
import { spotifyService } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const tracks = await spotifyService.searchTracks(
      query,
      Math.min(limit, 50)
    );

    const formattedTracks = tracks.map((track) => ({
      id: track.id,
      title: track.name,
      artist: track.artists[0]?.name || 'Unknown Artist',
      album: track.album?.name,
      imageUrl: track.album?.images?.[0]?.url,
      previewUrl: track.preview_url,
      spotifyUrl: track.external_urls?.spotify,
      embedUrl: `https://open.spotify.com/embed/track/${track.id}`,
    }));

    return NextResponse.json({ tracks: formattedTracks });
  } catch (error) {
    console.error('Error searching tracks:', error);
    return NextResponse.json(
      { error: 'Failed to search tracks' },
      { status: 500 }
    );
  }
}
