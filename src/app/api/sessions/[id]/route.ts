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
        { error: 'Geçersiz oturum ID' },
        { status: 400 }
      );
    }
    
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Oturum bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(session);
  } catch (error) {
    console.error(`Error fetching session ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Oturum getirilirken bir hata oluştu' },
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
        { error: 'Geçersiz oturum ID' },
        { status: 400 }
      );
    }
    
    await prisma.session.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting session ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Oturum silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 