import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Building2, Globe, Mail, Phone, Users, Briefcase, MapPin, X, Plus } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { updateUserProfile } from '../../features/auth/authSlice';

const SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];

export default function CompanyProfile() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { user, loading } = useSelector((s) => s.auth);
    const [industries, setIndustries] = useState([]);
    const [industryInput, setIndustryInput] = useState('');
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({
        company: '', website: '', phone: '', location: '', bio: '', companySize: '1-10'
    });

    useEffect(() => {
        if (user) {
            setForm({
                company: user.company || '',
                website: user.website || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || '',
                companySize: user.companySize || '1-10'
            });
            setIndustries(user.industries || ['Technology']);
        }
    }, [user]);

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const addTag = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && industryInput.trim()) {
            e.preventDefault();
            const s = industryInput.trim().replace(',', '');
            if (!industries.includes(s)) setIndustries([...industries, s]);
            setIndustryInput('');
        }
    };

    const handleSave = async () => {
        try {
            await dispatch(updateUserProfile({ ...form, industries })).unwrap();
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            console.error('Failed to save company profile', err);
        }
    };

    return (
        <div className="space-y-6 page-enter max-w-3xl">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('dashboard.company_profile')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Edit your company information and branding</p>
            </div>

            {/* Company Logo + Banner */}
            <Card>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-xl">
                            {user?.company?.[0] || 'C'}
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center text-white hover:bg-violet-700 transition-colors shadow-lg">
                            <Plus size={14} />
                        </button>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.company || 'TechEthiopia'}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Technology · Addis Ababa</p>
                        <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                            <span className="flex items-center gap-1 text-xs text-gray-400"><Users size={11} /> 50-200 employees</span>
                            <span className="flex items-center gap-1 text-xs text-gray-400"><Briefcase size={11} /> 7 active posts</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Company Details */}
            <Card>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Company Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label={t('profile.company_name')} icon={Building2} name="company" value={form.company} onChange={handleChange} required />
                    <Input label={t('profile.company_website')} icon={Globe} name="website" value={form.website} onChange={handleChange} placeholder="https://yourcompany.com" type="url" />
                    <Input label="Contact Email" icon={Mail} type="email" value={user?.email || ''} disabled />
                    <Input label="Phone" icon={Phone} name="phone" value={form.phone} onChange={handleChange} placeholder="+251 9XX XXX XXX" type="tel" />
                    <Input label="Location" icon={MapPin} name="location" value={form.location} onChange={handleChange} placeholder="Addis Ababa, Ethiopia" />
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">{t('profile.company_size')}</label>
                        <select className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            {SIZES.map(s => <option key={s}>{s} employees</option>)}
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Company Description</label>
                    <textarea rows={4} placeholder="Describe your company, culture, and what makes it special..."
                        name="bio" value={form.bio} onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
            </Card>

            {/* Industries / Tags */}
            <Card>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('profile.industry')}</h3>
                <p className="text-xs text-gray-400 mb-3">Add industry tags to help students find you</p>
                <div className="flex flex-wrap gap-2 min-h-[44px]">
                    {industries.map((s) => (
                        <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 rounded-xl text-sm font-medium">
                            {s}
                            <button onClick={() => setIndustries(industries.filter(sk => sk !== s))} className="hover:text-red-500 transition-colors"><X size={12} /></button>
                        </span>
                    ))}
                    <input value={industryInput} onChange={(e) => setIndustryInput(e.target.value)} onKeyDown={addTag}
                        placeholder="Add industry..." className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]" />
                </div>
            </Card>

            <div className="flex items-center gap-3">
                <Button variant="gradient" size="lg" loading={loading} onClick={handleSave}>{saved ? '✓ Saved!' : t('common.save')}</Button>
                <Button variant="secondary" onClick={() => {
                    if (user) {
                        setForm({ company: user.company || '', website: user.website || '', phone: user.phone || '', location: user.location || '', bio: user.bio || '', companySize: user.companySize || '1-10' });
                        setIndustries(user.industries || []);
                    }
                }}>Discard</Button>
            </div>
        </div>
    );
}
