import { NextResponse } from 'next/server';
import { spotifyService } from '@/lib/spotify';

export async function GET() {
  try {
    const genres = await spotifyService.getAvailableGenres();

    return NextResponse.json({ genres });
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available genres' },
      { status: 500 }
    );
  }
}
