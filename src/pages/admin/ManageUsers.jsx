import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, UserX, Mail, Building, GraduationCap, CalendarDays } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
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
    const [selectedUser, setSelectedUser] = useState(null);

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
                <div className="flex items-center gap-3 p-1 -ml-1">
                    {row.avatar ? (
                        <img src={row.avatar} alt={row.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-base font-bold flex-shrink-0">
                            {row.name?.[0] || 'U'}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{row.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{row.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'role',
            title: 'Role',
            render: (v) => (
                <Badge variant={v === 'student' ? 'info' : v === 'recruiter' ? 'purple' : 'warning'} dot className="capitalize">
                    {v === 'recruiter' ? 'manager' : v}
                </Badge>
            ),
        },
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
                        <button 
                            onClick={(e) => { e.stopPropagation(); approveRecruiter(row._id); }} 
                            disabled={loading} 
                            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 font-medium transition-colors"
                        >
                            <CheckCircle2 size={11} /> {t('common.approve')}
                        </button>
                    )}
                    <button 
                        onClick={(e) => { e.stopPropagation(); toggleSuspend(row._id, row.status); }} 
                        disabled={loading} 
                        className={clsx('flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-medium transition-colors',
                            row.status !== 'suspended'
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40'
                                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40'
                        )}
                    >
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
                        {pendingRecruiters.length} Pending Manager Approvals
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
                                {r === 'all' ? t('common.all_roles') : r === 'pending' ? 'Pending Approvals' : (r === 'recruiter' ? 'manager' : r)}
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
                    <Table 
                        columns={columns} 
                        data={filtered} 
                        emptyMessage={t('common.no_data')} 
                        onRowClick={(row) => setSelectedUser(row)}
                    />
                )}
            </div>

            {/* Profile Review Modal */}
            <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Profile Details">
                {selectedUser && (
                    <div className="p-4 space-y-6">
                        <div className="flex flex-col items-center text-center">
                            {selectedUser.avatar ? (
                                <img src={selectedUser.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-md object-cover mb-4" />
                            ) : (
                                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-4xl font-black text-white mb-4">
                                    {selectedUser.name?.[0] || 'U'}
                                </div>
                            )}
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedUser.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">{selectedUser.role === 'recruiter' ? 'Manager' : selectedUser.role}</p>
                            
                            <Badge 
                                variant={selectedUser.status === 'active' && selectedUser.isVerified !== false ? 'accepted' : selectedUser.status === 'suspended' ? 'rejected' : 'pending'} 
                                dot className="mt-3 capitalize"
                            >
                                {(!selectedUser.isVerified && selectedUser.role === 'recruiter') ? 'Pending Approval' : selectedUser.status}
                            </Badge>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 space-y-4 shadow-inner">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Account Information</h3>
                            
                            <div className="flex items-center gap-3 text-sm">
                                <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0"><Mail size={16} /></span>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Email Address</p>
                                    <p className="text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                                    {selectedUser.role === 'student' ? <GraduationCap size={16} /> : <Building size={16} />}
                                </span>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedUser.role === 'student' ? 'University / Department' : 'Company / Organization'}</p>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {selectedUser.role === 'student' ? `${selectedUser.university || 'N/A'} - ${selectedUser.department || ''}` : `${selectedUser.company || 'Not provided'}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0"><CalendarDays size={16} /></span>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Registered On</p>
                                    <p className="text-gray-500 dark:text-gray-400">{new Date(selectedUser.createdAt).toLocaleDateString()} at {new Date(selectedUser.createdAt).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Footer inside Modal */}
                        {selectedUser.role === 'recruiter' && !selectedUser.isVerified ? (
                            <div className="flex gap-3 justify-center pt-2">
                                <button
                                    onClick={() => { toggleSuspend(selectedUser._id, selectedUser.status); setSelectedUser(null); }}
                                    className="flex-1 py-2.5 rounded-xl font-semibold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                                >
                                    Reject / Block
                                </button>
                                <button
                                    onClick={() => { approveRecruiter(selectedUser._id); setSelectedUser({ ...selectedUser, isVerified: true, status: 'active' }); }}
                                    className="flex-1 py-2.5 rounded-xl font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                                    disabled={loading}
                                >
                                    Approve Manager
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="w-full py-2.5 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                            >
                                Close Details
                            </button>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
