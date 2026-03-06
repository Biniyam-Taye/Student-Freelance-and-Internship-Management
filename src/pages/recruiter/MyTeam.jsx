import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Users, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import SearchFilter from '../../components/common/SearchFilter';
import { fetchRecruiterApplications } from '../../features/applications/applicationSlice';

export default function MyTeam() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: apps, loading } = useSelector((s) => s.applications);
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(fetchRecruiterApplications());
    }, [dispatch]);

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
                        className="flex items-center gap-1 px-2.5 py-1 text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 font-medium transition-colors"
                    >
                        <MessageSquare size={12} /> Message
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
                emptyMessage="No accepted students yet."
            />
        </div>
    );
}

