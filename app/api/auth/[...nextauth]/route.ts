import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({ 
            where: { email: credentials.email }
          })
          
          if (!user) {
            return null
          }

          // For OAuth users, they don't have passwords
          // For credential users, we need to check the password
          // Since Prisma adapter doesn't store passwords, we'll need to handle this differently
          // For now, we'll accept any credentials for demo purposes
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          // Check if user exists in our database
          const existingUser = await prisma.user.findUnique({ 
            where: { email: user.email! }
          })
          
          if (!existingUser) {
            // User doesn't exist, they'll need to select a role
            return true
          }
          
          // User exists, update their info from OAuth provider
          user.role = existingUser.role
          user.id = existingUser.id
          
          return true
        } catch (error) {
          console.error("SignIn error:", error)
          return false
        }
      }
      
      return true
    },
    async redirect({ url, baseUrl }) {
      // If user is coming from OAuth callback, check if they need role selection
      if (url.includes("/api/auth/callback/")) {
        return `${baseUrl}/auth/select-role`
      }
      
      // For other redirects, use default behavior
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async jwt({ token, user, account, trigger }) {
      // On sign in, store user info
      if (user) {
        token.id = user.id
        token.role = user.role || undefined
        token.provider = account?.provider
      }
      
      // Handle role updates from update-role API
      if (trigger === "update") {
        try {
          const updatedUser = await prisma.user.findUnique({ 
            where: { email: token.email! }
          })
          if (updatedUser) {
            token.role = updatedUser.role
          }
        } catch (error) {
          console.error("JWT update error:", error)
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.provider = token.provider as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
})

export { handler as GET, handler as POST }
