import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params; 

        const user = await prisma.user.findUnique({
            where: { id },
            select: { imageData: true, imageMimeType: true }
        });

        if (!user || !user.imageData) {
            // Return a default placeholder or 404
             return new NextResponse("Image not found", { status: 404 });
        }

        const headers = new Headers();
        headers.set("Content-Type", user.imageMimeType || "image/jpeg");
        headers.set("Cache-Control", "public, max-age=3600");

        return new NextResponse(user.imageData, {
            status: 200,
            headers
        });

    } catch (error) {
        console.error("Error serving Avatar:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
