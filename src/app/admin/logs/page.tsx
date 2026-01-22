'use client';

import { useState, useEffect } from 'react';
import { getSystemLogs, SystemLogWithUser } from '@/actions/log-actions';
import { 
  ShieldAlert, 
  Info, 
  AlertTriangle, 
  XCircle, 
  Search, 
  RefreshCw,
  Filter
} from 'lucide-react';

/* 
  Use standard string for UI representation to decouple from server-side enum in Client Components 
  if the enum import causes issues with Node deps (like pg).
*/
type LogLevelUI = "INFO" | "WARNING" | "ERROR" | "SECURITY";

export default function LogsPage() {
  const [logs, setLogs] = useState<SystemLogWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  const fetchLogs = async () => {
    setLoading(true);
    // Cast to any to bypass strict enum check on client side for the Fetch call
    const result = await getSystemLogs(100, filterLevel !== 'ALL' ? (filterLevel as any) : undefined);
    if (result.success && result.logs) {
      setLogs(result.logs);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [filterLevel]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "INFO": return <Info className="text-blue-500" size={16} />;
      case "WARNING": return <AlertTriangle className="text-amber-500" size={16} />;
      case "ERROR": return <XCircle className="text-red-500" size={16} />;
      case "SECURITY": return <ShieldAlert className="text-purple-600" size={16} />;
      default: return <Info size={16} />;
    }
  };

  const getLevelBadge = (level: string) => {
    const base = "px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide";
    switch (level) {
        case "INFO": return <span className={`${base} bg-blue-100 text-blue-700`}>Info</span>;
        case "WARNING": return <span className={`${base} bg-amber-100 text-amber-700`}>Warning</span>;
        case "ERROR": return <span className={`${base} bg-red-100 text-red-700`}>Error</span>;
        case "SECURITY": return <span className={`${base} bg-purple-100 text-purple-700`}>Security</span>;
        default: return <span className="bg-slate-100 text-slate-700">Log</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Logs Système</h1>
          <p className="text-slate-500">Historique des 100 dernières activités du système.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={fetchLogs} 
                className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
                title="Actualiser"
            >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <Filter className="text-slate-400" size={20} />
          <div className="flex gap-2">
              {['ALL', 'INFO', 'WARNING', 'ERROR', 'SECURITY'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setFilterLevel(lvl)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        filterLevel === lvl 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                      {lvl === 'ALL' ? 'Tous' : lvl}
                  </button>
              ))}
          </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
             <div className="p-12 text-center text-slate-500">Chargement des logs...</div>
        ) : logs.length === 0 ? (
             <div className="p-12 text-center text-slate-500">Aucun log trouvé pour cette période.</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase">
                            <th className="px-6 py-4 font-semibold w-24">Niveau</th>
                            <th className="px-6 py-4 font-semibold w-48">Action</th>
                            <th className="px-6 py-4 font-semibold">Message</th>
                            <th className="px-6 py-4 font-semibold w-48">Utilisateur</th>
                            <th className="px-6 py-4 font-semibold w-40">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {getLevelIcon(log.level)}
                                        {getLevelBadge(log.level)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-slate-600 bg-slate-50/50">
                                    {log.action}
                                </td>
                                <td className="px-6 py-4 text-slate-700">
                                    <p className="font-medium">{log.message}</p>
                                    {log.metadata && Object.keys(log.metadata as object).length > 0 && (
                                        <details className="mt-1">
                                            <summary className="text-xs text-blue-600 cursor-pointer hover:underline outline-none">
                                                Voir détails
                                            </summary>
                                            <pre className="mt-2 p-2 bg-slate-900 text-green-400 text-xs rounded overflow-x-auto">
                                                {JSON.stringify(log.metadata, null, 2)}
                                            </pre>
                                        </details>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {log.user ? (
                                        <div>
                                            <p className="font-medium text-slate-900">{log.user.name}</p>
                                            <p className="text-xs text-slate-500">{log.user.email}</p>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 italic">Système / Anonyme</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                    {new Date(log.createdAt).toLocaleString('fr-FR')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}
