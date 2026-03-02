import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flag, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import { mockReports } from '../../utils/mockData';
import clsx from 'clsx';

export default function Reports() {
    const { t } = useTranslation();
    const [reports, setReports] = useState(mockReports);
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter);

    const updateStatus = (id, status) => {
        setReports(rs => rs.map(r => r.id === id ? { ...r, status } : r));
    };

    const statusVariant = { pending: 'pending', under_review: 'shortlisted', resolved: 'accepted' };
    const typeColor = { Spam: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400', Harassment: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400', 'Misleading Info': 'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400' };

    return (
        <div className="space-y-6 page-enter">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('dashboard.reports')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Review and manage reported issues</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
                {[{ label: 'Pending', count: reports.filter(r => r.status === 'pending').length, icon: AlertTriangle, color: 'text-amber-500' },
                { label: 'Under Review', count: reports.filter(r => r.status === 'under_review').length, icon: Clock, color: 'text-blue-500' },
                { label: 'Resolved', count: reports.filter(r => r.status === 'resolved').length, icon: CheckCircle2, color: 'text-emerald-500' },
                ].map(({ label, count, icon: Icon, color }) => (
                    <div key={label} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-4 text-center shadow-sm">
                        <Icon size={20} className={`${color} mx-auto mb-1.5`} />
                        <div className="text-2xl font-black text-gray-900 dark:text-white">{count}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
                {['all', 'pending', 'under_review', 'resolved'].map((f) => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                            filter === f ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400')}>
                        {f.replace('_', ' ')}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filtered.map((report) => (
                    <div key={report.id} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-5 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                                <Flag size={18} className="text-red-500" />
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className={clsx('tag', typeColor[report.type])}>{report.type}</span>
                                    <Badge variant={statusVariant[report.status]} dot>{report.status.replace('_', ' ')}</Badge>
                                    <span className="text-xs text-gray-400">{report.date}</span>
                                </div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1">Target: {report.target}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Reported by: {report.reportedBy}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{report.description}</p>
                            </div>
                            {report.status !== 'resolved' && (
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {report.status === 'pending' && (
                                        <button onClick={() => updateStatus(report.id, 'under_review')}
                                            className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                                            Review
                                        </button>
                                    )}
                                    <button onClick={() => updateStatus(report.id, 'resolved')}
                                        className="px-3 py-1.5 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors">
                                        Resolve
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
