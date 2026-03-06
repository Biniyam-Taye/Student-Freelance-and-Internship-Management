import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { UserCheck, UserX, UserPlus, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import SearchFilter from '../../components/common/SearchFilter';
import {
    fetchPendingSupervisors,
    fetchMySupervisors,
    approveSupervisor,
    rejectSupervisor,
} from '../../features/supervisors/supervisorSlice';
import { useState } from 'react';

export default function ManageSupervisors() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pending, mine, loading } = useSelector((s) => s.supervisors);
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(fetchPendingSupervisors());
        dispatch(fetchMySupervisors());
    }, [dispatch]);

    const filteredPending = pending.filter((u) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q)
        );
    });

    const filteredMine = mine.filter((u) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q)
        );
    });

    const pendingColumns = [
        {
            key: 'name',
            title: 'Supervisor',
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {row.name?.[0] || 'S'}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                            {row.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {row.email}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'createdAt',
            title: 'Joined',
            render: (v) => (
                <span className="text-xs text-gray-400">
                    {new Date(v).toLocaleDateString()}
                </span>
            ),
        },
        {
            key: 'status',
            title: 'Status',
            render: () => (
                <Badge variant="pending" dot>
                    Pending Approval
                </Badge>
            ),
        },
        {
            key: '_id',
            title: 'Actions',
            align: 'right',
            render: (_, row) => (
                <div className="flex items-center gap-1.5 justify-end">
                    <button
                        onClick={() => dispatch(approveSupervisor(row._id))}
                        disabled={loading}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 font-medium transition-colors"
                    >
                        <UserCheck size={12} /> {t('common.approve')}
                    </button>
                    <button
                        onClick={() => dispatch(rejectSupervisor(row._id))}
                        disabled={loading}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 font-medium transition-colors"
                    >
                        <UserX size={12} /> {t('common.reject')}
                    </button>
                </div>
            ),
        },
    ];

    const mineColumns = [
        {
            key: 'name',
            title: 'Supervisor',
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {row.name?.[0] || 'S'}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                            {row.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {row.email}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'status',
            title: 'Status',
            render: (v, row) => (
                <Badge
                    variant={row.status === 'active' ? 'accepted' : 'rejected'}
                    dot
                >
                    {row.status}
                </Badge>
            ),
        },
        {
            key: 'createdAt',
            title: 'Joined',
            render: (v) => (
                <span className="text-xs text-gray-400">
                    {new Date(v).toLocaleDateString()}
                </span>
            ),
        },
        {
            key: '_id',
            title: 'Actions',
            align: 'right',
            render: (_, row) => (
                <div className="flex items-center gap-1.5 justify-end">
                    <button
                        onClick={() =>
                            navigate('/recruiter/messages', {
                                state: {
                                    initialContact: {
                                        _id: row._id,
                                        name: row.name,
                                        role: row.role || 'supervisor',
                                        company: row.company,
                                        university: row.university,
                                        avatar: row.avatar,
                                    },
                                },
                            })
                        }
                        className="flex items-center gap-1 px-2.5 py-1 text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 font-medium transition-colors"
                    >
                        <MessageSquare size={12} /> Message
                    </button>
                    <button
                        onClick={() => dispatch(rejectSupervisor(row._id))}
                        disabled={loading}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 font-medium transition-colors"
                    >
                        <UserX size={12} /> Remove
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 page-enter">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                        Supervisors
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Approve or reject supervisors who manage students on your behalf.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-2xl border border-indigo-100 dark:border-indigo-800/40 text-xs text-indigo-700 dark:text-indigo-300">
                    <UserPlus size={14} />
                    <span>
                        {filteredPending.length} pending · {filteredMine.length} active
                    </span>
                </div>
            </div>

            <div className="max-w-xs">
                <SearchFilter onSearch={setSearch} />
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                        Pending supervisor requests
                    </h2>
                    <Table
                        columns={pendingColumns}
                        data={filteredPending}
                        loading={loading}
                        emptyMessage="No pending supervisors."
                    />
                </div>

                <div>
                    <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                        Your approved supervisors
                    </h2>
                    <Table
                        columns={mineColumns}
                        data={filteredMine}
                        loading={loading}
                        emptyMessage="No supervisors have been approved yet."
                    />
                </div>
            </div>
        </div>
    );
}

