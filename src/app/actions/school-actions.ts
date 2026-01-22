'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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

  await prisma.school.create({
    data: {
      name,
      code,
      address: address || null,
      contactEmail: contactEmail || null,
      phoneNumber: phoneNumber || null
    }
  })

  revalidatePath('/admin/schools')
  redirect('/admin/schools')
}

export async function deleteSchool(id: string) {
  await prisma.school.delete({
    where: { id }
  })
  revalidatePath('/admin/schools')
}
