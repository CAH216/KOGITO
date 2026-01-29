import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BillingContent from "./BillingContent";
import { redirect } from "next/navigation";

export default async function ParentBillingPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/auth/login");

    const parentProfile = await prisma.parentProfile.findUnique({
        where: { userId: session.user.id },
        include: {
            children: {
                include: {
                    organization: true
                }
            }
        }
    });

    if (!parentProfile) return <div className="p-8 text-center text-red-500">Profil parent introuvable.</div>;

    // Determine Organization Status
    // Priority: SCHOOL_PAYS > PARENT_PAYS > Independent
    
    let activeOrg = null;
    
    // Check for School Pays first
    const schoolPaysChild = parentProfile.children.find(c => c.organization?.billingModel === 'SCHOOL_PAYS');
    
    if (schoolPaysChild && schoolPaysChild.organization) {
        activeOrg = {
            id: schoolPaysChild.organization.id,
            name: schoolPaysChild.organization.name,
            billingModel: 'SCHOOL_PAYS' as const
        };
    } else {
        // Fallback to Parent Pays
        const parentPaysChild = parentProfile.children.find(c => c.organization?.billingModel === 'PARENT_PAYS');
        if (parentPaysChild && parentPaysChild.organization) {
             activeOrg = {
                id: parentPaysChild.organization.id,
                name: parentPaysChild.organization.name,
                billingModel: 'PARENT_PAYS' as const
            };
        }
    }

    return (
        <BillingContent 
            organization={activeOrg} 
            childrenCount={parentProfile.children.length} 
        />
    );
}
