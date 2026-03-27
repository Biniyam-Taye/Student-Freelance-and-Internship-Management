import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    Briefcase, MapPin, DollarSign, Clock, AlignLeft, X, CheckCircle2,
    Timer, Banknote, CalendarDays, ChevronDown, Zap, Calendar,
    CalendarRange, Layers, FolderOpen, RefreshCw, Hourglass,
    Code, PenTool, Megaphone, Stethoscope, BarChart, PenBox, Wrench, MoreHorizontal
} from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { createOpportunity } from '../../features/opportunities/opportunitySlice';

const schema = yup.object().shape({
    title: yup.string().min(5).required('Title is required'),
    description: yup.string().min(20).required('Description is required'),
    category: yup.string().required('Please select a category'),
    location: yup.string().required('Location is required'),
    stipend: yup.string().optional(),
    duration: yup.string().optional(),
    deadline: yup.string().required('Deadline is required'),
    type: yup.string().oneOf(['internship', 'freelance']).required(),
});

// Professional Categories
const CATEGORIES = [
    { value: '', label: 'Select category', icon: Briefcase, tag: '', desc: '' },
    { value: 'Software Development', label: 'Software Development', icon: Code, tag: 'Tech', desc: 'Web, Mobile, AI, Systems' },
    { value: 'Design & Creative', label: 'Design & Creative', icon: PenTool, tag: 'Design', desc: 'UI/UX, Graphics, Animation' },
    { value: 'Marketing & Sales', label: 'Marketing & Sales', icon: Megaphone, tag: 'Growth', desc: 'SEO, Content, Ads, Sales' },
    { value: 'Writing & Translation', label: 'Writing & Translation', icon: PenBox, tag: 'Content', desc: 'Copywriting, Translation' },
    { value: 'Data & Analytics', label: 'Data & Analytics', icon: BarChart, tag: 'Data', desc: 'Data Science, BI, DBs' },
    { value: 'Healthcare & Sciences', label: 'Healthcare & Sciences', icon: Stethoscope, tag: 'Health', desc: 'Nursing, Research, Med' },
    { value: 'Engineering & Architecture', label: 'Engineering & Architecture', icon: Wrench, tag: 'Eng', desc: 'Civil, Mech, Electrical' },
    { value: 'Other / Specialized', label: 'Other', icon: MoreHorizontal, tag: 'General', desc: 'Various unique fields' },
];

// Freelance delivery times — range-based like Fiverr/Upwork
const FREELANCE_DURATIONS = [
    { value: '', label: 'Select delivery time', icon: Clock, tag: '', desc: '' },
    { value: '1–3 days',   label: '1 – 3 days',    icon: Zap,          tag: 'Express',    desc: 'Perfect for quick tasks' },
    { value: '4–7 days',   label: '4 – 7 days',    icon: Calendar,     tag: '1 Week',     desc: 'Short turnaround' },
    { value: '1–2 weeks',  label: '1 – 2 weeks',   icon: CalendarDays, tag: 'Standard',   desc: 'Most popular range' },
    { value: '2–4 weeks',  label: '2 – 4 weeks',   icon: CalendarRange,tag: 'Extended',   desc: 'Detailed deliverables' },
    { value: '1–2 months', label: '1 – 2 months',  icon: Layers,       tag: 'Mid-term',   desc: 'Complex projects' },
    { value: '3–6 months', label: '3 – 6 months',  icon: FolderOpen,   tag: 'Long-term',  desc: 'Large scope work' },
    { value: 'Ongoing',    label: 'Ongoing',        icon: RefreshCw,    tag: 'Open-ended', desc: 'No fixed end date' },
];

// Internship duration options — range-based
const INTERNSHIP_DURATIONS = [
    { value: '',           label: 'Select duration',  icon: Clock,        tag: '',           desc: '' },
    { value: '1–3 months', label: '1 – 3 months',    icon: Hourglass,    tag: 'Short',      desc: 'Part-time or summer' },
    { value: '3–6 months', label: '3 – 6 months',    icon: CalendarDays, tag: 'Standard',   desc: 'Most common length' },
    { value: '6–12 months',label: '6 – 12 months',   icon: CalendarRange,tag: 'Extended',   desc: 'Deep learning period' },
    { value: '1 year+',    label: '1 year or more',  icon: RefreshCw,    tag: 'Long-term',  desc: 'Full placement' },
];

