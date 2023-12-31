import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';

interface Params {
  productId?: string;
}

// params = productId
export async function POST(request: Request, { params }: { params: Params }) {
  // 유저정보
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  const { productId } = params;
  if (!productId || typeof productId !== 'string') {
    throw new Error(`Invaild ID`);
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];
  favoriteIds.push(productId);

  const user = await prisma?.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds: favoriteIds,
    },
  });
  return NextResponse.json(user);
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  // 유저정보
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  const { productId } = params;
  if (!productId || typeof productId !== 'string') {
    throw new Error(`Invaild ID`);
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];
  favoriteIds = favoriteIds.filter((id) => id !== productId);

  const user = await prisma?.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds: favoriteIds,
    },
  });
  return NextResponse.json(user);
}
