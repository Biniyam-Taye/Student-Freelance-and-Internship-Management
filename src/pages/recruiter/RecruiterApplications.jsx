import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import SearchFilter from '../../components/common/SearchFilter';
import { fetchRecruiterApplications, updateApplicationStatus } from '../../features/applications/applicationSlice';

export default function RecruiterApplications() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { items: apps, loading } = useSelector(state => state.applications);
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(fetchRecruiterApplications());
    }, [dispatch]);

    const updateStatus = (id, status) => {
        dispatch(updateApplicationStatus({ id, status }));
    };

    const filtered = apps.filter(a => {
        const studentName = a.student?.name || '';
        const position = a.opportunity?.position || '';
        if (!search) return true;
        return studentName.toLowerCase().includes(search.toLowerCase()) || position.toLowerCase().includes(search.toLowerCase());
    });

    const columns = [
        {
            key: 'applicant', title: 'Applicant',
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {row.student?.name?.[0] || 'A'}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{row.student?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{row.student?.university}</p>
                    </div>
                </div>
            ),
        },
        { key: 'position', title: 'Position', render: (_, row) => <span className="text-sm text-gray-700 dark:text-gray-300">{row.opportunity?.position}</span> },
        {
            key: 'skills', title: 'Skills',
            render: (_, row) => {
                const skills = row.student?.skills || [];
                return (
                    <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 2).map((s, i) => <span key={i} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-[10px]">{s}</span>)}
                        {skills.length > 2 && <span className="text-xs text-gray-400">+{skills.length - 2}</span>}
                    </div>
                );
            },
        },
        { key: 'createdAt', title: 'Applied', render: (v) => <span className="text-xs text-gray-400">{new Date(v).toLocaleDateString()}</span> },
        { key: 'status', title: 'Status', align: 'center', render: (v) => <Badge variant={v} dot>{t(`status.${v}`)}</Badge> },
        {
            key: '_id', title: 'Actions', align: 'right',
            render: (_, row) => (
                <div className="flex items-center gap-1.5 justify-end">
                    {row.status !== 'shortlisted' && row.status !== 'rejected' && (
                        <button onClick={() => updateStatus(row._id, 'shortlisted')} className="px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 font-medium transition-colors">
                            {t('common.shortlist')}
                        </button>
                    )}
                    {row.status !== 'accepted' && (
                        <button onClick={() => updateStatus(row._id, 'accepted')} className="px-2.5 py-1 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 font-medium transition-colors">
                            {t('common.accept')}
                        </button>
                    )}
                    {row.status !== 'rejected' && (
                        <button onClick={() => updateStatus(row._id, 'rejected')} className="px-2.5 py-1 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 font-medium transition-colors">
                            {t('common.reject')}
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 page-enter">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('dashboard.applications')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Review and manage all applicants</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['pending', 'shortlisted', 'accepted', 'rejected'].map((s) => (
                    <div key={s} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-4 text-center shadow-sm">
                        <div className="text-xl font-black text-gray-900 dark:text-white">{apps.filter(a => a.status === s).length}</div>
                        <Badge variant={s} className="mx-auto mt-1">{t(`status.${s}`)}</Badge>
                    </div>
                ))}
            </div>

            <SearchFilter onSearch={setSearch} />

            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-1 shadow-sm">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading applications...</div>
                ) : (
                    <Table columns={columns} data={filtered} emptyMessage={t('common.no_data')} />
                )}
            </div>
        </div>
    );
}
