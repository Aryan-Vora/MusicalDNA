import { NextResponse } from 'next/server';

export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      spotify:
        !!process.env.SPOTIFY_CLIENT_ID && !!process.env.SPOTIFY_CLIENT_SECRET,
      openai: !!process.env.OPENAI_API_KEY,
    },
    environment: process.env.NODE_ENV || 'development',
  };

  return NextResponse.json(healthCheck);
}
