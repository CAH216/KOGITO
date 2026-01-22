'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { writeFile } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function updatePassword(formData: FormData) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return { error: "Non autorisé" }
    }

    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { error: "Tous les champs sont requis" }
    }

    if (newPassword !== confirmPassword) {
        return { error: "Les nouveaux mots de passe ne correspondent pas" }
    }
    
    if (newPassword.length < 6) {
        return { error: "Le mot de passe doit faire 6 caractères minimum" }
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user || !user.password) {
        return { error: "Utilisateur non trouvé" }
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
         return { error: "Mot de passe actuel incorrect" }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword }
    })

    return { success: "Mot de passe mis à jour avec succès !" }
}

export async function updateProfile(formData: FormData) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return { error: "Non autorisé" }
    }

    const name = formData.get('name') as string
    const imageFile = formData.get('image') as File | null

    if (!name) {
        return { error: "Le nom est obligatoire" }
    }

    // Role check
    const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!currentUser) {
         return { error: "Utilisateur introuvable." }
    }

    let imageUrl = currentUser.image;

    // Handle Image Upload (Denylisted for Parent)
    if (imageFile && imageFile.size > 0) {
        if (currentUser.role === 'PARENT') {
             // Silently ignore or throw? Requirement says "pas pour parent". 
             // We can just skip updating image for parent.
        } else {
            // For Tutor / Employee / Admin
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const filename = `${uuidv4()}${path.extname(imageFile.name)}`;
            const uploadDir = path.join(process.cwd(), 'public/uploads/avatars');
            
            const fs = require('fs');
            if (!fs.existsSync(uploadDir)){
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            await writeFile(path.join(uploadDir, filename), buffer);
            imageUrl = `/uploads/avatars/${filename}`;
        }
    }

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name,
            image: imageUrl
        }
    })

    // Revalidate paths for all roles
    revalidatePath('/parent/settings')
    revalidatePath('/tutor/settings')
    revalidatePath('/employee/settings')
    revalidatePath('/admin/settings')

    return { success: "Profil mis à jour avec succès !" }
}

