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
            appearance: true,
            aroma: true,
            sauceQuantity: true,
            spiceLevel: true,
            skinConsistency: true,
            meat: true,
            greasiness: true,
            overallTaste: true,
          },
        },
      },
    });

    const results = averageRatings.map((location) => {
      const totalScores = location.LocationRating.map((rating) => {
        return (
          rating.appearance +
          rating.aroma +
          rating.sauceQuantity +
          rating.spiceLevel +
          rating.skinConsistency +
          rating.meat +
          rating.greasiness +
          rating.overallTaste
        );
      });

      const totalScore = totalScores.reduce((sum, score) => sum + score, 0);
      const averageScore =
        totalScores.length > 0 ? totalScore / totalScores.length : 0;

      return {
        id: location.id,
        name: location.name,
        wing: location.wing,
        averageScore: parseFloat(averageScore.toFixed(2)),
      };
    });

    results.sort((a, b) => b.averageScore - a.averageScore);

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
