import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle2, AlertCircle, Circle, Upload } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { mockTasks } from '../../utils/mockData';
import clsx from 'clsx';

const statusConfig = {
    completed: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' },
    in_progress: { icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' },
    pending: { icon: Circle, color: 'text-gray-400', bg: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' },
};

export default function StudentTasks() {
    const { t } = useTranslation();
    const [tasks, setTasks] = useState(mockTasks);
    const [submitModal, setSubmitModal] = useState(null);
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all' ? tasks : tasks.filter(t_ => t_.status === filter);

    const getDaysLeft = (deadline) => {
        const diff = new Date(deadline) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days;
    };

    return (
        <div className="space-y-6 page-enter">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('dashboard.tasks')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage and submit your assigned tasks</p>
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
                {filtered.map((task) => {
                    const { icon: StatusIcon, color, bg } = statusConfig[task.status];
                    const daysLeft = getDaysLeft(task.deadline);
                    return (
                        <div key={task.id} className={clsx('rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-gray-900/50', bg)}>
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex items-start gap-3">
                                    <StatusIcon size={18} className={clsx('mt-0.5 flex-shrink-0', color)} />
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{task.title}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{task.company}</p>
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
                                    <span className="text-xs text-gray-400 ml-1">· {task.deadline}</span>
                                </div>
                                {task.status !== 'completed' && (
                                    <Button size="xs" variant="gradient" icon={Upload} onClick={() => setSubmitModal(task)}>
                                        Submit
                                    </Button>
                                )}
                                {task.status === 'completed' && (
                                    <Badge variant="accepted" dot>Completed</Badge>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Submit Modal */}
            <Modal isOpen={!!submitModal} onClose={() => setSubmitModal(null)} title={`Submit: ${submitModal?.title}`} size="md"
                footer={<>
                    <Button variant="secondary" onClick={() => setSubmitModal(null)}>{t('common.cancel')}</Button>
                    <Button variant="gradient" onClick={() => {
                        setTasks(ts => ts.map(t_ => t_.id === submitModal?.id ? { ...t_, status: 'completed' } : t_));
                        setSubmitModal(null);
                    }}>Submit Task</Button>
                </>}>
                <div className="space-y-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-700 dark:text-blue-300">
                        <strong>Task: </strong>{submitModal?.description}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Submission Notes</label>
                        <textarea placeholder="Describe your work and add any relevant links..." rows={4}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer">
                        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('common.upload')} files</p>
                        <p className="text-xs text-gray-400 mt-1">PDF, ZIP, images up to 10MB</p>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
