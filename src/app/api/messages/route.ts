import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: {
        sent_at: 'desc',
      },
    });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Mesajlar getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const message = await prisma.message.create({
      data: body,
      include: {
        sender: true,
        receiver: true,
      },
    });
    
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Mesaj oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 