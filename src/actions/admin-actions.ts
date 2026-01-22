'use server'

import { prisma } from "@/lib/prisma"
import { startOfMonth, endOfMonth, subMonths, startOfDay } from "date-fns"

export async function getAdminDashboardStats() {
    try {
        const now = new Date()
        const currentMonthStart = startOfMonth(now)
        const currentMonthEnd = endOfMonth(now)
        const lastMonthStart = startOfMonth(subMonths(now, 1))
        const lastMonthEnd = endOfMonth(subMonths(now, 1))

        // 1. Total Users & Growth
        const totalUsers = await prisma.user.count()
        const lastMonthUsers = await prisma.user.count({
            where: { createdAt: { lt: currentMonthStart } }
        })
        const userGrowth = lastMonthUsers === 0 ? 100 : ((totalUsers - lastMonthUsers) / lastMonthUsers) * 100

        // 2. Active Tutors & Growth
        const activeTutors = await prisma.tutorProfile.count({
            where: { status: 'APPROVED' }
        })
        const lastMonthTutors = await prisma.tutorProfile.count({
            where: { 
                status: 'APPROVED',
                updatedAt: { lt: currentMonthStart } 
            }
        })
        const tutorGrowth = lastMonthTutors === 0 ? 100 : ((activeTutors - lastMonthTutors) / lastMonthTutors) * 100

        // 3. Monthly Sessions & Growth (Created in this month)
        // Note: Using 'startTime' for sessions
        const monthlySessions = await prisma.learningSession.count({
            where: { 
                startTime: { gte: currentMonthStart, lte: currentMonthEnd }
            }
        })
        const lastMonthSessions = await prisma.learningSession.count({
            where: { 
                startTime: { gte: lastMonthStart, lte: lastMonthEnd }
            }
        })
        const sessionGrowth = lastMonthSessions === 0 ? 100 : ((monthlySessions - lastMonthSessions) / lastMonthSessions) * 100

        // 4. Monthly Revenue (Sum of COMPLETED sessions price)
        // If price is null, treat as 0
        const revenueResult = await prisma.learningSession.aggregate({
            _sum: { price: true },
            where: {
                status: 'COMPLETED',
                startTime: { gte: currentMonthStart, lte: currentMonthEnd }
            }
        })
        const currentRevenue = revenueResult._sum.price || 0

        const lastRevenueResult = await prisma.learningSession.aggregate({
            _sum: { price: true },
            where: {
                status: 'COMPLETED',
                startTime: { gte: lastMonthStart, lte: lastMonthEnd }
            }
        })
        const lastRevenue = lastRevenueResult._sum.price || 0
        const revenueGrowth = lastRevenue === 0 ? 100 : ((currentRevenue - lastRevenue) / lastRevenue) * 100

        return {
            users: { value: totalUsers, change: userGrowth },
            tutors: { value: activeTutors, change: tutorGrowth },
            sessions: { value: monthlySessions, change: sessionGrowth },
            revenue: { value: currentRevenue, change: revenueGrowth }
        }

    } catch (error) {
        console.error("Error fetching admin stats:", error)
        return null
    }
}

export async function getRecentUsers() {
    try {
        const users = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
                createdAt: true,
                tutorProfile: {
                    select: { status: true }
                }
            }
        })

        return users.map(user => ({
            id: user.id,
            name: user.name || 'Utilisateur',
            email: user.email,
            role: user.role,
            avatar: user.name ? user.name.slice(0, 2).toUpperCase() : 'U',
            status: user.role === 'TUTOR' && user.tutorProfile 
                ? (user.tutorProfile.status === 'APPROVED' ? 'Actif' : user.tutorProfile.status === 'PENDING' ? 'En attente' : 'Rejeté')
                : 'Actif', // Parents/Students are active by default for now
            date: new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
        }))
    } catch (error) {
        console.error("Error fetching recent users:", error)
        return []
    }
}

export async function getAllTutors() {
    try {
        const tutors = await prisma.tutorProfile.findMany({
            include: {
                user: {
                    select: { name: true, email: true, image: true }
                },
                _count: {
                    select: { sessions: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return tutors;
    } catch (error) {
        console.error("Error getting all tutors", error);
        return [];
    }
}

export async function getAllSessions() {
    try {
        const sessions = await prisma.learningSession.findMany({
            include: {
                student: { select: { name: true } },
                tutor: { 
                    include: { 
                        user: { select: { name: true } } 
                    } 
                }
            },
            orderBy: { startTime: 'desc' }
        });
        return sessions;
    } catch (error) {
        console.error("Error getting all sessions", error);
        return [];
    }
}

export async function getAdminAnalytics() {
    try {
        const now = new Date();
        const start = startOfMonth(now);
        const end = endOfMonth(now);

        // Daily Sessions Count
        const sessions = await prisma.learningSession.findMany({
            where: {
                startTime: { gte: start, lte: end }
            },
            select: { startTime: true }
        });

        // Group by day
        const sessionsByDay: Record<string, number> = {};
        sessions.forEach(s => {
            const day = s.startTime.toLocaleDateString('fr-FR');
            sessionsByDay[day] = (sessionsByDay[day] || 0) + 1;
        });

        // Daily Revenue
        const revenues = await prisma.learningSession.findMany({
            where: {
                startTime: { gte: start, lte: end },
                status: 'COMPLETED'
            },
            select: { startTime: true, price: true }
        });

         const revenueByDay: Record<string, number> = {};
        revenues.forEach(s => {
            const day = s.startTime.toLocaleDateString('fr-FR');
            revenueByDay[day] = (revenueByDay[day] || 0) + (s.price || 0);
        });

        return {
            sessionsByDay,
            revenueByDay
        };

    } catch (error) {
        console.error("Error getting analytics", error);
        return null;
    }
}
