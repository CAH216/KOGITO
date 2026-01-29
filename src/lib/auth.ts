import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/signout",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            tutorProfile: true,
            organization: true, // INCLUDE ORGANIZATION TO CHECK STATUS
          },
        })

        if (!user || !user.password) {
          return null
        }

        // --- SECURITY CHECKS ---

        // 1. Check for School Admin / Agency Admin
        if (user.role === 'SCHOOL_ADMIN' && user.organization) {
            if (user.organization.status === 'PENDING') {
                throw new Error("Votre organisation est en attente de validation par l'administrateur.");
            }
            if (user.organization.status === 'SUSPENDED') {
                 throw new Error("Votre compte organisation a été suspendu.");
            }
        }

        // Vérification du statut tuteur
        // MODIFICATION: On autorise la connexion même si PENDING pour l'accès à l'entretien
        /* 
        if (user.role === 'TUTOR') {
             if (!user.tutorProfile || user.tutorProfile.status !== 'APPROVED') {
                 throw new Error("Votre compte tuteur est en attente de validation.");
             }
        } 
        */

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationName: user.organization?.name,
          organizationType: user.organization?.type
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.organizationName = token.organizationName as string
        session.user.organizationType = token.organizationType as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.organizationName = (user as any).organizationName
        token.organizationType = (user as any).organizationType
      }
      return token
    },
  },
}
