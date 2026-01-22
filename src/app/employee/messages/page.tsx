import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getConversations } from '@/actions/message-actions';
import ChatLayout from '@/components/chat/ChatLayout';

export default async function MessagesPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect('/auth/login');

    const conversations = await getConversations();

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col animate-fade-in">
             <div className="mb-6 px-4 md:px-0">
                <h1 className="text-3xl font-bold text-slate-900">Messagerie Employé</h1>
                <p className="text-slate-500">Support et coordination.</p>
            </div>
            
            <div className="flex-1 min-h-0">
                {/* @ts-ignore */}
                <ChatLayout currentUserRole="EMPLOYEE" initialConversations={conversations} />
            </div>
        </div>
    );
}
