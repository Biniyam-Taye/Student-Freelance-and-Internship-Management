import { useTranslation } from 'react-i18next';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { monthlyGrowthData, applicationData, systemAnalyticsData } from '../../utils/mockData';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

export default function SystemAnalytics() {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 page-enter">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('dashboard.system_analytics')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Platform performance and usage analytics</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {systemAnalyticsData.map(({ name, value }, i) => (
                    <Card key={name} padding="p-4" className="text-center">
                        <div className="text-2xl font-black text-gray-900 dark:text-white">{value.toLocaleString()}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{name}</div>
                        <div className="w-full h-1 rounded-full mt-3" style={{ background: COLORS[i] + '30' }}>
                            <div className="h-full rounded-full" style={{ width: `${(value / 1240) * 100}%`, background: COLORS[i] }} />
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth */}
                <Card>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">User Growth</h2>
                        <Badge variant="info">8 months</Badge>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={monthlyGrowthData}>
                            <defs>
                                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                            <Area type="monotone" dataKey="students" stroke="#3b82f6" fill="url(#aGrad)" strokeWidth={2.5} dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                {/* Applications Trend */}
                <Card>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">Applications Trend</h2>
                        <Badge variant="success">7 months</Badge>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={applicationData} barSize={16} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                            <Bar dataKey="applications" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Applications" />
                            <Bar dataKey="accepted" fill="#10b981" radius={[4, 4, 0, 0]} name="Accepted" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Platform Health */}
                <Card>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">Platform Health</h2>
                    <div className="space-y-4">
                        {[
                            { label: 'Server Uptime', value: 99.8, color: 'from-emerald-400 to-emerald-500' },
                            { label: 'API Response Time', value: 95, sub: '120ms avg', color: 'from-blue-400 to-blue-500' },
                            { label: 'Error Rate', value: 2, sub: '0.2% errors', color: 'from-amber-400 to-amber-500' },
                            { label: 'Active Connections', value: 78, sub: '342 concurrent', color: 'from-violet-400 to-violet-500' },
                        ].map(({ label, value, sub, color }) => (
                            <div key={label}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{value}%</span>
                                        {sub && <span className="text-xs text-gray-400 ml-1.5">({sub})</span>}
                                    </div>
                                </div>
                                <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className={`h-full bg-gradient-to-r ${color} rounded-full`} style={{ width: `${value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Quick Stats */}
                <Card>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">Geographic Distribution</h2>
                    <div className="space-y-3">
                        {[
                            { city: 'Addis Ababa', users: 520, pct: 72 },
                            { city: 'Jimma', users: 78, pct: 11 },
                            { city: 'Hawassa', users: 58, pct: 8 },
                            { city: 'Bahir Dar', users: 42, pct: 6 },
                            { city: 'Other', users: 22, pct: 3 },
                        ].map(({ city, users, pct }) => (
                            <div key={city}>
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">{city}</span>
                                    <span className="text-gray-500 dark:text-gray-400">{users} users <span className="text-gray-400">({pct}%)</span></span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
