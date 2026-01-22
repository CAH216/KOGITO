'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export async function registerParent(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  // childLevel can be used later or stored in metadata

  if (!name || !email || !password) {
    return { error: 'Tous les champs sont obligatoires.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Les mots de passe ne correspondent pas.' }
  }

  if (password.length < 6) {
    return { error: 'Le mot de passe doit contenir au moins 6 caractères.' }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: 'Un utilisateur avec cet email existe déjà.' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'PARENT',
      },
    })

    // Create the associated ParentProfile
    await prisma.parentProfile.create({
        data: {
            userId: user.id
        }
    })

    return { success: true }
  } catch (error) {
    console.error('Registration error:', error)
    return { error: 'Une erreur est survenue lors de l\'inscription.' }
  }
}
