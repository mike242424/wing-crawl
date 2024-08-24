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
        appearance: true,
        aroma: true,
        sauceQuantity: true,
        spiceLevel: true,
        skinConsistency: true,
        meat: true,
        greasiness: true,
        overallTaste: true,
        beenThereBefore: true,
        notes: true,
      },
    });

    return NextResponse.json({ ratings: rating || {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { locationId, userId, ratings, beenThereBefore, notes } =
      await req.json();

    if (!userId || !locationId || !ratings) {
      return NextResponse.json(
        {
          message: 'Invalid request: missing userId, locationId, or ratings.',
        },
        { status: 400 },
      );
    }

    const dataToUpdate = {
      ...ratings,
      beenThereBefore: beenThereBefore,
      notes: notes,
    };

    const existingRating = await prisma.locationRating.findFirst({
      where: {
        userId: userId,
        locationId: locationId,
      },
    });

    if (existingRating) {
      await prisma.locationRating.update({
        where: { id: existingRating.id },
        data: dataToUpdate,
      });
    } else {
      await prisma.locationRating.create({
        data: {
          userId,
          locationId,
          ...dataToUpdate,
        },
      });
    }

    return NextResponse.json(
      { message: 'Rating saved successfully' },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'Surrogate-Control': 'no-store',
        },
      },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 },
    );
  }
}

export const revalidate = 0;
