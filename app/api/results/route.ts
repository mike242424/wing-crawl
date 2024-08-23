import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const averageRatings = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
        wing: true,
        LocationRating: {
          select: {
            score: true,
          },
        },
      },
    });

    const results = averageRatings.map((location) => {
      const totalScore = location.LocationRating.reduce(
        (sum, rating) => sum + rating.score,
        0,
      );
      const averageScore =
        location.LocationRating.length > 0
          ? totalScore / location.LocationRating.length
          : 0;

      return {
        id: location.id,
        name: location.name,
        wing: location.wing,
        averageScore: averageScore.toFixed(2),
      };
    });

    return NextResponse.json(results, {
      status: 200,
      headers: {
        'Cache-Control':
          'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
        'Surrogate-Control': 'no-store',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 },
    );
  }
}

export const revalidate = 0;
