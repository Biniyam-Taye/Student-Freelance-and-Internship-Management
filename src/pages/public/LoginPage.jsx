import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap, Briefcase, ShieldCheck, CheckCircle2, Sun, Moon } from 'lucide-react';
import { mockLogin } from '../../features/auth/authSlice';
import { toggleTheme } from '../../features/theme/themeSlice';
import Input from '../../components/ui/Input';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const DEMO_ROLES = [
    { role: 'student', label: 'Student', icon: GraduationCap, colorClass: 'text-blue-600 dark:text-blue-400', bgClass: 'bg-blue-50 dark:bg-blue-900/20', borderClass: 'border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-500' },
    { role: 'recruiter', label: 'Recruiter', icon: Briefcase, colorClass: 'text-emerald-600 dark:text-emerald-400', bgClass: 'bg-emerald-50 dark:bg-emerald-900/20', borderClass: 'border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-500' },
    { role: 'admin', label: 'Admin', icon: ShieldCheck, colorClass: 'text-purple-600 dark:text-purple-400', bgClass: 'bg-purple-50 dark:bg-purple-900/20', borderClass: 'border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-500' },
];

export default function LoginPage() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const themeMode = useSelector(state => state.theme.mode);
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
        <div className="min-h-screen flex bg-white dark:bg-slate-900 font-sans transition-colors duration-300">
            {/* Left Panel - Modern, Clean SaaS look */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-col justify-between p-12 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0 bg-[url('/login-bg.jpg')] bg-cover bg-center bg-no-repeat pointer-events-none" style={{ opacity: 0.25 }} />

                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-50/70 via-transparent to-slate-50/70 dark:from-slate-800/70 dark:via-transparent dark:to-slate-800/70 pointer-events-none" />

                {/* Subtle Grid Background */}
                <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                <div className="relative z-10 flex-shrink-0">
                    <Link to="/" className="flex items-center gap-2 mb-16">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                            <span className="font-extrabold text-white text-xl">F</span>
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white">Frelaunch.</span>
                    </Link>

                    <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-6">
                        Welcome back to your <br />
                        <span className="text-blue-600 dark:text-blue-400">career journey.</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed mb-12">
                        Log in to connect with top recruiters, track your skill progression, and manage your tasks.
                    </p>

                    <div className="space-y-6">
                        {[
                            { title: 'Smart matching', desc: 'AI connects you with the right opportunities.' },
                            { title: 'Verified recruiters', desc: 'Work with established companies in Ethiopia.' },
                            { title: 'Secure payments', desc: 'Guaranteed stipends and milestone tracking.' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                                <div className="mt-1 bg-white dark:bg-slate-900 p-1.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 flex-shrink-0 text-blue-600 dark:text-blue-400">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-slate-500 dark:text-slate-400 text-sm font-medium mt-auto pt-10">
                    &copy; 2026 Frelaunch Inc.
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
                {/* Theme Toggle */}
                <button
                    onClick={() => dispatch(toggleTheme())}
                    type="button"
                    className="absolute top-6 right-6 p-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors z-10 shadow-sm"
                    aria-label="Toggle theme"
                >
                    {themeMode === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Mobile Logo */}
                <Link to="/" className="flex lg:hidden items-center gap-2 mb-10 w-full max-w-md">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                        <span className="font-extrabold text-white text-xl">F</span>
                    </div>
                    <span className="font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white">Frelaunch.</span>
                </Link>

                <div className="w-full max-w-md my-auto">
                    <div className="text-left md:text-center mb-10">
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{t('auth.login_title')}</h1>
                        <p className="text-slate-600 dark:text-slate-400">{t('auth.login_subtitle')}</p>
                    </div>

                    {/* Quick Demo Access */}
                    <div className="mb-8">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 md:text-center">Quick Demo Login</p>
                        <div className="grid grid-cols-3 gap-3">
                            {DEMO_ROLES.map(({ role, label, icon: Icon, colorClass, bgClass, borderClass }) => (
                                <button key={role} onClick={() => handleDemoLogin(role)} disabled={loginLoading}
                                    className={`group py-3 px-2 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md disabled:opacity-50 flex flex-col items-center gap-2 ${bgClass} ${borderClass}`}>
                                    <Icon className={`w-6 h-6 ${colorClass}`} />
                                    <span className={`text-xs font-semibold ${colorClass}`}>{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-slate-900 text-slate-500 font-medium">or continue with email</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 relative z-10 w-8 h-8 flex items-center justify-center">
                                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                )}
                                {...register('password')}
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm py-2">
                            <label className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-slate-800" />
                                {t('auth.remember_me')}
                            </label>
                            <Link to="/forgot-password"
                                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                {t('auth.forgot_password')}
                            </Link>
                        </div>

                        <button type="submit" disabled={loginLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-70">
                            {loginLoading ? 'Loading...' : t('auth.sign_in')}
                            {!loginLoading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <p className="text-left md:text-center font-medium text-slate-600 dark:text-slate-400 mt-8 pb-6">
                        {t('auth.no_account')}{' '}
                        <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                            {t('auth.sign_up')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
