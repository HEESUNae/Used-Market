import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/helpers/prismadb';
import bcrypt from 'bcryptjs';

// NextAuthOptions는 authOptions의 타입임
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // 구글 로그인
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      // 로그인 인증
      async authorize(credentials, req) {
        // 이메일,비밀번호 둘다 없으면 에러발생
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invaild credentials');
        }

        // 디비에서 일치하는 이메일 찾기
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // 회원가입한 유저가 아니거나, 해시된 패스워드가 없는경우(=OAuth로 로그인한 유저)일 경우 에러발생
        if (!user || !user?.hashedPassword) {
          throw new Error('Invaild credentials');
        }

        // 사용자가 입력한 비밀번호와 디비에 해시비밀번호가 일치하는지 확인
        const isCorretPassword = await bcrypt.compare(credentials.password, user.hashedPassword);

        // 일치하지 않다면 에러발생
        if (!isCorretPassword) {
          throw new Error('Invaild credentials');
        }
        return user;
      },
    }),
  ],
  // jwt 형태
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30days
  },
  // 페이지 커스텀
  pages: {
    signIn: '/auth/login', // 로그인 페이지
  },
  callbacks: {
    // user와 token 데이터를 합쳐 session 함수에 token 파라미터로 전달한다.
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
};

export default NextAuth(authOptions);
