'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getConversations() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    const conversations = await prisma.conversation.findMany({
        where: {
            participants: {
                some: {
                    id: session.user.id
                }
            }
        },
        include: {
            participants: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true
                }
            },
            messages: {
                orderBy: {
                    createdAt: 'desc'
                },
                take: 1
            }
        },
        orderBy: {
            lastMessageAt: 'desc'
        }
    });

    return conversations.map(c => {
        // Logic to determine display name/image
        const otherParticipants = c.participants.filter(p => p.id !== session.user.id);
        
        let displayParticipant;
        const isSupportChat = otherParticipants.some(p => p.role === 'ADMIN' || p.role === 'EMPLOYEE');

        if (session.user.role !== 'ADMIN' && session.user.role !== 'EMPLOYEE' && isSupportChat) {
            // If I am a client (Parent/Tutor) and this is a support chat, show "Kogito Support"
            displayParticipant = {
                id: 'SUPPORT_TEAM',
                name: 'Equipe Support Kogito',
                role: 'SYSTEM',
                image: null,
                email: 'support@kogito.com'
            };
        } else {
            // Otherwise show the first other person (or handle group chat UI later)
            displayParticipant = otherParticipants[0];
        }

        return {
            ...c,
            lastMessage: c.messages[0] || null,
            participant: displayParticipant // Normalized field name for frontend
        };
    });
}

export async function getMessages(conversationId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Ensure access
    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { participants: true }
    });

    if (!conversation || !conversation.participants.some(p => p.id === session.user.id)) {
        throw new Error("Conversation not found or access denied");
    }

    const messages = await prisma.directMessage.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        }
    });

    return { success: true, messages };
}

export async function deleteMessage(messageId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        const message = await prisma.directMessage.findUnique({
            where: { id: messageId }
        });

        if (!message || message.senderId !== session.user.id) {
            return { error: "Cannot delete this message" };
        }

        await prisma.directMessage.delete({
            where: { id: messageId }
        });

        revalidatePath('/tutor/messages');
        revalidatePath('/parent/messages');
        revalidatePath('/admin/messages');
        revalidatePath('/employee/messages');
        
        return { success: true };
    } catch (error) {
        console.error("Error deleting message:", error);
        return { error: "Failed to delete message" };
    }
}

export async function deleteConversation(conversationId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { participants: true }
        });

        if (!conversation || !conversation.participants.some(p => p.id === session.user.id)) {
            return { error: "Unauthorized" };
        }

        // Delete all messages first (cascade usually handles this but good to be explicit if needed)
        await prisma.directMessage.deleteMany({
            where: { conversationId }
        });

        await prisma.conversation.delete({
            where: { id: conversationId }
        });

        revalidatePath('/tutor/messages');
        revalidatePath('/parent/messages');
        revalidatePath('/admin/messages');
        revalidatePath('/employee/messages');

        return { success: true };
    } catch (error) {
        console.error("Error deleting conversation:", error);
        return { error: "Failed to delete conversation" };
    }
}

export async function sendMessage(conversationId: string, content: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: "Unauthorized" };
    if (!content.trim()) return { error: "Message cannot be empty" };

    try {
        // Verify participant
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { participants: true }
        });

        if (!conversation || !conversation.participants.some(p => p.id === session.user.id)) {
            return { error: "Unauthorized" };
        }

        const message = await prisma.directMessage.create({
            data: {
                conversationId,
                senderId: session.user.id,
                content: content.trim()
            }
        });

        await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                lastMessageAt: new Date()
            }
        });

        revalidatePath('/parent/messages');
        revalidatePath('/tutor/messages');
        revalidatePath('/admin/messages');
        revalidatePath('/employee/messages');
        return { success: true, message };
    } catch (error) {
        console.error("Error sending message:", error);
        return { error: "Failed to send message" };
    }
}

