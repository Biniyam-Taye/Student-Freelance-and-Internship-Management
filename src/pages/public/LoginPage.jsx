import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap, Briefcase, ShieldCheck, CheckCircle2, Sun, Moon } from 'lucide-react';
import { loginUser } from '../../features/auth/authSlice';
import { toggleTheme } from '../../features/theme/themeSlice';
import Input from '../../components/ui/Input';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginPage() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const themeMode = useSelector(state => state.theme.mode);
    const { loading: authLoading, error: authError } = useSelector(state => state.auth);
    const [showPass, setShowPass] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [localError, setLocalError] = useState(null);
    const pendingInfo = location.state?.info;

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        setLoginLoading(true);
        setLocalError(null);
        try {
            const resultAction = await dispatch(loginUser({ email: data.email, password: data.password })).unwrap();
            const role = resultAction.role || 'student';
            navigate(`/${role}`);
        } catch (err) {
            setLocalError(err || 'Failed to login');
        } finally {
            setLoginLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-slate-900 font-sans transition-colors duration-300">
            {/* Left Panel - Modern, Clean SaaS look */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-50 dark:bg-slate-800 flex-col justify-between p-12 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0 bg-[url('/login-bg.jpg')] bg-cover bg-center bg-no-repeat pointer-events-none" style={{ opacity: 0.25 }} />

                {/* Gradient Overlay for text readability + right-side fade to erase boundary */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-50/70 via-transparent to-slate-50/70 dark:from-slate-800/70 dark:via-transparent dark:to-slate-800/70 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-28 z-10 bg-gradient-to-r from-transparent to-white dark:to-slate-900 pointer-events-none" />

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
                        Log in to connect with top managers, track your skill progression, and manage your tasks.
                    </p>

                    <div className="space-y-6">
                        {[
                            { title: 'Smart matching', desc: 'AI connects you with the right opportunities.' },
                            { title: 'Verified managers', desc: 'Work with established companies in Ethiopia.' },
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

                        {pendingInfo && (
                            <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium border border-amber-100 dark:border-amber-900/50">
                                {pendingInfo}
                            </div>
                        )}

                        {(authError || localError) && (
                            <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/50">
                                {authError || localError}
                            </div>
                        )}
                    </div>

                    {/* Aesthetic Stats Row */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        <div className="flex flex-col items-center justify-center py-4 px-2 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 text-center shadow-sm">
                            <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-1.5" />
                            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Skilled</span>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Students</span>
                        </div>
                        <div className="flex flex-col items-center justify-center py-4 px-2 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 text-center shadow-sm">
                            <Briefcase className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-1.5" />
                            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Verified</span>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Managers</span>
                        </div>
                        <div className="flex flex-col items-center justify-center py-4 px-2 rounded-2xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/50 text-center shadow-sm">
                            <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-1.5" />
                            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Secure</span>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Platform</span>
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
