import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Briefcase, MapPin, DollarSign, Clock, AlignLeft, Tag, X, CheckCircle2 } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { createOpportunity } from '../../features/opportunities/opportunitySlice';

const schema = yup.object().shape({
    title: yup.string().min(5).required('Title is required'),
    description: yup.string().min(20).required('Description is required'),
    location: yup.string().required('Location is required'),
    stipend: yup.string().required('Stipend is required'),
    duration: yup.string().required('Duration is required'),
    deadline: yup.string().required('Deadline is required'),
    type: yup.string().oneOf(['internship', 'freelance']).required(),
});

export default function PostOpportunity() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.opportunities);

    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [success, setSuccess] = useState(false);
    const [type, setType] = useState('internship');

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { type: 'internship' },
    });

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
                description: data.description,
                location: data.location,
                stipend: data.stipend,
                duration: data.duration,
                deadline: data.deadline,
                type: data.type,
                skills,
            };
            await dispatch(createOpportunity(payload)).unwrap();

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);

            // reset logic could go here
        } catch (err) {
            console.error("Failed to post opportunity:", err);
            // Optionally set local error string here
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
                    <p className="text-gray-500 dark:text-gray-400">Your posting is live. Students can now apply.</p>
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
                            <button key={opt} type="button" onClick={() => { setType(opt); setValue('type', opt); }}
                                className={`flex items-center gap-2 p-3 rounded-2xl border-2 font-semibold text-sm capitalize transition-all duration-200 ${type === opt ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-300'}`}>
                                <Briefcase size={16} />
                                {t(`opportunity.${opt}`)}
                            </button>
                        ))}
                    </div>
                    <input type="hidden" {...register('type')} />
                </Card>

                <Card>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Basic Information</h3>
                    <div className="space-y-4">
                        <Input label={t('opportunity.title')} icon={Briefcase} placeholder="e.g. Frontend React Developer Intern" error={errors.title?.message} required {...register('title')} />
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">
                                {t('opportunity.description')} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <AlignLeft size={16} className="absolute left-3.5 top-3 text-gray-400" />
                                <textarea placeholder="Describe the role, responsibilities, and what candidates will learn..." rows={5}
                                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
                                    {...register('description')} />
                            </div>
                            {errors.description && <p className="text-xs text-red-500 mt-0.5">{errors.description.message}</p>}
                        </div>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label={t('opportunity.location')} icon={MapPin} placeholder="Addis Ababa / Remote" error={errors.location?.message} required {...register('location')} />
                        <Input label={t('opportunity.stipend')} icon={DollarSign} placeholder="e.g. 5,000 ETB/month" error={errors.stipend?.message} required {...register('stipend')} />
                        <Input label={t('opportunity.duration')} icon={Clock} placeholder="e.g. 3 months" error={errors.duration?.message} required {...register('duration')} />
                        <Input label={t('opportunity.deadline')} type="date" error={errors.deadline?.message} required {...register('deadline')} />
                    </div>
                </Card>

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
                        <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={addSkill}
                            placeholder="e.g. React, Python..." className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]" />
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
