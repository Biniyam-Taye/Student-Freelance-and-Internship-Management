import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CheckSquare, Star, TrendingUp, Send, ArrowUpRight, Clock, Briefcase } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { skillGrowthData, applicationData, mockApplications, mockTasks } from '../../utils/mockData';

const StatCard = ({ icon: Icon, label, value, sub, color, trend }) => (
    <Card className="relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${color} opacity-10 translate-x-6 -translate-y-6`} />
        <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-lg`}>
                <Icon size={22} className="text-white" />
            </div>
            {trend && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                    <ArrowUpRight size={12} /> {trend}
                </span>
            )}
        </div>
        <div className="text-2xl font-black text-gray-900 dark:text-white mb-1">{value}</div>
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</div>
        {sub && <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</div>}
    </Card>
);

export default function StudentOverview() {
    const { t } = useTranslation();
    const { user } = useSelector((s) => s.auth);

    const recentApps = mockApplications.slice(0, 4);
    const activeTasks = mockTasks.filter(t_ => t_.status !== 'completed').slice(0, 3);

    return (
        <div className="space-y-6 page-enter">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-5 py-4 text-white shadow-[0_20px_55px_rgba(88,28,135,0.7)] flex-1">
                    <h1 className="text-2xl font-black">
                        {t('dashboard.welcome')}, {user?.name?.split(' ')[0]} 👋
                    </h1>
                    <p className="text-xs sm:text-sm mt-1 text-purple-100/90">
                        Here's what's happening with your career journey
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock size={14} />
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={CheckSquare} label={t('stats.completed_tasks')} value="12" trend="+2 this week" color="bg-blue-500" />
                <StatCard icon={Star} label={t('stats.avg_rating')} value="4.7" sub="Out of 5.0" trend="+0.2" color="bg-amber-500" />
                <StatCard icon={TrendingUp} label={t('stats.success_rate')} value="85%" trend="+5%" color="bg-emerald-500" />
                <StatCard icon={Send} label={t('stats.applications_sent')} value="18" sub="6 active" color="bg-violet-500" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Skill Growth */}
                <Card className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">{t('stats.monthly_growth')}</h2>
                        <Badge variant="info">Last 7 months</Badge>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={skillGrowthData}>
                            <defs>
                                <linearGradient id="colorReact" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPython" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                            <Area type="monotone" dataKey="React" stroke="#3b82f6" fill="url(#colorReact)" strokeWidth={2.5} dot={false} />
                            <Area type="monotone" dataKey="Python" stroke="#8b5cf6" fill="url(#colorPython)" strokeWidth={2.5} dot={false} />
                            <Line type="monotone" dataKey="Design" stroke="#10b981" strokeWidth={2} dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-6 mt-2">
                        {[['React', '#3b82f6'], ['Python', '#8b5cf6'], ['Design', '#10b981']].map(([name, color]) => (
                            <div key={name} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <div className="w-3 h-0.5 rounded" style={{ background: color }} />
                                {name}
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Application Stats */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">Applications</h2>
                        <Badge variant="success">Active</Badge>
                    </div>
                    <div className="space-y-5">
                        {[
                            { label: 'Accepted', count: 5, total: 18, color: 'bg-emerald-500' },
                            { label: 'Shortlisted', count: 4, total: 18, color: 'bg-blue-500' },
                            { label: 'Pending', count: 6, total: 18, color: 'bg-amber-500' },
                            { label: 'Rejected', count: 3, total: 18, color: 'bg-red-400' },
                        ].map(({ label, count, total, color }) => (
                            <div key={label}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">{label}</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{count}</span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${(count / total) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Overall Success Rate</span>
                            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">85%</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Applications + Active Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Applications */}
                <Card>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">{t('dashboard.applications')}</h2>
                        <a href="/student/applications" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">View all →</a>
                    </div>
                    <div className="space-y-3">
                        {recentApps.map((app) => (
                            <div key={app.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 flex items-center justify-center flex-shrink-0">
                                    <Briefcase size={15} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{app.position}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{app.company}</p>
                                </div>
                                <Badge variant={app.status} dot>{t(`status.${app.status}`)}</Badge>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Active Tasks */}
                <Card>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">{t('dashboard.tasks')}</h2>
                        <a href="/student/tasks" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">View all →</a>
                    </div>
                    <div className="space-y-3">
                        {activeTasks.map((task) => (
                            <div key={task.id} className="p-3 rounded-xl border border-gray-100 dark:border-gray-700/60 hover:border-blue-200 dark:hover:border-blue-700 transition-colors">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{task.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{task.company}</p>
                                    </div>
                                    <Badge variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'info'} dot>
                                        {task.priority}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-1.5 mt-2.5">
                                    <Clock size={11} className="text-gray-400" />
                                    <span className="text-xs text-gray-400">Due: {task.deadline}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