export async function startConversation(targetUserId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    // HANDLE SPECIAL SYSTEM SUPPORT TARGET
    if (targetUserId === 'SUPPORT_TEAM') {
        // 1. Find all available staff (Employees and Admins) to be in the group chat
        // Ideally we might want just one "Round Robin" assignment, but the user asked for "System has multiple employees".
        // A shared group chat for support is the most robust simple solution.
        
        const staff = await prisma.user.findMany({
            where: { role: { in: ['EMPLOYEE', 'ADMIN'] } },
            select: { id: true }
        });

        if (staff.length === 0) throw new Error("No support staff available");

        const staffIds = staff.map(s => s.id);

        // Check if I already have a conversation with these EXACT participants?
        // Or simpler: Check if I have any conversation where participants include ME and AT LEAST ONE staff member.
        
        const existingSupportChat = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: session.user.id } } },
                    { participants: { some: { role: { in: ['EMPLOYEE', 'ADMIN'] } } } }
                ]
            }
        });

        if (existingSupportChat) return existingSupportChat.id;

        // Create new Group Chat
        const conversation = await prisma.conversation.create({
            data: {
                participants: {
                    connect: [
                        { id: session.user.id },
                        ...staffIds.map(id => ({ id }))
                    ]
                }
            }
        });

        revalidatePath('/parent/messages');
        revalidatePath('/tutor/messages');
        return conversation.id;
    }

    // NORMAL 1-on-1 FLOW
    // Check if conversation already exists
    const existing = await prisma.conversation.findFirst({
        where: {
            AND: [
                { participants: { some: { id: session.user.id } } },
                { participants: { some: { id: targetUserId } } }
            ]
        }
    });

    if (existing) return existing.id;

    // Optional: Add strict relationship check here if needed for "Logique"
    
    const conversation = await prisma.conversation.create({
        data: {
            participants: {
                connect: [
                    { id: session.user.id },
                    { id: targetUserId }
                ]
            }
        }
    });

    revalidatePath('/parent/messages');
    revalidatePath('/tutor/messages');
    return conversation.id;
}

export async function searchUsersForMessage(query: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: "Unauthorized" };

    const currentUserRole = session.user.role;
    const lowerQuery = query.toLowerCase();

    const searchCondition = query ? {
        OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { email: { contains: query, mode: 'insensitive' as const } }
        ]
    } : {};

    try {
        if (currentUserRole === 'TUTOR') {
            // Find parents of students I have sessions with
            const myProfile = await prisma.tutorProfile.findUnique({ where: { userId: session.user.id } });
            if (!myProfile) return { users: [] };

            const parents = await prisma.user.findMany({
                where: {
                    role: 'PARENT',
                    parentProfile: {
                        children: {
                            some: {
                                sessions: {
                                    some: {
                                        tutorId: myProfile.id
                                    }
                                }
                            }
                        }
                    },
                    ...searchCondition
                },
                select: { id: true, name: true, image: true, email: true, role: true }
            });

            // Also allow contacting support
            // Provide a SINGLE generic System Support contact
            const supportOption = {
                id: 'SUPPORT_TEAM',
                name: 'Equipe Support Kogito',
                image: 'https://ui-avatars.com/api/?name=Kogito+Support&background=0D8ABC&color=fff',
                email: 'support@kogito.com',
                role: 'SYSTEM'
            };

            return { users: [supportOption, ...parents] };
        } 
        
        if (currentUserRole === 'PARENT') {
            // Find tutors of my children
            const myProfile = await prisma.parentProfile.findUnique({ where: { userId: session.user.id } });
            if (!myProfile) return { users: [] };

            const tutors = await prisma.user.findMany({
                where: {
                    role: 'TUTOR',
                    tutorProfile: {
                        sessions: {
                            some: {
                                student: {
                                    parentId: myProfile.id
                                }
                            }
                        }
                    },
                    ...searchCondition
                },
                select: { id: true, name: true, image: true, email: true, role: true }
            });

            // Generic Support Option
            const supportOption = {
                id: 'SUPPORT_TEAM',
                name: 'Equipe Support Kogito',
                image: 'https://ui-avatars.com/api/?name=Kogito+Support&background=0D8ABC&color=fff',
                email: 'support@kogito.com',
                role: 'SYSTEM'
            };

            return { users: [supportOption, ...tutors] };
        }

        if (currentUserRole === 'ADMIN' || currentUserRole === 'EMPLOYEE') {
            if (!query) {
                // Return recent active users or just other staff?
                // Let's return other staff for quick check
                const staff = await prisma.user.findMany({
                    where: { role: { in: ['ADMIN', 'EMPLOYEE'] }, id: { not: session.user.id } },
                    take: 10,
                    select: { id: true, name: true, image: true, email: true, role: true }
                });
                return { users: staff };
            }

            // Search all users
            const users = await prisma.user.findMany({
                where: searchCondition,
                take: 20,
                select: { id: true, name: true, image: true, email: true, role: true }
            });
            return { users };
        }

        return { users: [] };

    } catch (error) {
        console.error("Search error:", error);
        return { users: [] };
    }
}
