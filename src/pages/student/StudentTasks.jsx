import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyTasks, submitTask, updateTaskStatus } from '../../features/tasks/taskSlice';
import { Clock, CheckCircle2, AlertCircle, Circle, Upload, Link as LinkIcon, Star, MessageSquare, RefreshCw } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import clsx from 'clsx';

const statusConfig = {
    completed: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' },
    in_progress: { icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' },
    pending: { icon: Circle, color: 'text-gray-400', bg: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' },
};

export default function StudentTasks() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { items: tasks, loading } = useSelector(state => state.tasks);

    const [submitModal, setSubmitModal] = useState(null);
    const [feedbackModal, setFeedbackModal] = useState(null);
    const [submissionNotes, setSubmissionNotes] = useState('');
    const [submissionFileDetails, setSubmissionFileDetails] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        dispatch(fetchMyTasks());
    }, [dispatch]);

    // Refetch tasks when user returns to the tab so new recruiter feedback appears
    useEffect(() => {
        const onFocus = () => dispatch(fetchMyTasks());
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [dispatch]);

    const filtered = filter === 'all' ? tasks : tasks.filter(t_ => t_.status === filter);

    const getDaysLeft = (deadline) => {
        const diff = new Date(deadline) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days;
    };

    return (
        <div className="space-y-6 page-enter">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('dashboard.tasks')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage and submit your assigned tasks. Completed tasks show recruiter feedback and ratings.</p>
                </div>
                <button
                    type="button"
                    onClick={() => dispatch(fetchMyTasks())}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
                {['all', 'pending', 'in_progress', 'completed'].map((f) => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={clsx(
                            'px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize',
                            filter === f
                                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        )}>
                        {f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
                        <span className="ml-1.5 text-[10px] opacity-60">
                            ({f === 'all' ? tasks.length : tasks.filter(t_ => t_.status === f).length})
                        </span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading && <div className="text-gray-400 py-10 text-center col-span-2">Loading tasks...</div>}
                {!loading && filtered.length === 0 && <div className="text-gray-400 py-10 text-center col-span-2">No tasks found.</div>}

                {!loading && filtered.map((task) => {
                    const { icon: StatusIcon, color, bg } = statusConfig[task.status] || statusConfig.pending;
                    const daysLeft = getDaysLeft(task.deadline);
                    return (
                        <div key={task._id} className={clsx('rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-gray-900/50', bg)}>
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex items-start gap-3">
                                    <StatusIcon size={18} className={clsx('mt-0.5 flex-shrink-0', color)} />
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{task.title}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{task.opportunity?.company || 'Company'}</p>
                                    </div>
                                </div>
                                <Badge variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'info'}>
                                    {task.priority}
                                </Badge>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 ml-[30px] mb-4 line-clamp-2">{task.description}</p>

                            <div className="flex items-center justify-between ml-[30px]">
                                <div className="flex items-center gap-1.5">
                                    <Clock size={13} className={daysLeft <= 2 ? 'text-red-400' : 'text-gray-400'} />
                                    <span className={clsx('text-xs font-medium', daysLeft <= 2 ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400')}>
                                        {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                                    </span>
                                    <span className="text-xs text-gray-400 ml-1">· {new Date(task.deadline).toLocaleDateString()}</span>
                                </div>
                                {task.status === 'pending' && (
                                    <Button size="xs" variant="secondary" onClick={() => dispatch(updateTaskStatus({ id: task._id, status: 'in_progress' }))}>
                                        Start Task
                                    </Button>
                                )}
                                {task.status === 'in_progress' && (
                                    <Button size="xs" variant="gradient" icon={Upload} onClick={() => { setSubmissionNotes(''); setSubmissionFileDetails(''); setSubmitModal(task); }}>
                                        Submit
                                    </Button>
                                )}
                                {task.status === 'completed' && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge variant="accepted" dot>Completed</Badge>
                                        <button
                                            type="button"
                                            onClick={() => setFeedbackModal(task)}
                                            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                        >
                                            <MessageSquare size={12} /> View recruiter feedback
                                        </button>
                                    </div>
                                )}
                            </div>
                            {task.status === 'completed' && (task.rating != null || (task.feedback && task.feedback.trim())) && (
                                <div className="ml-[30px] mt-3 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/50">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Recruiter feedback</span>
                                        {task.rating != null && task.rating !== undefined && (
                                            <span className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} size={14} className={Number(s) <= Number(task.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'} />
                                                ))}
                                            </span>
                                        )}
                                    </div>
                                    {task.feedback && task.feedback.trim() && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{task.feedback}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <Modal isOpen={!!submitModal} onClose={() => setSubmitModal(null)} title={`Submit: ${submitModal?.title}`} size="md"
                footer={<>
                    <Button variant="secondary" onClick={() => setSubmitModal(null)}>{t('common.cancel')}</Button>
                    <Button variant="gradient" disabled={loading} onClick={async () => {
                        await dispatch(submitTask({
                            id: submitModal._id,
                            submission: {
                                submissionNotes: submissionNotes,
                                submissionFiles: [submissionFileDetails].filter(Boolean)
                            }
                        })).unwrap();
                        setSubmitModal(null);
                    }}>
                        {loading ? 'Submitting...' : 'Submit Task'}
                    </Button>
                </>}>
                <div className="space-y-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-700 dark:text-blue-300">
                        <strong>Task: </strong>{submitModal?.description}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Submission Notes</label>
                        <textarea placeholder="Describe your work and add any relevant links..." rows={4}
                            value={submissionNotes}
                            onChange={(e) => setSubmissionNotes(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">File Link (URL)</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="url" placeholder="Paste GitHub, Drive, or Figma link..."
                                value={submissionFileDetails}
                                onChange={(e) => setSubmissionFileDetails(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>
            </Modal>

            {/* View recruiter feedback modal */}
            <Modal isOpen={!!feedbackModal} onClose={() => setFeedbackModal(null)} title="Recruiter feedback" size="md"
                footer={<Button variant="secondary" onClick={() => setFeedbackModal(null)}>Close</Button>}>
                {feedbackModal && (
                    <div className="space-y-4">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{feedbackModal.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{feedbackModal.opportunity?.company || 'Company'}</p>
                        </div>
                        {feedbackModal.rating != null && feedbackModal.rating !== '' && (
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Rating</p>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={24} className={Number(s) <= Number(feedbackModal.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'} />
                                    ))}
                                    <span className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-300">{feedbackModal.rating}/5</span>
                                </div>
                            </div>
                        )}
                        {feedbackModal.feedback && (
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5"><MessageSquare size={14} /> Feedback</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">{feedbackModal.feedback}</p>
                            </div>
                        )}
                        {feedbackModal.rating == null && !feedbackModal.feedback && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No rating or feedback yet.</p>
                        )}
                    </div>
                )}
            </Modal>
        </div >
    );
}
