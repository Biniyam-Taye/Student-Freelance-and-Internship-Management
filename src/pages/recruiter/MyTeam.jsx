import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Users, MessageSquare, UserX, CheckCircle2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import SearchFilter from '../../components/common/SearchFilter';
import { fetchRecruiterApplications, assignSupervisor } from '../../features/applications/applicationSlice';
import { fetchMySupervisors } from '../../features/supervisors/supervisorSlice';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import clsx from 'clsx';

export default function MyTeam() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: apps, loading } = useSelector((s) => s.applications);
    const { mine: supervisors } = useSelector((s) => s.supervisors);
    const [search, setSearch] = useState('');
    
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const activeSup = useMemo(() => supervisors.find(s => s._id === selectedSupervisorId), [supervisors, selectedSupervisorId]);

    useEffect(() => {
        dispatch(fetchRecruiterApplications());
        dispatch(fetchMySupervisors());
    }, [dispatch]);

    const handleAssign = () => {
        if (selectedAppId) {
            dispatch(assignSupervisor({ id: selectedAppId, supervisorId: selectedSupervisorId }));
            setAssignModalOpen(false);
            setIsDropdownOpen(false);
            setSelectedAppId(null);
            setSelectedSupervisorId('');
        }
    };

    const accepted = useMemo(
        () =>
            apps.filter(
                (a) =>
                    a.status === 'accepted' &&
                    (a.opportunity?.type === 'internship')
            ),
        [apps]
    );

    const filtered = accepted.filter((a) => {
        if (!search) return true;
        const q = search.toLowerCase();
        const name = a.student?.name || '';
        const position = a.opportunity?.position || '';
        return (
            name.toLowerCase().includes(q) ||
            position.toLowerCase().includes(q)
        );
    });

    const columns = [
        {
            key: 'student',
            title: 'User',
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 overflow-hidden">
                        {row.student?.avatar ? (
                            <img
                                src={row.student.avatar}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            row.student?.name?.[0] || 'S'
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                            {row.student?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {row.student?.university}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'opportunity',
            title: 'Opportunity',
            render: (_, row) => (
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    <div>{row.opportunity?.position}</div>
                    {row.opportunity?.company && (
                        <div className="text-xs text-gray-400">
                            {row.opportunity.company}
                        </div>
                    )}
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
                <Badge variant="accepted" dot>
                    {t('status.accepted')}
                </Badge>
            ),
        },
        {
            key: 'supervisor',
            title: 'Assigned Supervisor',
            render: (_, row) => (
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    {row.assignedSupervisor ? row.assignedSupervisor.name : 'Unassigned'}
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
                                        _id: row.student._id,
                                        name: row.student.name,
                                        role: row.student.role || 'student',
                                        company: row.student.company,
                                        university: row.student.university,
                                        avatar: row.student.avatar,
                                    },
                                },
                            })
                        }
                        className="flex items-center gap-1 px-2.5 py-1 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 font-medium transition-colors"
                    >
                        <MessageSquare size={12} /> Message
                    </button>
                    <button
                        onClick={() => {
                            setSelectedAppId(row._id);
                            setSelectedSupervisorId(row.assignedSupervisor?._id || '');
                            setAssignModalOpen(true);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 font-medium transition-colors"
                    >
                        Assign
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
                        My Team
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Students who have been accepted to your internships.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-2xl border border-emerald-100 dark:border-emerald-800/40 text-xs text-emerald-700 dark:text-emerald-300">
                    <Users size={14} />
                    <span>{accepted.length} active intern{accepted.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            <div className="max-w-xs">
                <SearchFilter onSearch={setSearch} />
            </div>

            <Table
                columns={columns}
                data={filtered}
                loading={loading}
                emptyMessage="No accepted users yet."
            />

            <Modal
                isOpen={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                title="Assign Supervisor"
                size="md"
                footer={<>
                    <Button variant="secondary" onClick={() => setAssignModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleAssign}>Save Assignment</Button>
                </>}
            >
                <div className="space-y-5 p-5 min-h-[380px]">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Select a supervisor to oversee this student.
                    </p>
                    <div className="relative z-10">
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(prev => !prev)}
                            className={clsx(
                                "w-full text-left bg-white dark:bg-gray-800 border rounded-2xl px-5 py-6 flex items-center justify-between shadow-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all",
                                isDropdownOpen ? "border-blue-400 dark:border-blue-500 ring-2 ring-blue-50 dark:ring-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                            )}
                        >
                            {selectedSupervisorId === '' ? (
                                <div className="flex items-center gap-3.5 text-gray-500 dark:text-gray-400">
                                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50">
                                        <UserX size={16} />
                                    </div>
                                    <div>
                                        <span className="text-[15px] font-semibold text-gray-700 dark:text-gray-300 block">-- Unassigned --</span>
                                        <span className="text-xs text-gray-400 block mt-0.5">Click to choose a supervisor</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3.5">
                                    {activeSup?.avatar ? (
                                        <img src={activeSup.avatar} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-gray-100 dark:ring-gray-700" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[13px] font-bold shadow-sm">
                                            {activeSup?.name?.[0]}
                                        </div>
                                    )}
                                    <div>
                                        <span className="font-semibold text-[15px] text-gray-900 dark:text-white block leading-tight">{activeSup?.name}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">{activeSup?.email}</span>
                                    </div>
                                </div>
                            )}
                            <ChevronDown size={18} className={clsx("transition-transform duration-200 text-gray-400 ml-2", isDropdownOpen && "rotate-180")} />
                        </button>

                        {/* Dropdown Options List */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl max-h-56 overflow-y-auto animate-fade-in-up z-50 py-1">
                                <button
                                    type="button"
                                    onClick={() => { setSelectedSupervisorId(''); setIsDropdownOpen(false); }}
                                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-3 transition-colors outline-none"
                                >
                                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-50/50 dark:bg-gray-800/50">
                                        <UserX size={14} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">Unassigned</span>
                                        <span className="text-[10px] text-gray-400 block -mt-0.5">Clear supervisor assignment</span>
                                    </div>
                                    {selectedSupervisorId === '' && <CheckCircle2 size={16} className="ml-auto text-blue-500 shadow-sm" />}
                                </button>
                                
                                {supervisors.map(sup => (
                                    <button
                                        key={sup._id}
                                        type="button"
                                        onClick={() => { setSelectedSupervisorId(sup._id); setIsDropdownOpen(false); }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-3 transition-colors outline-none group"
                                    >
                                        {sup.avatar ? (
                                            <img src={sup.avatar} alt="" className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-gray-100 dark:ring-gray-700" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm ring-1 ring-white/10">
                                                {sup.name[0]}
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors block leading-tight">{sup.name}</span>
                                            <span className="text-[10px] text-gray-500 dark:text-gray-400 block">{sup.email}</span>
                                        </div>
                                        {selectedSupervisorId === sup._id && <CheckCircle2 size={16} className="ml-auto text-blue-500 shadow-sm" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}

