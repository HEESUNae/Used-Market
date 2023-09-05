import bcrypt from 'bcryptjs';
import prisma from '@/helpers/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;

  // 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(password, 12);

  // 프리즈마 이용해서 디비에 회원등록
  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    },
  });

  return NextResponse.json(user);
}
