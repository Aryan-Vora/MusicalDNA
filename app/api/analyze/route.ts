import { NextRequest, NextResponse } from 'next/server';
import { musicRecommendationService } from '@/lib/music-recommendations';
import { z } from 'zod';

const AnalysisRequestSchema = z.object({
  answers: z.record(z.any()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers } = AnalysisRequestSchema.parse(body);

    if (!answers || Object.keys(answers).length === 0) {
      return NextResponse.json(
        { error: 'No answers provided' },
        { status: 400 }
      );
    }

    const result =
      await musicRecommendationService.getPersonalizedRecommendations(answers);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in analyze endpoint:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      );
    }

    if (
      error?.message?.includes('quota') ||
      error?.message?.includes('billing')
    ) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error:
          error?.message ||
          'Failed to analyze personality and generate recommendations',
      },
      { status: 500 }
    );
  }
}
