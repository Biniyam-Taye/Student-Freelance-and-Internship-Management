import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Briefcase, TrendingUp, Star, ArrowUpRight, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { fetchRecruiterApplications, updateApplicationStatus } from '../../features/applications/applicationSlice';
import { fetchOpportunities } from '../../features/opportunities/opportunitySlice';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <Card className="relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-20 h-20 rounded-full ${color} opacity-10 translate-x-4 -translate-y-4`} />
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
        <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </Card>
);

export default function RecruiterOverview() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.auth);
    const { items: allOpps } = useSelector(s => s.opportunities);
    const { items: apps } = useSelector(s => s.applications);

    useEffect(() => {
        dispatch(fetchOpportunities());
        dispatch(fetchRecruiterApplications());
    }, [dispatch]);

    // Derived stats
    const myOpps = allOpps.filter(p => p.recruiter?._id === user?._id || p.recruiter === user?._id);
    const activePosts = myOpps.filter(o => o.status === 'open').length;
    const totalApplicants = apps.length;
    const hiredCount = apps.filter(a => a.status === 'accepted').length;
    const hiringRate = totalApplicants > 0 ? Math.round((hiredCount / totalApplicants) * 100) : 0;

    // We can still use the mock hiringData for the graph to look pretty, or build it. For now, keep mock graph data structure, 
    // but replace table and lists below with real data.
    const hiringDataMock = [
        { month: 'Jan', posted: 2, hired: 1 },
        { month: 'Feb', posted: 3, hired: 2 },
        { month: 'Mar', posted: 5, hired: 2 },
        { month: 'Apr', posted: 4, hired: 3 },
        { month: 'May', posted: 6, hired: 4 },
        { month: 'Jun', posted: 8, hired: 5 },
        { month: 'Jul', posted: Math.max(activePosts, 4), hired: hiredCount },
    ];

    return (
        <div className="space-y-6 page-enter">
            <div className="rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-6 py-5 mb-2 text-white shadow-[0_22px_60px_rgba(88,28,135,0.75)]">
                <h1 className="text-2xl font-black">
                    {t('dashboard.welcome')}, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p className="text-sm mt-1 text-purple-100/90">
                    Here's your recruiting activity overview
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Briefcase} label="Active Posts" value={activePosts} trend="+2 this week" color="bg-blue-500" />
                <StatCard icon={Users} label="Total Applicants" value={totalApplicants} trend="+18 today" color="bg-violet-500" />
                <StatCard icon={TrendingUp} label={t('stats.hiring_rate')} value={`${hiringRate}%`} trend="+5%" color="bg-emerald-500" />
                <StatCard icon={Star} label="Avg Response Time" value="1.2d" color="bg-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Hiring Chart */}
                <Card className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">Posts vs Hired</h2>
                        <Badge variant="info">Last 7 months</Badge>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={hiringDataMock} barSize={14} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                            <Bar dataKey="posted" fill="#6366f1" radius={[4, 4, 0, 0]} name="Posted" />
                            <Bar dataKey="hired" fill="#10b981" radius={[4, 4, 0, 0]} name="Hired" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Post Engagement */}
                <Card className="lg:col-span-2">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">Post Engagement</h2>
                    <div className="space-y-4">
                        {myOpps.slice(0, 4).map((opp) => {
                            const maxApplicants = Math.max(...myOpps.map(o => o.applicantsCount || 0), 10);
                            const widthPercent = Math.min(((opp.applicantsCount || 0) / maxApplicants) * 100, 100);
                            return (
                                <div key={opp._id}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate flex-1 mr-2">{opp.position}</p>
                                        <span className="text-xs font-bold text-gray-900 dark:text-white">{opp.applicantsCount || 0}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" style={{ width: `${widthPercent}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            {/* Recent Applications */}
            <Card>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Applicants</h2>
                    <a href="/recruiter/applications" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">View all →</a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                        <thead>
                            <tr className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                <th className="text-left pb-3">Applicant</th>
                                <th className="text-left pb-3">Position</th>
                                <th className="text-left pb-3">Skills</th>
                                <th className="text-left pb-3">Status</th>
                                <th className="text-right pb-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/30">
                            {apps.slice(0, 4).map((app) => (
                                <tr key={app._id} className="hover:bg-gray-50/60 dark:hover:bg-gray-700/20 transition-colors">
                                    <td className="py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                                                {app.student?.name?.[0] || 'A'}
                                            </div>
                                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{app.student?.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{app.opportunity?.position}</td>
                                    <td className="py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {app.student?.skills?.slice(0, 2).map((s, idx) => (
                                                <span key={idx} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-[10px]">{s}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-3"><Badge variant={app.status || 'pending'} dot>{t(`status.${app.status || 'pending'}`)}</Badge></td>
                                    <td className="py-3 text-right">
                                        <div className="flex items-center gap-1.5 justify-end">
                                            {app.status !== 'shortlisted' && app.status !== 'accepted' && <button onClick={() => dispatch(updateApplicationStatus({ id: app._id, status: 'shortlisted' }))} className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 font-medium transition-colors">Shortlist</button>}
                                            {app.status !== 'accepted' && <button onClick={() => dispatch(updateApplicationStatus({ id: app._id, status: 'accepted' }))} className="px-2 py-1 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 font-medium transition-colors">Accept</button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
