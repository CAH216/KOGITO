'use server';

import { prisma } from "@/lib/prisma";

export async function getSchoolReports(organizationId: string) {
    if (!organizationId) return null;

    // 1. Engagement (Active Students / Total Students)
    const totalStudents = await prisma.student.count({
        where: { organizationId }
    });

    const activeStudents = await prisma.learningSession.findMany({
        where: { student: { organizationId } },
        distinct: ['studentId']
    });

    const engagementRate = totalStudents > 0 
        ? Math.round((activeStudents.length / totalStudents) * 100) 
        : 0;

    // 2. Total Hours
    const sessions = await prisma.learningSession.findMany({
        where: { 
            student: { organizationId },
            status: 'COMPLETED',
            endTime: { not: null }
        },
        select: { startTime: true, endTime: true }
    });

    let totalHours = 0;
    sessions.forEach(s => {
        if (s.endTime) {
            const duration = (s.endTime.getTime() - s.startTime.getTime()) / (1000 * 60 * 60);
            totalHours += duration;
        }
    });

    // 3. Satisfaction
    // Get average rating of tutors used by this organization
    // This is tricky as tutors are not directly linked to org in the session, but through the session itself.
    // reviews are linked to sessions.
    
    // Actually, sessions have review relation now.
    const reviews = await prisma.sessionReview.findMany({
        where: {
            session: { student: { organizationId } }
        }
    });

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "N/A";

    return {
        engagementRate,
        totalHours: Math.round(totalHours),
        avgRating,
        reviewCount: reviews.length
    };
}

export async function getSchoolNotifications(organizationId: string) {
    if (!organizationId) return [];

    // Combine recent students and sessions
    const recentStudents = await prisma.student.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        take: 3
    });

    const recentSessions = await prisma.learningSession.findMany({
        where: { student: { organizationId } },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: { student: true, tutor: { include: { user: true } } }
    });

    // Transform into "Notifications"
    const notifications: any[] = [];

    recentStudents.forEach(s => {
        notifications.push({
            id: `student-${s.id}`,
            type: 'REGISTER',
            title: 'Nouvelle inscription',
            desc: `${s.name} a rejoint l'établissement`,
            date: s.createdAt,
            icon: 'Users',
            color: 'blue'
        });
    });

    recentSessions.forEach(s => {
        notifications.push({
            id: `session-${s.id}`,
            type: 'SESSION',
            title: 'Session planifiée',
            desc: `Cours de ${s.subject} pour ${s.student.name} avec ${s.tutor.user.name}`,
            date: s.createdAt,
            icon: 'Calendar',
            color: 'violet'
        });
    });

    // Sor by date desc
    return notifications.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
}
