import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { UserCheck, UserX, UserPlus, MessageSquare, Mail, Building, GraduationCap, CalendarDays, Phone, MapPin, Linkedin, Github, Globe, Briefcase, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import SearchFilter from '../../components/common/SearchFilter';
import {
    fetchPendingSupervisors,
    fetchMySupervisors,
    approveSupervisor,
    rejectSupervisor,
} from '../../features/supervisors/supervisorSlice';

export default function ManageSupervisors() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pending, mine, loading } = useSelector((s) => s.supervisors);
    const [search, setSearch] = useState('');
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);

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
                <div className="flex items-center gap-3 p-1 -ml-1">
                    {row.avatar ? (
                        <img src={row.avatar} alt={row.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-base font-bold flex-shrink-0">
                            {row.name?.[0] || 'S'}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {row.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
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
                        onClick={(e) => { e.stopPropagation(); dispatch(approveSupervisor(row._id)); }}
                        disabled={loading}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 font-medium transition-colors"
                    >
                        <UserCheck size={12} /> {t('common.approve')}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); dispatch(rejectSupervisor(row._id)); }}
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
                <div className="flex items-center gap-3 p-1 -ml-1">
                    {row.avatar ? (
                        <img src={row.avatar} alt={row.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-base font-bold flex-shrink-0">
                            {row.name?.[0] || 'S'}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {row.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
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
                        onClick={(e) => {
                            e.stopPropagation();
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
                            });
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 font-medium transition-colors"
                    >
                        <MessageSquare size={12} /> Message
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); dispatch(rejectSupervisor(row._id)); }}
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
                        onRowClick={(row) => setSelectedSupervisor(row)}
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
                        onRowClick={(row) => setSelectedSupervisor(row)}
                    />
                </div>
            </div>

            {/* Supervisor Profile Modal */}
            <Modal size="lg" isOpen={!!selectedSupervisor} onClose={() => setSelectedSupervisor(null)} title="Supervisor Profile">
                {selectedSupervisor && (
                    <div className="p-4 space-y-6">
                        <div className="flex flex-col items-center text-center">
                            {selectedSupervisor.avatar ? (
                                <img src={selectedSupervisor.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-md object-cover mb-4" />
                            ) : (
                                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-black text-white mb-4">
                                    {selectedSupervisor.name?.[0] || 'S'}
                                </div>
                            )}
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedSupervisor.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">{selectedSupervisor.role || 'Supervisor'}</p>
                            <Badge variant={selectedSupervisor.status === 'active' || selectedSupervisor.status === 'accepted' ? 'accepted' : 'pending'} dot className="mt-3">
                                {selectedSupervisor.status === 'active' || selectedSupervisor.status === 'accepted' ? 'Approved & Active' : 'Pending Approval'}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 space-y-4 shadow-inner">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Contact Details</h3>
                                
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0"><Mail size={16} /></span>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">Email Address</p>
                                        <p className="text-gray-500 dark:text-gray-400">{selectedSupervisor.email}</p>
                                    </div>
                                </div>

                                {selectedSupervisor.phone && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0"><Phone size={16} /></span>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">Phone Number</p>
                                            <p className="text-gray-500 dark:text-gray-400">{selectedSupervisor.phone}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedSupervisor.location && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0"><MapPin size={16} /></span>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">Location</p>
                                            <p className="text-gray-500 dark:text-gray-400">{selectedSupervisor.location}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0"><CalendarDays size={16} /></span>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">Joined Platform</p>
                                        <p className="text-gray-500 dark:text-gray-400">{new Date(selectedSupervisor.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 space-y-4 shadow-inner">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Professional Info</h3>

                                {(selectedSupervisor.university || selectedSupervisor.company) && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                                            {selectedSupervisor.university ? <GraduationCap size={16} /> : <Building size={16} />}
                                        </span>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{t('profile.org_institution')}</p>
                                            <p className="text-gray-500 dark:text-gray-400">{selectedSupervisor.university || selectedSupervisor.company}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedSupervisor.position && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0"><Briefcase size={16} /></span>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{t('profile.supervisor_role')}</p>
                                            <p className="text-gray-500 dark:text-gray-400">{selectedSupervisor.position}</p>
                                        </div>
                                    </div>
                                )}

                                {(selectedSupervisor.linkedin || selectedSupervisor.github || selectedSupervisor.website) && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0"><Globe size={16} /></span>
                                        <div className="flex flex-col gap-1">
                                            <p className="font-semibold text-gray-900 dark:text-white">Socials & Links</p>
                                            <div className="flex gap-2">
                                                {selectedSupervisor.linkedin && <a href={selectedSupervisor.linkedin} target="_blank" rel="noreferrer" className="text-sky-500 hover:text-sky-600 transition-colors"><Linkedin size={16} /></a>}
                                                {selectedSupervisor.github && <a href={selectedSupervisor.github} target="_blank" rel="noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"><Github size={16} /></a>}
                                                {selectedSupervisor.website && <a href={selectedSupervisor.website} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors"><Globe size={16} /></a>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedSupervisor.bio && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 shadow-inner">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText size={16} className="text-gray-400" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">About (Bio)</h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{selectedSupervisor.bio}</p>
                            </div>
                        )}

                        {/* Quick Actions Footer inside Modal (Only for pending ones to quickly approve/reject while reading) */}
                        {selectedSupervisor.status === 'pending' || !selectedSupervisor.status || selectedSupervisor.status === 'rejected' ? (
                            <div className="flex gap-3 justify-center pt-2">
                                <button
                                    onClick={() => { dispatch(rejectSupervisor(selectedSupervisor._id)); setSelectedSupervisor(null); }}
                                    className="flex-1 py-2.5 rounded-xl font-semibold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => { dispatch(approveSupervisor(selectedSupervisor._id)); setSelectedSupervisor(null); }}
                                    className="flex-1 py-2.5 rounded-xl font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                                >
                                    Approve Profile
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setSelectedSupervisor(null)}
                                className="w-full py-2.5 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                            >
                                Close Profile
                            </button>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}

