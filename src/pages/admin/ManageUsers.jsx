import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, UserX } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import SearchFilter from '../../components/common/SearchFilter';
import { mockUsers } from '../../utils/mockData';
import clsx from 'clsx';

const ROLES = ['all', 'student', 'recruiter'];

export default function ManageUsers() {
    const { t } = useTranslation();
    const [users, setUsers] = useState(mockUsers);
    const [roleFilter, setRoleFilter] = useState('all');
    const [search, setSearch] = useState('');

    const approveRecruiter = (id) => {
        setUsers(us => us.map(u => u.id === id ? { ...u, verified: true, status: 'active' } : u));
    };
    const suspendUser = (id) => {
        setUsers(us => us.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
    };

    const filtered = users.filter(u => {
        if (roleFilter !== 'all' && u.role !== roleFilter) return false;
        if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const columns = [
        {
            key: 'name', title: 'User',
            render: (name, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{name[0]}</div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{row.email}</p>
                    </div>
                </div>
            ),
        },
        { key: 'role', title: 'Role', render: (v) => <Badge variant={v === 'student' ? 'info' : v === 'recruiter' ? 'purple' : 'warning'} dot className="capitalize">{v}</Badge> },
        {
            key: 'company', title: 'Organization',
            render: (v, row) => <span className="text-sm text-gray-600 dark:text-gray-400">{v || row.university || '—'}</span>,
        },
        { key: 'joined', title: 'Joined', render: (v) => <span className="text-xs text-gray-400">{v}</span> },
        {
            key: 'status', title: 'Status',
            render: (v, row) => (
                <Badge variant={v === 'active' ? 'accepted' : v === 'pending' ? 'pending' : 'rejected'} dot>
                    {v === 'pending' && row.role === 'recruiter' ? 'Pending Approval' : v}
                </Badge>
            ),
        },
        {
            key: 'id', title: 'Actions', align: 'right',
            render: (_, row) => (
                <div className="flex items-center gap-1.5 justify-end">
                    {row.role === 'recruiter' && !row.verified && (
                        <button onClick={() => approveRecruiter(row.id)} className="flex items-center gap-1 px-2.5 py-1 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 font-medium transition-colors">
                            <CheckCircle2 size={11} /> {t('common.approve')}
                        </button>
                    )}
                    <button onClick={() => suspendUser(row.id)} className={clsx('flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-medium transition-colors',
                        row.status === 'active'
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40'
                            : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40'
                    )}>
                        <UserX size={11} /> {row.status === 'active' ? 'Suspend' : 'Restore'}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 page-enter">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('dashboard.manage_users')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{filtered.length} users found</p>
            </div>

            {/* Role filter tabs */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
                    {ROLES.map((r) => (
                        <button key={r} onClick={() => setRoleFilter(r)}
                            className={clsx('px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize',
                                roleFilter === r ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400')}>
                            {r === 'all' ? t('common.all_roles') : r}
                            <span className="ml-1.5 text-[10px] opacity-60">({r === 'all' ? users.length : users.filter(u => u.role === r).length})</span>
                        </button>
                    ))}
                </div>
                <div className="flex-1 max-w-xs">
                    <SearchFilter onSearch={setSearch} />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-1 shadow-sm">
                <Table columns={columns} data={filtered} emptyMessage={t('common.no_data')} />
            </div>
        </div>
    );
}
