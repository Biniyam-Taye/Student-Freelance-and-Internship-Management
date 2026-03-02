import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Star, Users, TrendingUp } from 'lucide-react';
import { mockLogin } from '../../features/auth/authSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const DEMO_ROLES = [
    { role: 'student', label: 'Student', color: '#3b82f6', glow: 'rgba(59,130,246,0.3)', emoji: '🎓' },
    { role: 'recruiter', label: 'Recruiter', color: '#8b5cf6', glow: 'rgba(139,92,246,0.3)', emoji: '💼' },
    { role: 'admin', label: 'Admin', color: '#10b981', glow: 'rgba(16,185,129,0.3)', emoji: '⚙️' },
];

export default function LoginPage() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        setLoginLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        let role = 'student';
        if (data.email.includes('recruiter')) role = 'recruiter';
        if (data.email.includes('admin')) role = 'admin';
        dispatch(mockLogin(role));
        navigate(`/${role}`);
        setLoginLoading(false);
    };

    const handleDemoLogin = async (role) => {
        setLoginLoading(true);
        await new Promise(r => setTimeout(r, 600));
        dispatch(mockLogin(role));
        navigate(`/${role}`);
        setLoginLoading(false);
    };

    return (
        <div className="min-h-screen flex" style={{ fontFamily: "'Inter','Plus Jakarta Sans',system-ui,sans-serif" }}>

            {/* ── Left decorative panel ── */}
            <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-16">
                {/* Background */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg,#0d0521 0%,#1a0a42 50%,#06040f 100%)' }} />

                {/* Ambient orbs */}
                <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-30"
                    style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle,#0ea5e9,transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
                <div className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full opacity-15"
                    style={{ background: 'radial-gradient(circle,#ec4899,transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none' }} />

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
                        Welcome back to<br />
                        <span style={{ background: 'linear-gradient(90deg,#c084fc,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            your career journey
                        </span>
                    </h2>
                    <p className="text-purple-200/60 text-lg max-w-sm leading-relaxed">
                        Connect with opportunities, build skills, and shape your future in Ethiopia's growing tech ecosystem.
                    </p>
                </div>

                {/* Stats */}
                <div className="relative z-10 grid grid-cols-3 gap-4">
                    {[
                        { icon: Users, val: '700+', label: 'Students', color: '#c084fc' },
                        { icon: TrendingUp, val: '120+', label: 'Companies', color: '#38bdf8' },
                        { icon: Star, val: '95%', label: 'Placement', color: '#34d399' },
                    ].map(({ icon: Icon, val, label, color }) => (
                        <div key={label} className="p-4 rounded-2xl border border-white/8"
                            style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                            <Icon size={18} className="mb-2" style={{ color }} />
                            <div className="text-2xl font-black text-white">{val}</div>
                            <div className="text-xs text-white/40 mt-0.5">{label}</div>
                        </div>
                    ))}
                </div>

                {/* Decorative floating card */}
                <div className="absolute top-1/2 right-8 -translate-y-1/2 max-w-[200px] p-4 rounded-2xl border border-white/10"
                    style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                            style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
                            🎓
                        </div>
                        <div>
                            <p className="text-white text-xs font-semibold">Bereket A.</p>
                            <p className="text-white/40 text-[10px]">UI/UX Designer</p>
                        </div>
                    </div>
                    <div className="flex gap-0.5 mb-1">
                        {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="text-white/60 text-[10px] leading-relaxed">"Got my first internship within 2 weeks!"</p>
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-gray-50 dark:bg-[#0b0718] overflow-y-auto">
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <Link to="/" className="inline-flex items-center gap-2 mb-10 lg:hidden">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                            <span className="text-white font-black text-sm">F</span>
                        </div>
                        <span className="font-extrabold text-gray-900 dark:text-white text-lg">Frelaunch</span>
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{t('auth.login_title')}</h1>
                        <p className="text-gray-500 dark:text-gray-400">{t('auth.login_subtitle')}</p>
                    </div>

                    {/* Demo role buttons */}
                    <div className="mb-6">
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Quick Demo Access</p>
                        <div className="grid grid-cols-3 gap-2">
                            {DEMO_ROLES.map(({ role, label, color, glow, emoji }) => (
                                <button key={role} onClick={() => handleDemoLogin(role)} disabled={loginLoading}
                                    className="group py-3 px-2 rounded-2xl border text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 flex flex-col items-center gap-1.5"
                                    style={{
                                        borderColor: `${color}30`,
                                        background: `${color}10`,
                                        color,
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 24px ${glow}`}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                                    <span className="text-lg">{emoji}</span>
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700/50" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-gray-50 dark:bg-[#0b0718] px-3 text-xs text-gray-400">or sign in with credentials</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label={t('auth.email')}
                            icon={Mail}
                            type="email"
                            placeholder="you@example.com"
                            error={errors.email?.message}
                            required
                            {...register('email')}
                        />
                        <div className="relative">
                            <Input
                                label={t('auth.password')}
                                icon={Lock}
                                type={showPass ? 'text' : 'password'}
                                placeholder="••••••••"
                                error={errors.password?.message}
                                required
                                rightIcon={() => (
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                )}
                                {...register('password')}
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-500 dark:text-gray-400 cursor-pointer">
                                <input type="checkbox" className="rounded accent-purple-600" />
                                {t('auth.remember_me')}
                            </label>
                            <Link to="/forgot-password"
                                className="text-sm font-medium transition-colors"
                                style={{ color: '#a855f7' }}>
                                {t('auth.forgot_password')}
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="gradient"
                            size="lg"
                            fullWidth
                            loading={loginLoading}
                            icon={ArrowRight}
                            iconPosition="right">
                            {t('auth.sign_in')}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                        {t('auth.no_account')}{' '}
                        <Link to="/register" className="font-bold hover:underline" style={{ color: '#a855f7' }}>
                            {t('auth.sign_up')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
