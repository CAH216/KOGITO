import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params; // Await params in newer Next.js or direct access depending on version, keep standard for App Router.
        
        // In Next 15, params is a promise. In 14, it's an object. 
        // We'll safely handle it or assuming standard 14 behaviour where it's already resolved in the function arg
        // but Typescript might complain.
        // Actually, props is { params: { id: string } }.
        
        const profile = await prisma.tutorProfile.findUnique({
            where: { id },
            select: { cvData: true, cvMimeType: true }
        });

        if (!profile || !profile.cvData) {
            return new NextResponse("CV not found", { status: 404 });
        }

        const headers = new Headers();
        headers.set("Content-Type", profile.cvMimeType || "application/pdf");
        headers.set("Content-Disposition", `inline; filename="cv-${id}.pdf"`);

        return new NextResponse(profile.cvData, {
            status: 200,
            headers
        });

    } catch (error) {
        console.error("Error serving CV:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
