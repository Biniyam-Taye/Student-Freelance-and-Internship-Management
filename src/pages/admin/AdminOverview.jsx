import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Briefcase, TrendingUp, Activity, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { fetchAllUsers, fetchAnalytics } from '../../features/admin/adminSlice';
import { fetchOpportunities } from '../../features/opportunities/opportunitySlice';
import { monthlyGrowthData } from '../../utils/mockData';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

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

export default function AdminOverview() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { users, analytics } = useSelector((state) => state.admin);
    const { items: opportunities } = useSelector((state) => state.opportunities);

    useEffect(() => {
        dispatch(fetchAllUsers());
        dispatch(fetchOpportunities());
        dispatch(fetchAnalytics());
    }, [dispatch]);

    const totalUsers = users.length;
    const studentCount = users.filter(u => u.role === 'student').length;
    const recruiterCount = users.filter(u => u.role === 'recruiter').length;
    const activePosts = opportunities.filter(o => o.status === 'open').length;

    const recentUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
    const recentPosts = [...opportunities].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

    return (
        <div className="space-y-6 page-enter">
            <div className="rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-5 py-4 text-white shadow-[0_20px_55px_rgba(88,28,135,0.7)]">
                <h1 className="text-2xl font-black">Admin {t('dashboard.overview')}</h1>
                <p className="text-xs sm:text-sm mt-1 text-purple-100/90">
                    Platform health and activity metrics
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users} label={t('stats.total_users')} value={totalUsers} trend="+7% this month" color="bg-blue-500" />
                <StatCard icon={Briefcase} label={t('stats.active_posts')} value={activePosts} trend="+4 this week" color="bg-violet-500" />
                <StatCard icon={TrendingUp} label={t('stats.monthly_growth')} value="+18%" trend="vs last month" color="bg-emerald-500" />
                <StatCard icon={Activity} label="Platform Health" value="99.8%" color="bg-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Monthly Growth */}
                <Card className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">User Growth</h2>
                        <Badge variant="info">Last 8 months</Badge>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={monthlyGrowthData}>
                            <defs>
                                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorRecruiters" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                            <Area type="monotone" dataKey="students" stroke="#3b82f6" fill="url(#colorStudents)" strokeWidth={2.5} dot={false} name="Students" />
                            <Area type="monotone" dataKey="recruiters" stroke="#8b5cf6" fill="url(#colorRecruiters)" strokeWidth={2.5} dot={false} name="Managers" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                {/* User Distribution Pie */}
                <Card className="lg:col-span-2">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">User Distribution</h2>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={[
                                { name: 'Students', value: studentCount || 1 },
                                { name: 'Managers', value: recruiterCount || 1 },
                            ]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                                <Cell fill="#3b82f6" />
                                <Cell fill="#8b5cf6" />
                            </Pie>
                            <Legend iconType="circle" iconSize={8} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                        {[{ label: 'Students', val: studentCount, color: 'bg-blue-500' }, { label: 'Managers', val: recruiterCount, color: 'bg-violet-500' }].map(({ label, val, color }) => (
                            <div key={label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                                <div className={`w-3 h-3 rounded-full ${color} mx-auto mb-1`} />
                                <div className="text-sm font-black text-gray-900 dark:text-white">{val}</div>
                                <div className="text-xs text-gray-500">{label}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Recent Users + Recent Posts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Users</h2>
                        <a href="/admin/users" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View all →</a>
                    </div>
                    <div className="space-y-3">
                        {recentUsers.map((u) => (
                            <div key={u._id} className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-xl p-2 transition-colors">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{u.name?.[0] || 'U'}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{u.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{u.role} · {new Date(u.createdAt).toLocaleDateString()}</p>
                                </div>
                                <Badge variant={u.isVerified ? 'active' : 'pending'} dot>{u.isVerified ? 'active' : 'pending'}</Badge>
                            </div>
                        ))}
                        {recentUsers.length === 0 && <div className="text-sm text-gray-500 text-center py-4">No recent users.</div>}
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Posts</h2>
                        <a href="/admin/posts" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View all →</a>
                    </div>
                    <div className="space-y-3">
                        {recentPosts.map((opp) => (
                            <div key={opp._id} className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-xl p-2 transition-colors">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-sm flex-shrink-0">{opp.company?.[0] || 'C'}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{opp.position}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{opp.company} · {new Date(opp.createdAt).toLocaleDateString()}</p>
                                </div>
                                <Badge variant={opp.type === 'internship' ? 'info' : 'purple'}>{opp.type}</Badge>
                            </div>
                        ))}
                        {recentPosts.length === 0 && <div className="text-sm text-gray-500 text-center py-4">No recent posts.</div>}
                    </div>
                </Card>
            </div>
        </div>
    );
}
