import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, User, GraduationCap, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { mockLogin } from '../../features/auth/authSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import clsx from 'clsx';

const schema = yup.object().shape({
    fullName: yup.string().min(2, 'Full name must be at least 2 characters').required('Full name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm your password'),
    role: yup.string().oneOf(['student', 'recruiter']).required('Please select a role'),
});

const BENEFITS = [
    'Build a portfolio with real projects',
    'Connect with top Ethiopian companies',
    'Get career guidance and support',
    'Track your skill growth with analytics',
];

export default function RegisterPage() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState('student');

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { role: 'student' },
    });

    const role = watch('role');

    const handleRoleSelect = (r) => {
        setSelectedRole(r);
        setValue('role', r);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        dispatch(mockLogin(data.role));
        navigate(`/${data.role}`);
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex" style={{ fontFamily: "'Inter','Plus Jakarta Sans',system-ui,sans-serif" }}>

            {/* ── Left decorative panel ── */}
            <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-16">
                {/* Background */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg,#0d0521 0%,#200d4e 50%,#06040f 100%)' }} />

                {/* Orbs */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-25"
                    style={{ background: 'radial-gradient(circle,#8b5cf6,transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
                <div className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle,#ec4899,transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
                <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full opacity-15"
                    style={{ background: 'radial-gradient(circle,#0ea5e9,transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

                {/* Grid */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '50px 50px' }} />

                {/* Content */}
                <div className="relative z-10">
                    <Link to="/" className="inline-flex items-center gap-2.5 mb-16">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)', boxShadow: '0 0 20px rgba(168,85,247,0.5)' }}>
                            <span className="text-white font-black">F</span>
                        </div>
                        <span className="font-extrabold text-white text-xl tracking-tight">
                            Fre<span style={{ background: 'linear-gradient(90deg,#a855f7,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>launch</span>
                        </span>
                    </Link>

                    <h2 className="text-5xl font-black text-white leading-tight mb-6">
                        Start your<br />
                        <span style={{ background: 'linear-gradient(90deg,#f9a8d4,#c084fc,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            journey today
                        </span>
                    </h2>
                    <p className="text-purple-200/60 text-lg max-w-sm leading-relaxed mb-10">
                        Join a community of driven students and innovative companies across Ethiopia.
                    </p>

                    {/* Benefits list */}
                    <div className="space-y-4">
                        {BENEFITS.map((item, i) => (
                            <div key={item} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.4)' }}>
                                    <CheckCircle2 size={14} className="text-purple-400" />
                                </div>
                                <span className="text-purple-200/70 text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom decorative stat cards */}
                <div className="relative z-10 grid grid-cols-2 gap-4">
                    {[
                        { val: '700+', label: 'Students Joined', color: '#c084fc' },
                        { val: '120+', label: 'Companies', color: '#38bdf8' },
                    ].map(({ val, label, color }) => (
                        <div key={label} className="p-4 rounded-2xl border border-white/8 text-center"
                            style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                            <div className="text-2xl font-black mb-1" style={{ color }}>{val}</div>
                            <div className="text-xs text-white/40">{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-gray-50 dark:bg-[#0b0718] overflow-y-auto">
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <Link to="/" className="inline-flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                            <span className="text-white font-black text-sm">F</span>
                        </div>
                        <span className="font-extrabold text-gray-900 dark:text-white text-lg">Frelaunch</span>
                    </Link>

                    <div className="mb-7">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{t('auth.register_title')}</h1>
                        <p className="text-gray-500 dark:text-gray-400">{t('auth.register_subtitle')}</p>
                    </div>

                    {/* Role selection */}
                    <div className="mb-6">
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                            {t('auth.select_role')}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" onClick={() => handleRoleSelect('student')}
                                className={clsx(
                                    'relative flex flex-col items-center gap-2.5 p-5 rounded-2xl border-2 transition-all duration-200 overflow-hidden group',
                                    selectedRole === 'student'
                                        ? 'border-[#3b82f6] bg-blue-50 dark:bg-blue-900/15 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/15'
                                        : 'border-gray-200 dark:border-gray-700/50 bg-white dark:bg-white/3 text-gray-500 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700'
                                )}>
                                {selectedRole === 'student' && (
                                    <div className="absolute inset-0 opacity-10"
                                        style={{ background: 'radial-gradient(circle at 50% 100%,#3b82f6,transparent 70%)' }} />
                                )}
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                    style={selectedRole === 'student'
                                        ? { background: 'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow: '0 8px 24px rgba(59,130,246,0.3)' }
                                        : { background: 'rgba(59,130,246,0.1)' }}>
                                    <GraduationCap size={24} style={{ color: selectedRole === 'student' ? 'white' : '#3b82f6' }} />
                                </div>
                                <span className="font-bold text-sm">{t('auth.role_student')}</span>
                                <span className="text-xs text-center opacity-60">Find internships &amp; freelance work</span>
                            </button>

                            <button type="button" onClick={() => handleRoleSelect('recruiter')}
                                className={clsx(
                                    'relative flex flex-col items-center gap-2.5 p-5 rounded-2xl border-2 transition-all duration-200 overflow-hidden',
                                    selectedRole === 'recruiter'
                                        ? 'border-[#8b5cf6] bg-violet-50 dark:bg-violet-900/15 text-violet-600 dark:text-violet-400 shadow-lg shadow-violet-500/15'
                                        : 'border-gray-200 dark:border-gray-700/50 bg-white dark:bg-white/3 text-gray-500 dark:text-gray-400 hover:border-violet-300 dark:hover:border-violet-700'
                                )}>
                                {selectedRole === 'recruiter' && (
                                    <div className="absolute inset-0 opacity-10"
                                        style={{ background: 'radial-gradient(circle at 50% 100%,#8b5cf6,transparent 70%)' }} />
                                )}
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                    style={selectedRole === 'recruiter'
                                        ? { background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', boxShadow: '0 8px 24px rgba(139,92,246,0.3)' }
                                        : { background: 'rgba(139,92,246,0.1)' }}>
                                    <Briefcase size={24} style={{ color: selectedRole === 'recruiter' ? 'white' : '#8b5cf6' }} />
                                </div>
                                <span className="font-bold text-sm">{t('auth.role_recruiter')}</span>
                                <span className="text-xs text-center opacity-60">Post opportunities &amp; hire talent</span>
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <input type="hidden" {...register('role')} />
                        <Input label={t('auth.full_name')} icon={User} type="text" placeholder="Abebe Girma" error={errors.fullName?.message} required {...register('fullName')} />
                        <Input label={t('auth.email')} icon={Mail} type="email" placeholder="you@example.com" error={errors.email?.message} required {...register('email')} />
                        <Input label={t('auth.password')} icon={Lock} type="password" placeholder="Min 6 characters" error={errors.password?.message} required {...register('password')} />
                        <Input label={t('auth.confirm_password')} icon={Lock} type="password" placeholder="Repeat password" error={errors.confirmPassword?.message} required {...register('confirmPassword')} />

                        <Button type="submit" variant="gradient" size="lg" fullWidth loading={loading} icon={ArrowRight} iconPosition="right">
                            {t('auth.sign_up')}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                        {t('auth.have_account')}{' '}
                        <Link to="/login" className="font-bold hover:underline" style={{ color: '#a855f7' }}>
                            {t('auth.sign_in')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
