'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const PartnerSchema = z.object({
  organizationName: z.string().min(2, "Nom de l'organisation requis"),
  organizationType: z.enum(["SCHOOL", "AGENCY"]),
  contactName: z.string().min(2, "Nom de contact requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe doit faire 6 caractères min"),
  phone: z.string().optional(),
  message: z.string().optional()
});

export async function submitPartnerRequest(formData: FormData) {
  const data = {
    organizationName: formData.get('organizationName'),
    organizationType: formData.get('organizationType'),
    contactName: formData.get('contactName'),
    email: formData.get('email'),
    password: formData.get('password'),
    phone: formData.get('phone'),
    message: formData.get('message'),
  };

  const parsed = PartnerSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "Veuillez vérifier les champs du formulaire." };
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email }
  });

  if (existingUser) {
      return { success: false, error: "Un compte existe déjà avec cet email." };
  }

  try {
      // 1. Create Organization (PENDING)
      // Generate code: KOGITO-[3CHARS]-[RANDOM]
      const cleanName = parsed.data.organizationName.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
      const random = Math.floor(1000 + Math.random() * 9000);
      const code = `KOGITO-${cleanName}-${random}`;

      const org = await prisma.organization.create({
          data: {
              name: parsed.data.organizationName,
              type: parsed.data.organizationType as any,
              code: code,
              status: 'PENDING',
              contactEmail: parsed.data.email,
              phoneNumber: parsed.data.phone,
          }
      });

      // 2. Create School Admin User
      const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

      await prisma.user.create({
          data: {
              name: parsed.data.contactName,
              email: parsed.data.email,
              password: hashedPassword,
              role: 'SCHOOL_ADMIN',
              organizationId: org.id
          }
      });

      return { success: true };
  } catch (error) {
      console.error("Partner Registration Error:", error);
      return { success: false, error: "Erreur lors de l'enregistrement." };
  }
}
