import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const interactions = await prisma.userInteraction.findMany({
      include: {
        user: true,
        shown_user: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    
    return NextResponse.json(interactions);
  } catch (error) {
    console.error('Error fetching interactions:', error);
    return NextResponse.json(
      { error: 'Etkileşimler getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const interaction = await prisma.userInteraction.create({
      data: body,
      include: {
        user: true,
        shown_user: true,
      },
    });
    
    return NextResponse.json(interaction, { status: 201 });
  } catch (error) {
    console.error('Error creating interaction:', error);
    return NextResponse.json(
      { error: 'Etkileşim oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 