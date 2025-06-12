import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      include: {
        user1: true,
        user2: true,
      },
      orderBy: {
        matched_at: 'desc',
      },
    });
    
    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: 'Eşleşmeler getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const match = await prisma.match.create({
      data: body,
      include: {
        user1: true,
        user2: true,
      },
    });
    
    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json(
      { error: 'Eşleşme oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 