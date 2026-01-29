'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

export async function createSchool(formData: FormData) {
  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const contactEmail = formData.get('contactEmail') as string
  const phoneNumber = formData.get('phoneNumber') as string

  if (!name || name.length < 3) {
    throw new Error('Name is required and must be at least 3 characters')
  }

  // Generate code: KOGITO-[3CHARS]-[RANDOM]
  // clean name for code
  const cleanName = name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase()
  const random = Math.floor(1000 + Math.random() * 9000)
  const code = `KOGITO-${cleanName.length > 0 ? cleanName : 'SCH'}-${random}`

  await prisma.organization.create({
    data: {
      name,
      code,
      type: 'SCHOOL',
      address: address || null,
      contactEmail: contactEmail || null,
      phoneNumber: phoneNumber || null
    }
  })

  revalidatePath('/admin/schools')
  redirect('/admin/schools')
}

export async function deleteSchool(id: string) {
  await prisma.organization.delete({
    where: { id }
  })
  revalidatePath('/admin/schools')
}

export async function updateSchoolStatus(id: string, status: 'ACTIVE' | 'SUSPENDED' | 'PENDING') {
  await prisma.organization.update({
    where: { id },
    data: { status }
  })
  revalidatePath('/admin/schools')
  revalidatePath(`/admin/schools/${id}`)
}

export async function addSchoolAdmin(formData: FormData) {
  const organizationId = formData.get('organizationId') as string
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!organizationId || !email || !password || !name) {
      throw new Error("Missing fields")
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
      where: { email }
  })

  if (existingUser) {
      throw new Error("User already exists")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
      data: {
          name,
          email,
          password: hashedPassword,
          role: 'SCHOOL_ADMIN',
          organizationId
      }
  })

  revalidatePath(`/admin/schools/${organizationId}`)
  revalidatePath('/admin/schools')
}
