import NextAuth from 'next-auth'

import type { DefaultSession } from 'next-auth'
import type { JWT } from "next-auth/jwt"

declare module 'next-auth' {
  interface Session {
    user?: {
      accessToken: string,
      data: any
    } & DefaultSession['user']
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token: string
    account: string
  }
}
