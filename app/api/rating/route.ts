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
    const { locationId, userId, criterion, rating } = await req.json();

    if (!userId || !locationId || !criterion || rating === undefined) {
      return NextResponse.json(
        {
          message:
            'Invalid request: missing userId, locationId, criterion, or rating.',
        },
        { status: 400 },
      );
    }

    const dataToUpdate = {
      [criterion]: rating,
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
          appearance: 0, // Default values
          aroma: 0, // Default values
          sauceQuantity: 0, // Default values
          spiceLevel: 0, // Default values
          skinConsistency: 0, // Default values
          meat: 0, // Default values
          greasiness: 0, // Default values
          overallTaste: 0, // Default values
          ...dataToUpdate, // Overwrite the default value with the provided one
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