// ── Custom icon-rich dropdown ──────────────────────────────────────────────
function IconSelect({ options, value, onChange, accentColor = 'blue' }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const selected = options.find(o => o.value === value) || options[0];
    const SelectedIcon = selected.icon;

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const ac = {
        blue:   { trigger: 'border-blue-500 ring-blue-500/20',   iconBg: 'bg-blue-500',   iconText: 'text-white', tag: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',   row: 'bg-blue-50 dark:bg-blue-900/20',   label: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
        indigo: { trigger: 'border-indigo-500 ring-indigo-500/20', iconBg: 'bg-indigo-500', iconText: 'text-white', tag: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300', row: 'bg-indigo-50 dark:bg-indigo-900/20', label: 'text-indigo-700 dark:text-indigo-300', dot: 'bg-indigo-500' },
    }[accentColor] || {};

    return (
        <div className="relative" ref={ref}>
            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-800/80
                    text-sm transition-all duration-200 shadow-sm
                    ${ open
                        ? `${ac.trigger} ring-2`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
            >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${ value ? `${ac.iconBg} ${ac.iconText}` : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                    <SelectedIcon size={15} />
                </span>
                <span className="flex-1 text-left">
                    <span className={`font-bold block text-sm leading-tight ${ value ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                        {value ? selected.label : selected.label}
                    </span>
                    {value && selected.desc && (
                        <span className="text-[11px] text-gray-400 block mt-0.5">{selected.desc}</span>
                    )}
                </span>
                {value && selected.tag && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0 ${ac.tag}`}>
                        {selected.tag}
                    </span>
                )}
                <ChevronDown size={14} className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown panel */}
            {open && (
                <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700/80 rounded-2xl shadow-2xl shadow-gray-300/40 dark:shadow-black/50 overflow-hidden">
                    <div className="p-2 space-y-1">
                        {options.filter(o => o.value !== '').map((opt) => {
                            const Icon = opt.icon;
                            const isActive = value === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => { onChange(opt.value); setOpen(false); }}
                                    className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm transition-all duration-150 group
                                        ${ isActive ? ac.row : 'hover:bg-gray-50 dark:hover:bg-gray-800/70'}`}
                                >
                                    {/* Icon badge */}
                                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all
                                        ${ isActive
                                            ? `${ac.iconBg} ${ac.iconText}`
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                                        }`}>
                                        <Icon size={15} />
                                    </span>

                                    {/* Text */}
                                    <span className="flex-1 text-left min-w-0">
                                        <span className={`font-bold text-sm block leading-tight ${ isActive ? ac.label : 'text-gray-800 dark:text-gray-100'}`}>
                                            {opt.label}
                                        </span>
                                        {opt.desc && (
                                            <span className="text-[11px] text-gray-400 dark:text-gray-500 block mt-0.5">{opt.desc}</span>
                                        )}
                                    </span>

                                    {/* Tag pill */}
                                    {opt.tag && (
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex-shrink-0
                                            ${ isActive ? ac.tag : 'bg-gray-100 dark:bg-gray-700/80 text-gray-400 dark:text-gray-500'}`}>
                                            {opt.tag}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
// ──────────────────────────────────────────────────────────────────────────

export default function PostOpportunity() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.opportunities);
    const { user } = useSelector(state => state.auth);

    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [success, setSuccess] = useState(false);
    const [type, setType] = useState('internship');
    const [duration, setDuration] = useState('');
    const [category, setCategory] = useState('');

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { type: 'internship', category: '' },
    });

    const handleCategoryChange = (val) => {
        setCategory(val);
        setValue('category', val, { shouldValidate: true });
    };

    const handleTypeChange = (opt) => {
        setType(opt);
        setValue('type', opt);
        setDuration('');
        setValue('duration', '');
    };

    const handleDurationChange = (val) => {
        setDuration(val);
        setValue('duration', val);
    };

    const addSkill = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
            e.preventDefault();
            const s = skillInput.trim().replace(',', '');
            if (!skills.includes(s)) setSkills([...skills, s]);
            setSkillInput('');
        }
    };

    const onSubmit = async (data) => {
        try {
            const payload = {
                position: data.title,
                company: user?.company || user?.name || 'Unknown Company',
                description: data.description,
                category: data.category || category,
                location: data.location,
                stipend: data.stipend || '',
                duration: data.duration || duration || '',
                deadline: data.deadline,
                type: data.type,
                skills,
            };
            await dispatch(createOpportunity(payload)).unwrap();
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to post opportunity:', err);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[400px] page-enter">
                <div className="text-center">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                        <CheckCircle2 size={40} className="text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Opportunity Posted!</h2>
                    <p className="text-gray-500 dark:text-gray-400">Your posting is live. Users can now apply.</p>
                    <button onClick={() => setSuccess(false)} className="mt-6 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl text-sm hover:shadow-lg transition-all">
                        Post Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 page-enter max-w-2xl">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('dashboard.post_opportunity')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Create a new internship or freelance opportunity</p>
                {error && (
                    <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 dark:bg-red-900/30 dark:border-red-900/50">
                        {error}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Type selector */}
                <Card>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">{t('opportunity.type')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {['internship', 'freelance'].map((opt) => (
                            <button key={opt} type="button" onClick={() => handleTypeChange(opt)}
                                className={`flex items-center gap-2 p-3 rounded-2xl border-2 font-semibold text-sm capitalize transition-all duration-200 ${type === opt ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-300'}`}>
                                <Briefcase size={16} />
                                {t(`opportunity.${opt}`)}
                            </button>
                        ))}
                    </div>
                    <input type="hidden" {...register('type')} />
                </Card>

                {/* Basic Information */}
                <Card>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Basic Information</h3>
                    <div className="space-y-4">
                        <Input
                            label={t('opportunity.title')}
                            icon={Briefcase}
                            placeholder="e.g. Frontend React Developer Intern"
                            error={errors.title?.message}
                            required
                            {...register('title')}
                        />
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">
                                {t('opportunity.description')} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <AlignLeft size={16} className="absolute left-3.5 top-3 text-gray-400" />
                                <textarea
                                    placeholder={type === 'freelance'
                                        ? 'Describe the project, deliverables, and what you expect from the freelancer...'
                                        : 'Describe the role, responsibilities, and what candidates will learn...'}
                                    rows={5}
                                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
                                    {...register('description')}
                                />
                            </div>
                            {errors.description && <p className="text-xs text-red-500 mt-0.5">{errors.description.message}</p>}
                        </div>

                        {/* Category Selection */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-1.5">
                                {t('opportunity.category') || 'Category'} <span className="text-red-500">*</span>
                            </label>
                            <div className={errors.category ? "p-0.5 rounded-xl bg-red-50 border border-red-300" : ""}>
                                <IconSelect
                                    options={CATEGORIES}
                                    value={category}
                                    onChange={handleCategoryChange}
                                    accentColor="blue"
                                />
                            </div>
                            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
                        </div>
                    </div>
                </Card>

                {/* Details */}
                <Card>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label={t('opportunity.location')} icon={MapPin} placeholder="Addis Ababa / Remote" error={errors.location?.message} required {...register('location')} />
                        <Input label="Deadline" type="date" icon={CalendarDays} error={errors.deadline?.message} required {...register('deadline')} />
                    </div>

                    {/* ── FREELANCE: Delivery Time ── */}
                    {type === 'freelance' && (
                        <div className="mt-4">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-1.5">
                                <Timer size={14} className="text-blue-500" />
                                Delivery Time
                                <span className="ml-1 text-[11px] font-normal text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-md">optional</span>
                            </label>
                            <IconSelect
                                options={FREELANCE_DURATIONS}
                                value={duration}
                                onChange={handleDurationChange}
                                accentColor="blue"
                            />
                            {duration && (
                                <p className="mt-1.5 text-[11px] text-blue-500 dark:text-blue-400 flex items-center gap-1">
                                    <CheckCircle2 size={11} />
                                    Delivery time set to <strong>{duration}</strong>
                                </p>
                            )}
                        </div>
                    )}

                    {/* ── INTERNSHIP: Duration + Stipend ── */}
                    {type === 'internship' && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Duration */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-1.5">
                                    <CalendarDays size={14} className="text-indigo-500" />
                                    Duration
                                    <span className="ml-1 text-[11px] font-normal text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-md">optional</span>
                                </label>
                                <IconSelect
                                    options={INTERNSHIP_DURATIONS}
                                    value={duration}
                                    onChange={handleDurationChange}
                                    accentColor="indigo"
                                />
                                {duration && (
                                    <p className="mt-1.5 text-[11px] text-indigo-500 dark:text-indigo-400 flex items-center gap-1">
                                        <CheckCircle2 size={11} />
                                        Duration set to <strong>{duration}</strong>
                                    </p>
                                )}
                            </div>

                            {/* Stipend */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-1.5">
                                    <Banknote size={14} className="text-emerald-500" />
                                    Stipend
                                    <span className="ml-1 text-[11px] font-normal text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-md">optional</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                                        <DollarSign size={15} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="e.g. 5,000 ETB/month or Unpaid"
                                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        {...register('stipend')}
                                    />
                                </div>
                                <p className="mt-1 text-[11px] text-gray-400">Leave blank if unpaid or not disclosed</p>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Required Skills */}
                <Card>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('opportunity.required_skills')}</h3>
                    <p className="text-xs text-gray-400 mb-3">Press Enter or comma to add skills</p>
                    <div className="flex flex-wrap gap-2 min-h-[44px]">
                        {skills.map((s) => (
                            <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 rounded-xl text-sm font-medium">
                                {s}
                                <button type="button" onClick={() => setSkills(skills.filter(sk => sk !== s))} className="hover:text-red-500 transition-colors">
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                        <input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={addSkill}
                            placeholder="e.g. React, Python..."
                            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
                        />
                    </div>
                </Card>

                <div className="flex items-center gap-3">
                    <Button type="submit" variant="gradient" size="lg" loading={loading}>{t('opportunity.post')}</Button>
                    <Button type="button" variant="secondary">Save as Draft</Button>
                </div>
            </form>
        </div>
    );
}
