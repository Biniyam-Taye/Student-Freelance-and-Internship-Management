import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Clock, CheckCircle2, Circle, Plus, Star, MessageSquare } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { fetchAssignedTasks, assignTask, reviewTask } from '../../features/tasks/taskSlice';
import { fetchRecruiterApplications } from '../../features/applications/applicationSlice';
import clsx from 'clsx';

export default function SupervisorTasks() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    const { items: tasks, loading } = useSelector(state => state.tasks);
    const { items: applications } = useSelector(state => state.applications);

    // Supervisors can assign tasks ONLY to accepted applicants explicitly assigned to them by the manager
    const acceptedApplicants = applications.filter(a => 
        a.status === 'accepted' && 
        a.student && 
        a.opportunity && 
        (a.assignedSupervisor?._id === user?._id || a.assignedSupervisor === user?._id)
    );

    const [newTaskModal, setNewTaskModal] = useState(false);
    const [feedbackModal, setFeedbackModal] = useState(null);
    const [rating, setRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');

    const [newTask, setNewTask] = useState({ title: '', description: '', selectedAppId: '', deadline: '' });

    useEffect(() => {
        dispatch(fetchAssignedTasks());
        dispatch(fetchRecruiterApplications());
    }, [dispatch]);

    return (
        <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('dashboard.assigned_tasks')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Assign and review tasks for your interns.</p>
                </div>
                <Button variant="gradient" icon={Plus} onClick={() => setNewTaskModal(true)}>Assign Task</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                    { label: 'Total', val: tasks.length, color: 'text-gray-900 dark:text-white' },
                    { label: 'In Progress', val: tasks.filter(t => t.status === 'in_progress').length, color: 'text-blue-600 dark:text-blue-400' },
                    { label: 'Completed', val: tasks.filter(t => t.status === 'completed').length, color: 'text-emerald-600 dark:text-emerald-400' },
                ].map(({ label, val, color }) => (
                    <div key={label} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-4 text-center shadow-sm">
                        <div className={`text-2xl font-black ${color}`}>{val}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                {loading && <div className="text-gray-500 text-center py-10 font-medium">Loading tasks...</div>}
                {!loading && tasks.length === 0 && <div className="text-gray-500 text-center py-10 font-medium">No tasks assigned yet.</div>}

                {!loading && tasks.map((task) => (
                    <div key={task._id} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                                <div className={clsx('w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                                    task.status === 'completed' ? 'text-emerald-500' : task.status === 'in_progress' ? 'text-blue-500' : 'text-gray-400')}>
                                    {task.status === 'completed' ? <CheckCircle2 size={18} /> : task.status === 'in_progress' ? <Clock size={18} /> : <Circle size={18} />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{task.title}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{task.description}</p>
                                    <div className="flex flex-wrap items-center gap-3 mt-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-[9px] font-bold">
                                                {task.student?.name?.[0] || 'S'}
                                            </div>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                {task.student?.name}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">·</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{task.opportunity?.position}</span>
                                        <span className="text-xs text-gray-400">·</span>
                                        <div className="flex items-center gap-1 text-xs text-gray-400"><Clock size={11} />{new Date(task.deadline).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Badge variant={task.status === 'completed' ? 'accepted' : task.status === 'in_progress' ? 'shortlisted' : 'pending'} dot>
                                    {task.status.replace('_', ' ')}
                                </Badge>
                                {task.status === 'completed' && (
                                    <button
                                        onClick={() => { setFeedbackModal(task); setRating(0); }}
                                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1 mt-1"
                                    >
                                        <Star size={12} className="fill-current" /> Review & Rate
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={newTaskModal} onClose={() => setNewTaskModal(false)} title="Assign New Task" size="md"
                footer={<>
                    <Button variant="secondary" onClick={() => setNewTaskModal(false)}>Cancel</Button>
                    <Button
                        variant="gradient"
                        disabled={loading}
                        onClick={async () => {
                            const app = acceptedApplicants.find(a => a._id === newTask.selectedAppId);
                            if (!app) return alert('Select an assignee!');

                            await dispatch(assignTask({
                                opportunityId: app.opportunity._id,
                                studentId: app.student._id,
                                title: newTask.title,
                                description: newTask.description,
                                deadline: newTask.deadline,
                                priority: 'medium'
                            })).unwrap();
                            setNewTaskModal(false);
                            setNewTask({ title: '', description: '', selectedAppId: '', deadline: '' });
                        }}
                    >
                        {loading ? 'Assigning...' : 'Assign Task'}
                    </Button>
                </>}
            >
                <div className="space-y-4">
                    <Input label="Task Title" placeholder="e.g. Onboarding & documentation" required value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Description</label>
                        <textarea
                            rows={3}
                            placeholder="Describe the task requirements..."
                            value={newTask.description}
                            onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Assignee (Accepted Student)</label>
                        <select
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            value={newTask.selectedAppId}
                            onChange={e => setNewTask({ ...newTask, selectedAppId: e.target.value })}
                        >
                            <option value="">Select accepted intern...</option>
                            {acceptedApplicants.map(a => (
                                <option key={a._id} value={a._id}>{a.student.name} - {a.opportunity.position}</option>
                            ))}
                        </select>
                    </div>
                    <Input label="Deadline" type="date" required value={newTask.deadline} onChange={e => setNewTask({ ...newTask, deadline: e.target.value })} />
                </div>
            </Modal>

            <Modal
                isOpen={!!feedbackModal}
                onClose={() => { setFeedbackModal(null); setRating(0); setFeedbackText(''); }}
                title="Review & Rate Task"
                size="md"
                footer={<>
                    <Button variant="secondary" onClick={() => { setFeedbackModal(null); setRating(0); setFeedbackText(''); }}>Cancel</Button>
                    <Button
                        variant="gradient"
                        disabled={loading || rating < 1}
                        onClick={async () => {
                            if (!feedbackModal) return;
                            try {
                                await dispatch(reviewTask({ id: feedbackModal._id, review: { rating, feedback: feedbackText } })).unwrap();
                                setFeedbackModal(null);
                                setRating(0);
                                setFeedbackText('');
                            } catch (err) {
                                console.error('Failed to submit feedback:', err);
                            }
                        }}
                    >
                        {loading ? 'Saving...' : 'Submit Feedback'}
                    </Button>
                </>}
            >
                <div className="space-y-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-4">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{feedbackModal?.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Completed by {feedbackModal?.student?.name}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Rate Intern's Work</label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} type="button" onClick={() => setRating(star)} className="text-gray-300 hover:text-amber-400 transition-colors focus:outline-none">
                                    <Star size={28} className={star <= rating ? 'fill-amber-400 text-amber-400' : ''} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5 flex items-center gap-1.5"><MessageSquare size={14} /> Constructive Feedback</label>
                        <textarea
                            rows={4}
                            placeholder="What did they do well? What can be improved?"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}

