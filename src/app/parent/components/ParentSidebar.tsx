'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Users, 
  Search, 
  Calendar, 
  MessageCircle, 
  CreditCard, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  GraduationCap
} from 'lucide-react';
import { selectStudentProfile } from '@/actions/profile-actions';

interface Student {
  id: string;
  name: string;
  grade: string | null;
}

interface ParentSidebarProps {
  user: { name?: string | null, email?: string | null };
  students: Student[];
  currentStudentId?: string;
}

export default function ParentSidebar({ user, students, currentStudentId }: ParentSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const currentStudent = students.find(s => s.id === currentStudentId);

  const handleSwitchProfile = async (studentId: string) => {
    await selectStudentProfile(studentId);
    setIsProfileMenuOpen(false);
    window.location.reload();
  };

  const navigation = [
    { name: 'Tableau de bord', href: '/parent/dashboard', icon: LayoutDashboard },
    { name: 'Mes Enfants', href: '/parent/children', icon: Users },
    { name: 'Trouver un tuteur', href: '/parent/tutors/search', icon: Search },
    { name: 'Planning', href: '/parent/schedule', icon: Calendar },
    { name: 'Messages', href: '/parent/messages', icon: MessageCircle },
    { name: 'Facturation', href: '/parent/billing', icon: CreditCard },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white shadow-lg text-slate-600 hover:text-slate-900"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col h-screen
      `}>
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Kogito</span>
        </div>

        {/* Child Switcher */}
        <div className="px-4 pt-6 pb-2">
           <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-slate-50 transition-colors bg-white shadow-sm"
              >
                  <div className="flex items-center gap-3 overflow-hidden">
                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0 text-sm">
                        {currentStudent ? currentStudent.name.charAt(0) : <UserIcon size={14} />}
                     </div>
                     <div className="flex flex-col items-start truncate">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vue Enfant</span>
                        <span className="text-sm font-bold text-slate-800 truncate block w-28 text-left">
                            {currentStudent ? currentStudent.name : 'Sélectionner'}
                        </span>
                     </div>
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {isProfileMenuOpen && (
                 <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 animate-fade-in p-1">
                     <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Mes Enfants</p>
                     <div className="max-h-48 overflow-y-auto">
                     {students.map((student) => (
                        <button
                           key={student.id}
                           onClick={() => handleSwitchProfile(student.id)}
                           className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                              currentStudentId === student.id 
                                ? 'bg-blue-50 text-blue-700 font-medium' 
                                : 'text-slate-600 hover:bg-slate-50'
                           }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full bg-blue-500 transition-opacity ${currentStudentId === student.id ? 'opacity-100' : 'opacity-0'}`}></span>
                            {student.name}
                        </button>
                     ))}
                     </div>
                 </div>
              )}
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-4">
          <div className="mt-4 mb-2 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Menu Principal
          </div>
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }
                    `}
                  >
                    <item.icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 mb-4 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Compte
          </div>
          <ul className="space-y-1">
             <li>
                <Link
                    href="/parent/settings"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                    <Settings size={18} className="text-slate-400" />
                    Paramètres
                </Link>
             </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
              {user.name?.[0] || 'P'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signout' })}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium justify-center border border-transparent hover:border-red-100"
          >
            <LogOut size={16} />
            Se déconnecter
          </button>
        </div>
      </div>
    </>
  );
}
