import { Bell, Search } from "lucide-react";

interface AdminHeaderProps {
  user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
  }
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800">Administration</h2>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative hidden md:block">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="Rechercher..." 
             className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 lg:w-64"
           />
        </div>

        <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-slate-200">
           <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user.name || 'Admin'}</p>
              <p className="text-xs text-slate-500">Administrateur</p>
           </div>
           <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-50">
              {user.name ? user.name[0].toUpperCase() : 'A'}
           </div>
        </div>
      </div>
    </header>
  );
}
