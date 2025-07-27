"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  const customSignIn = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      throw new Error("Invalid credentials")
    }
  }

  const customSignUp = async (name: string, email: string, password: string) => {
    // TODO: Implement actual user registration API call
    // For now, just sign in after "registration"
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      throw new Error("Registration failed")
    }
  }

  return {
    user: session?.user
      ? {
          id: session.user.id || "1",
          name: session.user.name || "",
          email: session.user.email || "",
          avatar: session.user.image,
        }
      : null,
    loading: status === "loading",
    signIn: customSignIn,
    signUp: customSignUp,
    signOut: () => signOut(),
  }
}
