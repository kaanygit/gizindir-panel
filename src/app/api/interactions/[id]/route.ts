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
        { error: 'Geçersiz etkileşim ID' },
        { status: 400 }
      );
    }
    
    const interaction = await prisma.userInteraction.findUnique({
      where: { id },
      include: {
        user: true,
        shown_user: true,
      },
    });
    
    if (!interaction) {
      return NextResponse.json(
        { error: 'Etkileşim bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(interaction);
  } catch (error) {
    console.error(`Error fetching interaction ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Etkileşim getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Geçersiz etkileşim ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    const interaction = await prisma.userInteraction.update({
      where: { id },
      data: body,
      include: {
        user: true,
        shown_user: true,
      },
    });
    
    return NextResponse.json(interaction);
  } catch (error) {
    console.error(`Error updating interaction ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Etkileşim güncellenirken bir hata oluştu' },
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
        { error: 'Geçersiz etkileşim ID' },
        { status: 400 }
      );
    }
    
    await prisma.userInteraction.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting interaction ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Etkileşim silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 