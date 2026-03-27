import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Users, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import SearchFilter from '../../components/common/SearchFilter';
import { fetchRecruiterApplications, assignSupervisor } from '../../features/applications/applicationSlice';
import { fetchMySupervisors } from '../../features/supervisors/supervisorSlice';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export default function MyFreelancers() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: apps, loading } = useSelector((s) => s.applications);
    const { mine: supervisors } = useSelector((s) => s.supervisors);
    const [search, setSearch] = useState('');
    
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [selectedSupervisorId, setSelectedSupervisorId] = useState('');

    useEffect(() => {
        dispatch(fetchRecruiterApplications());
        dispatch(fetchMySupervisors());
    }, [dispatch]);

    const handleAssign = () => {
        if (selectedAppId) {
            dispatch(assignSupervisor({ id: selectedAppId, supervisorId: selectedSupervisorId }));
            setAssignModalOpen(false);
            setSelectedAppId(null);
            setSelectedSupervisorId('');
        }
    };

    const accepted = useMemo(
        () =>
            apps.filter(
                (a) =>
                    a.status === 'accepted' &&
                    a.opportunity?.type === 'freelance'
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
            title: 'Student',
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
                        My Freelancers
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Freelance students who have been accepted to your projects.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-2xl border border-emerald-100 dark:border-emerald-800/40 text-xs text-emerald-700 dark:text-emerald-300">
                    <Users size={14} />
                    <span>
                        {accepted.length} active freelancer
                        {accepted.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            <div className="max-w-xs">
                <SearchFilter onSearch={setSearch} />
            </div>

            <Table
                columns={columns}
                data={filtered}
                loading={loading}
                emptyMessage="No accepted freelancers yet."
            />

            <Modal
                isOpen={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                title="Assign Supervisor"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Select a supervisor to oversee this student.
                    </p>
                    <select
                        className="w-full form-input text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
                        value={selectedSupervisorId}
                        onChange={(e) => setSelectedSupervisorId(e.target.value)}
                    >
                        <option value="">-- Unassigned --</option>
                        {supervisors.map(sup => (
                            <option key={sup._id} value={sup._id}>{sup.name}</option>
                        ))}
                    </select>
                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <Button variant="secondary" onClick={() => setAssignModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAssign}>Save Assignment</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

