import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Clock, CheckCircle2, Circle, Plus, Star, MessageSquare } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import clsx from 'clsx';

const MOCK_TASKS = [
    { id: 1, title: 'Build Landing Page', assignee: 'Abebe Girma', position: 'Frontend Intern', deadline: '2026-03-10', status: 'in_progress', description: 'Create a fully responsive landing page using React and Tailwind CSS.' },
    { id: 2, title: 'Design Mobile Wireframes', assignee: 'Hana Mekonnen', position: 'UI/UX Intern', deadline: '2026-03-15', status: 'completed', description: 'Wireframe 5 screens for the mobile banking app using Figma.' },
    { id: 3, title: 'Write API Documentation', assignee: 'Biniam Tesfaye', position: 'Backend Intern', deadline: '2026-03-20', status: 'pending', description: 'Document all REST endpoints using Swagger.' },
];

export default function AssignedTasks() {
    const { t } = useTranslation();
    const [tasks, setTasks] = useState(MOCK_TASKS);
    const [newTaskModal, setNewTaskModal] = useState(false);
    const [feedbackModal, setFeedbackModal] = useState(null);
    const [rating, setRating] = useState(0);

    return (
        <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('dashboard.assigned_tasks')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage tasks assigned to your interns</p>
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
                {tasks.map((task) => (
                    <div key={task.id} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-5 shadow-sm">
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
                                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-[9px] font-bold">{task.assignee[0]}</div>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">{task.assignee}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">·</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{task.position}</span>
                                        <span className="text-xs text-gray-400">·</span>
                                        <div className="flex items-center gap-1 text-xs text-gray-400"><Clock size={11} />{task.deadline}</div>
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
                    <Button variant="gradient" onClick={() => { setNewTaskModal(false); }}>Assign Task</Button>
                </>}>
                <div className="space-y-4">
                    <Input label="Task Title" placeholder="e.g. Build Landing Page" required />
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Description</label>
                        <textarea rows={3} placeholder="Describe the task requirements..." className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                    <Input label="Assignee" placeholder="Select intern..." required />
                    <Input label="Deadline" type="date" required />
                </div>
            </Modal>

            <Modal isOpen={!!feedbackModal} onClose={() => setFeedbackModal(null)} title="Review & Rate Task" size="md"
                footer={<>
                    <Button variant="secondary" onClick={() => setFeedbackModal(null)}>Cancel</Button>
                    <Button variant="gradient" onClick={() => setFeedbackModal(null)}>Submit Feedback</Button>
                </>}>
                <div className="space-y-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-4">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{feedbackModal?.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Completed by {feedbackModal?.assignee}</div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Rate Intern's Work</label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => setRating(star)} className="text-gray-300 hover:text-amber-400 transition-colors focus:outline-none">
                                    <Star size={28} className={star <= rating ? 'fill-amber-400 text-amber-400' : ''} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5 flex items-center gap-1.5"><MessageSquare size={14} /> Constructive Feedback</label>
                        <textarea rows={4} placeholder="What did they do well? What can be improved?" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
