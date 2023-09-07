import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/helpers/prismadb';

export async function POST(request: Request) {
  console.log('post!!!');
  const currentUser = await getCurrentUser();

  // 로그인 되어있지않으면 에러
  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const { title, description, imageSrc, category, latitude, longitude, price } = body;

  // 값이 하나라도 없다면 에러
  Object.keys(body).forEach((value) => {
    if (!body[value]) {
      return NextResponse.error();
    }
  });

  // product 테이블에 저장
  const product = await prisma.product.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      latitude,
      longitude,
      price: Number(price),
      userId: currentUser.id,
    },
  });
  return NextResponse.json(product);
}
