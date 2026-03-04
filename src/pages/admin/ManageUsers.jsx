import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, UserX } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import SearchFilter from '../../components/common/SearchFilter';
import { fetchAllUsers, verifyRecruiter, updateUserStatus } from '../../features/admin/adminSlice';
import clsx from 'clsx';

const ROLES = ['all', 'student', 'recruiter', 'pending'];

export default function ManageUsers() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { users, loading } = useSelector(state => state.admin);

    const [roleFilter, setRoleFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const approveRecruiter = (id) => {
        dispatch(verifyRecruiter(id));
    };

    const toggleSuspend = (id, currentStatus) => {
        const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
        dispatch(updateUserStatus({ id, status: newStatus }));
    };

    const pendingRecruiters = users.filter((u) => u.role === 'recruiter' && !u.isVerified);

    const filtered = users.filter(u => {
        if (roleFilter === 'pending') return u.role === 'recruiter' && !u.isVerified;
        if (roleFilter !== 'all' && u.role !== roleFilter) return false;
        if (search) {
            const matchName = u.name?.toLowerCase().includes(search.toLowerCase());
            const matchEmail = u.email?.toLowerCase().includes(search.toLowerCase());
            return matchName || matchEmail;
        }
        return true;
    });

    const columns = [
        {
            key: 'name', title: 'User',
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{row.name?.[0] || 'U'}</div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{row.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{row.email}</p>
                    </div>
                </div>
            ),
        },
        { key: 'role', title: 'Role', render: (v) => <Badge variant={v === 'student' ? 'info' : v === 'recruiter' ? 'purple' : 'warning'} dot className="capitalize">{v}</Badge> },
        {
            key: 'company', title: 'Organization',
            render: (_, row) => <span className="text-sm text-gray-600 dark:text-gray-400">{row.company || row.university || '—'}</span>,
        },
        { key: 'createdAt', title: 'Joined', render: (v) => <span className="text-xs text-gray-400">{new Date(v).toLocaleDateString()}</span> },
        {
            key: 'status', title: 'Status',
            render: (_, row) => (
                <Badge variant={row.status === 'active' && row.isVerified !== false ? 'accepted' : row.status === 'suspended' ? 'rejected' : 'pending'} dot>
                    {(!row.isVerified && row.role === 'recruiter') ? 'Pending Approval' : row.status}
                </Badge>
            ),
        },
        {
            key: '_id', title: 'Actions', align: 'right',
            render: (_, row) => (
                <div className="flex items-center gap-1.5 justify-end">
                    {row.role === 'recruiter' && !row.isVerified && (
                        <button onClick={() => approveRecruiter(row._id)} disabled={loading} className="flex items-center gap-1 px-2.5 py-1 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 font-medium transition-colors">
                            <CheckCircle2 size={11} /> {t('common.approve')}
                        </button>
                    )}
                    <button onClick={() => toggleSuspend(row._id, row.status)} disabled={loading} className={clsx('flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-medium transition-colors',
                        row.status !== 'suspended'
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40'
                            : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40'
                    )}>
                        <UserX size={11} /> {row.status !== 'suspended' ? 'Suspend' : 'Restore'}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 page-enter">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('dashboard.manage_users')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{filtered.length} users found</p>
                </div>
                {pendingRecruiters.length > 0 && (
                    <button
                        onClick={() => setRoleFilter('pending')}
                        className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-xl text-sm font-semibold border border-amber-200 dark:border-amber-800/30 hover:bg-amber-100 transition-colors animate-pulse"
                    >
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        {pendingRecruiters.length} Pending Recruiter Approvals
                    </button>
                )}
            </div>

            {/* Role filter tabs */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit overflow-x-auto">
                    {ROLES.map((r) => {
                        const count = r === 'all' ? users.length : r === 'pending' ? pendingRecruiters.length : users.filter(u => u.role === r).length;
                        return (
                            <button key={r} onClick={() => setRoleFilter(r)}
                                className={clsx('px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize whitespace-nowrap',
                                    roleFilter === r ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200')}>
                                {r === 'all' ? t('common.all_roles') : r === 'pending' ? 'Pending Approvals' : r}
                                <span className={clsx("ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-gray-200/50 dark:bg-gray-700", r === 'pending' && count > 0 && "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-bold")}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <div className="flex-1 max-w-xs">
                    <SearchFilter onSearch={setSearch} />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-1 shadow-sm">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading users...</div>
                ) : (
                    <Table columns={columns} data={filtered} emptyMessage={t('common.no_data')} />
                )}
            </div>
        </div>
    );
}
