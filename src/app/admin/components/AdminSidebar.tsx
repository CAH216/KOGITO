'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  Home, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  GraduationCap,
  BookOpen,
  BarChart3,
  Building2,
  Calendar,
  ShieldAlert,
  MessageSquare
} from 'lucide-react';

export default function AdminSidebar({ user }: { user: { name?: string | null, email?: string | null } }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Vue d\'ensemble', href: '/admin/dashboard', icon: Home },
    { name: 'Utilisateurs', href: '/admin/users', icon: Users },
    { name: 'Établissements', href: '/admin/schools', icon: Building2 },
    { name: 'Tuteurs', href: '/admin/tutors', icon: GraduationCap },
    { name: 'Sessions', href: '/admin/sessions', icon: Calendar },
    { name: 'Logs Système', href: '/admin/logs', icon: ShieldAlert },
    { name: 'Messagerie', href: '/admin/messages', icon: MessageSquare },
    { name: 'Statistiques', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white shadow-lg text-gray-600 hover:text-gray-900"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
        md:translate-x-0 md:static md:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 bg-slate-950">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Kogito Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'}
                  `}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Logout */}
          <div className="p-4 bg-slate-950">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'Utilisateur'}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
              </div>
            </div>
            <button 
                onClick={() => signOut({ callbackUrl: '/auth/signout' })}
                className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-900 hover:text-red-300 transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
