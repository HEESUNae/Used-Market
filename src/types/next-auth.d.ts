import { DefaultSession } from 'next-auth';

// session type 자동완성 설정
declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string;
    } & DefaultSession['user'];
  }
}
