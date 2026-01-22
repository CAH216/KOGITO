'use client';

import { Trash2 } from 'lucide-react';
import { deleteStudentAccount } from '@/actions/user-actions';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function DeleteChildButton({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!confirm('Êtes-vous sûr de vouloir supprimer ce profil ? Cette action est irréversible.')) {
          return;
      }

      startTransition(async () => {
          const result = await deleteStudentAccount(studentId);
          if (result.success) {
              router.push('/parent/children');
              router.refresh();
          } else {
              alert(result.error);
          }
      });
  };

  return (
      <button 
        onClick={handleDelete}
        disabled={isPending}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
      >
        <Trash2 size={18} />
        {isPending ? 'Suppression...' : 'Supprimer'}
      </button>
  );
}
