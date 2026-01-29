'use server'

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// --- PARENT CREATION ---
export async function createSchoolParent(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'SCHOOL_ADMIN') {
        throw new Error("Unauthorized");
    }

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const address = formData.get('address') as string;

    if (!name || !email || !password) {
        throw new Error("Missing required fields");
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("Cet email est déjà utilisé.");
    }

    const hashedPassword = await hash(password, 10);

    // Create User and ParentProfile
    await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'PARENT',
            },
        });

        await tx.parentProfile.create({
            data: {
                userId: user.id,
                phoneNumber,
                address,
                // Note: We don't link Parent strictly to Organization in schema yet,
                // but we link their children.
                // However, we might want to store who created them or a default org relation eventually.
            },
        });
    });

    revalidatePath('/school-admin/parents');
    redirect('/school-admin/parents');
}

// --- TUTOR CREATION ---
export async function createSchoolTutor(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'SCHOOL_ADMIN') {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { organization: true }
    });

    if (!user?.organization) {
        throw new Error("No organization found");
    }

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const subjectsRaw = formData.get('subjects') as string; // Comma separated or similar
    const subjects = subjectsRaw.split(',').map(s => s.trim()).filter(s => s.length > 0);

    if (!name || !email || !password) {
        throw new Error("Missing required fields");
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("Cet email est déjà utilisé.");
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: 'TUTOR',
            tutorProfile: {
                create: {
                    subjects: subjects,
                    isVerified: true,
                    status: 'APPROVED', // Auto-approve since admin added them
                    organizationId: user.organization.id
                }
            }
        }
    });

    revalidatePath('/school-admin/teachers');
    redirect('/school-admin/teachers');
}

// --- CLASS CREATION ---
export async function createSchoolClass(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'SCHOOL_ADMIN') {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { organization: true }
    });

    if (!user?.organization) {
        throw new Error("No organization found");
    }

    const name = formData.get('name') as string;

    if (!name) {
        throw new Error("Review name is required");
    }

    await prisma.classGroup.create({
        data: {
            name,
            organizationId: user.organization.id
        }
    });

    revalidatePath('/school-admin/classes');
    redirect('/school-admin/classes');
}
