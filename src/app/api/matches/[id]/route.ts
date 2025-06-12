import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Geçersiz eşleşme ID' },
        { status: 400 }
      );
    }
    
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        user1: true,
        user2: true,
      },
    });
    
    if (!match) {
      return NextResponse.json(
        { error: 'Eşleşme bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(match);
  } catch (error) {
    console.error(`Error fetching match ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Eşleşme getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Geçersiz eşleşme ID' },
        { status: 400 }
      );
    }
    
    await prisma.match.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting match ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Eşleşme silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 