import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

// [...nextauth] 서버컴포넌트 내용을 가져온다.
export async function getSession() {
  return await getServerSession(authOptions);
}

// 어디서든지 세션값을 활용하기 위해 모듈화
export default async function getCurrentUser() {
  try {
    const session = await getSession();

    // 이메일이 입력되지 않으면 Null 반환
    if (!session?.user?.email) {
      return null;
    }

    // 일치하는 유저가 있으면 프리즈마 이용해서 찾는다.
    const currentUser = await prisma?.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    // 디비에 이메일이 일치하는 유저가 없으면 Null 반환
    if (!currentUser) {
      return null;
    }
    return currentUser;
  } catch (error) {
    return null;
  }
}
