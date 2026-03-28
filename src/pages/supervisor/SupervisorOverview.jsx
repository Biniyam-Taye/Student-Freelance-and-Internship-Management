import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Briefcase, TrendingUp, Star, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { fetchRecruiterApplications } from '../../features/applications/applicationSlice';
import { fetchOpportunities } from '../../features/opportunities/opportunitySlice';

const StatCard = ({ icon, label, value, trend, color }) => {
    const IconComponent = icon;
    return (
        <Card className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-20 h-20 rounded-full ${color} opacity-10 translate-x-4 -translate-y-4`} />
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-lg`}>
                    <IconComponent size={22} className="text-white" />
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
};

export default function SupervisorOverview() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.auth);
    const { items: allOpps } = useSelector(s => s.opportunities);
    const { items: apps } = useSelector(s => s.applications);

    useEffect(() => {
        dispatch(fetchOpportunities());
        dispatch(fetchRecruiterApplications());
    }, [dispatch]);

    // For supervisors, use their managerRecruiter to scope jobs
    const managerRecruiterId = user?.managerRecruiter || null;

    const myOpps = allOpps.filter(p => {
        const recruiterId = p.recruiter?._id || p.recruiter;
        if (!recruiterId) return false;
        if (user?.role === 'supervisor' && managerRecruiterId) {
            return recruiterId === managerRecruiterId;
        }
        return recruiterId === user?._id;
    });

    const activePosts = myOpps.filter(o => o.status === 'open').length;
    const totalApplicants = apps.length;
    const hiredCount = apps.filter(a => a.status === 'accepted').length;
    const hiringRate = totalApplicants > 0 ? Math.round((hiredCount / totalApplicants) * 100) : 0;

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
            <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 px-6 py-5 mb-2 text-white shadow-[0_22px_60px_rgba(79,70,229,0.75)]">
                <h1 className="text-2xl font-black">
                    {t('dashboard.welcome')}, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p className="text-sm mt-1 text-indigo-100/90">
                    Coordinate between managers and users, and keep internships on track.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Briefcase} label="Active Jobs You Support" value={activePosts} trend="+1 this week" color="bg-indigo-500" />
                <StatCard icon={Users} label="Total Applicants" value={totalApplicants} trend="+8 today" color="bg-violet-500" />
                <StatCard icon={TrendingUp} label={t('stats.hiring_rate')} value={`${hiringRate}%`} trend="+3%" color="bg-emerald-500" />
                <StatCard icon={Star} label="Intern Satisfaction (est.)" value="—" color="bg-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">Jobs vs Accepted Interns</h2>
                        <Badge variant="info">Last 7 months</Badge>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={hiringDataMock} barSize={14} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                            <Bar dataKey="posted" fill="#6366f1" radius={[4, 4, 0, 0]} name="Jobs" />
                            <Bar dataKey="hired" fill="#10b981" radius={[4, 4, 0, 0]} name="Accepted" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card className="lg:col-span-2">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">Most Active Opportunities</h2>
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
                                        <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${widthPercent}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </div>
    );
}

