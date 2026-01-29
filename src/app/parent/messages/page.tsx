import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getConversations } from '@/actions/message-actions';
import ChatLayout from '@/components/chat/ChatLayout';

import { startConversation } from '@/actions/message-actions';

interface MessagesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function MessagesPage(props: MessagesPageProps) {
    const searchParams = await props.searchParams;
    const initialConvId = typeof searchParams.id === 'string' ? searchParams.id : undefined;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect('/auth/login');

    const conversations = await getConversations();

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col">
             <div className="mb-6 px-4 md:px-0">
                <h1 className="text-3xl font-bold text-slate-900">Messagerie</h1>
                <p className="text-slate-500">Discutez avec les tuteurs de vos enfants.</p>
            </div>
            
            <div className="flex-1 min-h-0">
                {/* @ts-ignore */}
                <ChatLayout 
                    currentUserRole="PARENT" 
                    initialConversations={conversations} 
                    initialSelectedId={initialConvId}
                />
            </div>
        </div>
    );
}