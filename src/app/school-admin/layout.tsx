'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Settings, 
  LogOut, 
  School,
  Bell,
  Menu,
  X,
  FileBarChart,
  BrainCircuit
} from 'lucide-react';

export default function SchoolAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { data: session } = useSession();

  const navigation = [
    { name: 'Tableau de bord', href: '/school-admin/dashboard', icon: LayoutDashboard },
    { name: 'Élèves', href: '/school-admin/students', icon: Users },
    { name: 'Parents', href: '/school-admin/parents', icon: Users },
    { name: 'Enseignants / Tuteurs', href: '/school-admin/teachers', icon: GraduationCap },
    { name: 'Classes & Groupes', href: '/school-admin/classes', icon: BookOpen },
    { name: 'Règles IA & Cerveau', href: '/school-admin/ai-rules', icon: BrainCircuit },
    { name: 'Rapports & Statistiques', href: '/school-admin/reports', icon: FileBarChart },
    { name: 'Paramètres Établissement', href: '/school-admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out border-r border-slate-800 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
            <School className="h-6 w-6 text-blue-500 mr-3" />
            <span className="font-bold text-lg tracking-tight">
              {session?.user?.organizationType === 'AGENCY' ? 'Portail Agence' : 'Portail École'}
            </span>

        </div>

        <div className="p-4">
            <nav className="space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.name} 
                            href={item.href}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg group transition-colors ${
                                isActive 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-950">
             <Link href="/auth/signout" className="flex items-center px-4 py-3 text-sm font-medium text-slate-400 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors">
                 <LogOut className="mr-3 h-5 w-5" />
                 Déconnexion
             </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 lg:px-8 shadow-sm z-40">
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <div className="flex-1 flex justify-end items-center gap-6">
                <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-900">{session?.user?.organizationName || 'Organisation'}</p>
                        <p className="text-xs text-slate-500">Administrateur</p>
                    </div>
                    <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200 uppercase">
                        {session?.user?.organizationName?.substring(0, 2).toUpperCase() || 'OR'}
                    </div>
                </div>
            </div>
        </header>

        {/* Content Scroll */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50">
             {children}
        </main>

      </div>
    </div>
  );
}
