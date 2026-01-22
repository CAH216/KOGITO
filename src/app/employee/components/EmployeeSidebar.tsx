'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  MessageSquare, 
  FileCheck,
  Building2,
  Settings,
  Menu,
  X,
  LogOut,
  Calendar,
  MessageCircle
} from 'lucide-react';

export default function EmployeeSidebar({ user }: { user: { name?: string | null, email?: string | null } }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Tableau de bord', href: '/employee/dashboard', icon: LayoutDashboard },
    { name: 'Tuteurs à valider', href: '/employee/tutors/verification', icon: FileCheck },
    { name: 'Messagerie', href: '/employee/messages', icon: MessageCircle },
    { name: 'Sessions', href: '/employee/sessions', icon: Calendar },
    { name: 'Établissements', href: '/employee/schools', icon: Building2 },
  ];

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white shadow-lg text-slate-600 hover:text-slate-900"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">Kogito Staff</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Interface Employé</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }
                    `}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-200 font-bold border border-blue-500/30">
              {user.name?.[0] || 'E'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signout' })}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors w-full"
          >
            <LogOut size={16} />
            Se déconnecter
          </button>
        </div>
      </div>
    </>
  );
}
