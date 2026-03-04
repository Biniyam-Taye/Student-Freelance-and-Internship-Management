import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { skillGrowthData } from '../../utils/mockData';
import { TrendingUp, Star, Award } from 'lucide-react';

export default function StudentSkills() {
    const { t } = useTranslation();
    const { user } = useSelector(s => s.auth);

    const userSkills = user?.skills?.length ? user.skills : ['React', 'Python', 'UI Design', 'Communication'];

    // Fallback metrics generator for skills since backend only stores string arrays
    const skills = userSkills.map((name, i) => ({
        name,
        level: Math.max(40, 95 - (i * 8)),
        trend: `+${Math.floor(Math.random() * 10) + 1}%`,
        category: 'Skill'
    }));

    const radarData = skills.map(s => ({
        skill: s.name,
        value: s.level
    }));

    const avgProficiency = Math.round(skills.reduce((acc, curr) => acc + curr.level, 0) / (skills.length || 1));
    const topSkill = skills.length ? skills[0].name : 'N/A';

    return (
        <div className="space-y-6 page-enter">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('dashboard.skill_progress')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track your skill growth across all competencies</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { icon: TrendingUp, label: 'Skills Tracked', value: skills.length.toString(), color: 'bg-blue-500' },
                    { icon: Star, label: 'Avg Proficiency', value: `${avgProficiency}%`, color: 'bg-violet-500' },
                    { icon: Award, label: 'Top Skill', value: topSkill, color: 'bg-emerald-500' },
                ].map(({ icon: Icon, label, value, color }) => (
                    <Card key={label} className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                            <Icon size={20} className="text-white" />
                        </div>
                        <div>
                            <div className="text-xl font-black text-gray-900 dark:text-white">{value}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <Card>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">Skill Radar</h2>
                    <ResponsiveContainer width="100%" height={260}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="#e2e8f0" className="dark:opacity-20" />
                            <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                            <Radar name="Skills" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                        </RadarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Growth over time */}
                <Card>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">Growth Timeline</h2>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={skillGrowthData.slice(-5)} barSize={16} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                            <Bar dataKey="React" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Python" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Design" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Skill list */}
            <Card>
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">All Skills</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {skills.map((skill) => (
                        <div key={skill.name}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{skill.name}</span>
                                    <Badge variant="info" className="text-[10px]">{skill.category}</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{skill.trend}</span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{skill.level}%</span>
                                </div>
                            </div>
                            <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${skill.level}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
