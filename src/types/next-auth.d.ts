// Types for NextAuth session
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      organizationName?: string
      organizationType?: string
    } & DefaultSession["user"]
  }
}
