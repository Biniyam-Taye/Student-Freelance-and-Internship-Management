import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { User, Mail, Phone, MapPin, Linkedin, Github, GraduationCap, Upload, X, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const initialSkills = ['React', 'Python', 'JavaScript', 'Figma', 'Node.js'];

export default function StudentProfile() {
    const { t } = useTranslation();
    const { user } = useSelector((s) => s.auth);
    const [skills, setSkills] = useState(initialSkills);
    const [skillInput, setSkillInput] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const addSkill = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
            e.preventDefault();
            const s = skillInput.trim().replace(',', '');
            if (!skills.includes(s)) setSkills([...skills, s]);
            setSkillInput('');
        }
    };

    const removeSkill = (s) => setSkills(skills.filter((sk) => sk !== s));

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 1000));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="space-y-6 page-enter max-w-3xl">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('dashboard.profile_settings')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your personal information and portfolio</p>
            </div>

            {/* Avatar + CV */}
            <Card>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-500/30">
                            {user?.name?.[0] || 'S'}
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg">
                            <Plus size={14} />
                        </button>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm capitalize mt-0.5">{user?.role} · {user?.university}</p>
                        <p className="text-gray-400 text-sm mt-0.5">{user?.email}</p>
                    </div>
                    <label className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-5 text-center hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer w-full sm:w-48 flex-shrink-0 group">
                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                        <Upload size={20} className="mx-auto text-gray-400 mb-1.5 group-hover:text-blue-500 transition-colors" />
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{t('profile.upload_cv')}</p>
                        <p className="text-[10px] text-gray-400 mt-1">PDF, DOC up to 5MB</p>
                    </label>
                </div>
            </Card>

            {/* Personal Info */}
            <Card>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label={t('auth.full_name')} icon={User} defaultValue={user?.name} required />
                    <Input label={t('auth.email')} icon={Mail} type="email" defaultValue={user?.email} required />
                    <Input label={t('profile.phone')} icon={Phone} placeholder="+251 9XX XXX XXX" type="tel" />
                    <Input label={t('profile.location')} icon={MapPin} placeholder="Addis Ababa, Ethiopia" />
                    <Input label={t('profile.linkedin')} icon={Linkedin} placeholder="linkedin.com/in/yourname" />
                    <Input label={t('profile.github')} icon={Github} placeholder="github.com/yourname" />
                </div>
                <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">{t('profile.bio')}</label>
                    <textarea rows={3} placeholder="Tell recruiters about yourself, your goals, and what makes you unique..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
            </Card>

            {/* Academic Info */}
            <Card>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">Academic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label={t('profile.university')} icon={GraduationCap} defaultValue={user?.university} />
                    <Input label={t('profile.major')} placeholder="Computer Science" defaultValue={user?.major} />
                    <Input label={t('profile.graduation')} type="month" />
                </div>
            </Card>

            {/* Skills */}
            <Card>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{t('profile.skills')}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Press Enter or comma to add a skill</p>
                <div className="flex flex-wrap gap-2 mb-3 min-h-[40px]">
                    {skills.map((s) => (
                        <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-medium">
                            {s}
                            <button onClick={() => removeSkill(s)} className="hover:text-red-500 transition-colors">
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                    <input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={addSkill}
                        placeholder={t('profile.add_skill')}
                        className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
                    />
                </div>
            </Card>

            {/* Save */}
            <div className="flex items-center gap-3">
                <Button variant="gradient" size="lg" loading={saving} onClick={handleSave}>
                    {saved ? '✓ Saved!' : t('common.save')}
                </Button>
                <Button variant="secondary">Discard Changes</Button>
            </div>
        </div>
    );
}
