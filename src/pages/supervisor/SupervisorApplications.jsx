import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Sparkles, FileText, Download } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import SearchFilter from '../../components/common/SearchFilter';
import { fetchRecruiterApplications, updateApplicationStatus } from '../../features/applications/applicationSlice';
import { fetchAssignedTasks } from '../../features/tasks/taskSlice';
import { downloadCV } from '../../services/uploadService';

export default function SupervisorApplications() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: apps, loading } = useSelector(state => state.applications);
    const assignedTasks = useSelector(state => state.tasks.items);
    const [search, setSearch] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        dispatch(fetchRecruiterApplications());
    }, [dispatch]);

    useEffect(() => {
        if (selectedApp) dispatch(fetchAssignedTasks());
    }, [selectedApp, dispatch]);

    const updateStatus = (id, status) => {
        dispatch(updateApplicationStatus({ id, status }));
    };

    const filtered = apps.filter(a => {
        const studentName = a.student?.name || '';
        const position = a.opportunity?.position || '';
        if (!search) return true;
        return studentName.toLowerCase().includes(search.toLowerCase()) || position.toLowerCase().includes(search.toLowerCase());
    });

    const bestMatchByOpportunity = apps.reduce((acc, app) => {
        const oppId = app.opportunity?._id;
        if (!oppId || typeof app.matchScore !== 'number') return acc;
        const current = acc[oppId];
        if (current == null || app.matchScore > current) {
            acc[oppId] = app.matchScore;
        }
        return acc;
    }, {});

    const studentReviewStats = selectedApp?.student?._id
        ? (() => {
            const forStudent = assignedTasks.filter(
                t => (t.student?._id || t.student) === selectedApp.student._id && t.rating != null
            );
            if (forStudent.length === 0) return null;
            const sum = forStudent.reduce((acc, t) => acc + Number(t.rating), 0);
            return { average: sum / forStudent.length, count: forStudent.length };
        })()
        : null;

    const columns = [
        {
            key: 'applicant', title: 'Applicant',
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
                        {row.student?.avatar ? (
                            <img src={row.student.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                            row.student?.name?.[0] || 'A'
                        )}
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
            key: 'matchScore', title: 'AI Best Recommendation', align: 'center',
            render: (v, row) => {
                const score = typeof v === 'number' ? v : null;
                const reason = row.matchDetails?.reason;
                if (score === null) {
                    const label =
                        reason === 'missing_job_skills'
                            ? 'Add job skills'
                            : reason === 'missing_student_skills'
                                ? 'No student skills'
                                : 'N/A';
                    return <span className="text-xs text-gray-400">{label}</span>;
                }
                const oppId = row.opportunity?._id;
                const isTop = oppId && bestMatchByOpportunity[oppId] != null && bestMatchByOpportunity[oppId] === score;
                return (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                        <span>{score}% match</span>
                        {isTop && (
                            <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                                <Sparkles size={12} />
                                Top
                            </span>
                        )}
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
                    {/* Supervisor chats with the student on behalf of the recruiter */}
                    {row.status === 'accepted' && row.student && (
                        <button
                            onClick={() => navigate('/supervisor/messages', {
                                state: {
                                    initialContact: {
                                        _id: row.student._id,
                                        name: row.student.name,
                                        role: row.student.role || 'student',
                                        company: row.student.company,
                                        university: row.student.university,
                                        avatar: row.student.avatar,
                                    }
                                }
                            })}
                            className="px-2.5 py-1 text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 font-medium transition-colors"
                        >
                            Message
                        </button>
                    )}
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
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Review applicants and coordinate with your recruiter.</p>
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
                    <Table
                        columns={columns}
                        data={filtered}
                        emptyMessage={t('common.no_data')}
                        onRowClick={(row) => setSelectedApp(row)}
                    />
                )}
            </div>

            <Modal
                isOpen={!!selectedApp}
                onClose={() => setSelectedApp(null)}
                title="Student details"
                size="sm"
                footer={<Button variant="secondary" onClick={() => setSelectedApp(null)}>Close</Button>}
            >
                {selectedApp && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0 overflow-hidden">
                                {selectedApp.student?.avatar ? (
                                    <img src={selectedApp.student.avatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    selectedApp.student?.name?.[0] || 'A'
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-gray-900 dark:text-white truncate">{selectedApp.student?.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{selectedApp.student?.email}</p>
                                {selectedApp.student?.university && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{selectedApp.student.university}</p>
                                )}
                            </div>
                        </div>
                        {selectedApp.opportunity && (
                            <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-3">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applied for</p>
                                <p className="font-semibold text-gray-900 dark:text-white text-sm">{selectedApp.opportunity.position}</p>
                                {selectedApp.opportunity.company && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedApp.opportunity.company}</p>
                                )}
                            </div>
                        )}
                        {(selectedApp.student?.major || (selectedApp.student?.skills?.length > 0)) && (
                            <div className="space-y-1.5">
                                {selectedApp.student?.major && (
                                    <p className="text-sm"><span className="text-gray-500 dark:text-gray-400">Major</span> <span className="text-gray-900 dark:text-white font-medium">{selectedApp.student.major}</span></p>
                                )}
                                {selectedApp.student?.skills?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className="text-sm text-gray-500 dark:text-gray-400 w-full">Skills</span>
                                        {selectedApp.student.skills.map((s, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs">{s}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 p-3">
                            <p className="text-xs font-medium text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-2">CV / Resume</p>
                            {selectedApp.student?.cv ? (
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => downloadCV(selectedApp.student.cv, `${(selectedApp.student?.name || 'Student').replace(/\s+/g, '_')}_CV.pdf`)}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                                    >
                                        <Download size={16} />
                                        {t('profile.download_cv') || 'Download'}
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.no_cv_uploaded') || 'No CV uploaded yet.'}</p>
                            )}
                        </div>
                        {studentReviewStats && (
                            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-3">
                                <p className="text-xs font-medium text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1.5">Task reviews</p>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={18}
                                            className={star <= Math.round(studentReviewStats.average) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}
                                        />
                                    ))}
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                                        {studentReviewStats.average.toFixed(1)}/5
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">({studentReviewStats.count} task{studentReviewStats.count !== 1 ? 's' : ''})</span>
                                </div>
                            </div>
                        )}
                        {!studentReviewStats && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">No task reviews for this student yet.</p>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}

