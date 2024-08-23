import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import cookie from 'cookie';

export async function POST(req: NextRequest) {
  const { name } = await req.json();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { name },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists.' },
        { status: 400 },
      );
    }

    const user = await prisma.user.create({
      data: { name },
    });

    const sessionToken = uuidv4();

    await prisma.session.create({
      data: {
        token: sessionToken,
        userId: user.id,
      },
    });

    const response = NextResponse.json(user, { status: 201 });

    response.headers.append(
      'Set-Cookie',
      cookie.serialize('session-token', sessionToken, {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'strict',
        path: '/',
      }),
    );

    response.headers.append(
      'Set-Cookie',
      cookie.serialize('userId', user.id, {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'strict',
        path: '/',
      }),
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 },
    );
  }
}
