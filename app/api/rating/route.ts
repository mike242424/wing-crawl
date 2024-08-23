import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get('locationId');
    const userId = searchParams.get('userId');

    if (!userId || !locationId) {
      return NextResponse.json(
        { message: 'Invalid request: missing userId or locationId.' },
        { status: 400 },
      );
    }

    const rating = await prisma.locationRating.findFirst({
      where: {
        userId: userId,
        locationId: locationId,
      },
      select: {
        score: true,
      },
    });

    return NextResponse.json({ rating: rating?.score || 0 }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { locationId, rating, userId } = await req.json();

    const existingRating = await prisma.locationRating.findFirst({
      where: {
        userId: userId,
        locationId: locationId,
      },
    });

    if (existingRating) {
      await prisma.locationRating.update({
        where: { id: existingRating.id },
        data: { score: rating },
      });
    } else {
      await prisma.locationRating.create({
        data: {
          score: rating,
          userId: userId,
          locationId: locationId,
        },
      });
    }

    return NextResponse.json(
      { message: 'Rating saved successfully' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 },
    );
  }
}
