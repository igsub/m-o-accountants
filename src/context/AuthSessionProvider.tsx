'use client'

import { SessionProvider, SessionProviderProps } from "next-auth/react"

export default function AuthSessionProvider({ children, session }: SessionProviderProps) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}
