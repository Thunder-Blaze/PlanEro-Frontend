import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
    apiToken?: string
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    token?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: string
    apiToken?: string
  }
}
