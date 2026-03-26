import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, User, GraduationCap, Briefcase, ArrowRight, Eye, EyeOff, CheckCircle2, Sun, Moon, ChevronDown, UserCircle2, ShieldCheck } from 'lucide-react';
import { registerUser, mockLogin } from '../../features/auth/authSlice';
import { toggleTheme } from '../../features/theme/themeSlice';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import clsx from 'clsx';

const schema = yup.object().shape({
    fullName: yup.string().min(2, 'Full name must be at least 2 characters').required('Full name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm your password'),
    role: yup.string().oneOf(['student', 'recruiter', 'supervisor']).required('Please select a role'),
});

export default function RegisterPage() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const themeMode = useSelector(state => state.theme.mode);
    const { loading: authLoading, error: authError } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState('student');
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [recruiters, setRecruiters] = useState([]);
    const [recruiterLoading, setRecruiterLoading] = useState(false);
    const [selectedRecruiterId, setSelectedRecruiterId] = useState('');
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
    const roleDropdownRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target)) {
                setRoleDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { role: 'student' },
    });

    const handleRoleSelect = (r) => {
        setSelectedRole(r);
        setValue('role', r);
    };

    const loadRecruiters = async () => {
        try {
            setRecruiterLoading(true);
            // Public endpoint: returns verified, active recruiters
            const res = await api.get('/public/recruiters');
            const list = res.data || [];
            setRecruiters(list);
        } catch (error) {
            console.error('Failed to load recruiters', error);
        } finally {
            setRecruiterLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setLocalError(null);
        try {
            const formData = {
                name: data.fullName,
                email: data.email,
                password: data.password,
                role: data.role,
                // If supervisor chose a recruiter, send that as managerRecruiter
                ...(data.role === 'supervisor' && selectedRecruiterId
                    ? { managerRecruiter: selectedRecruiterId }
                    : {}),
            };
            const resultAction = await dispatch(registerUser(formData)).unwrap();
            const role = resultAction.role || 'student';

            // For supervisors: redirect to login, recruiter will see their request
            if (role === 'supervisor') {
                navigate('/login', {
                    state: {
                        info: selectedRecruiterId
                            ? 'Your supervisor account has been created and a request has been sent to the selected manager. You will be able to log in once they approve your account.'
                            : 'Your supervisor account has been created and is pending approval. Please contact a manager to approve your account.',
                    },
                });
            }
            // For recruiters: also redirect to login and wait for admin approval
            else if (role === 'recruiter') {
                navigate('/login', {
                    state: {
                        info: 'Your manager account has been created and is pending admin approval. You will be able to log in once an admin verifies your account.',
                    },
                });
            } else {
                // Students can be logged in immediately
                navigate(`/${role}`);
            }
        } catch (err) {
            setLocalError(err || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-slate-900 font-sans transition-colors duration-300">
            {/* Left Panel - Modern, Clean SaaS look */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-50 dark:bg-slate-800 flex-col justify-between p-12 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0 bg-[url('/register-bg.jpg')] bg-cover bg-center bg-no-repeat pointer-events-none" style={{ opacity: 0.25 }} />

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
                        Join the future of <br />
                        <span className="text-blue-600 dark:text-blue-400">talent connection.</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed mb-12">
                        Create an account to build your portfolio, connect with leading companies, and launch your career in Ethiopia.
                    </p>

                    <div className="space-y-6">
                        {[
                            { title: 'Build a portfolio', desc: 'Showcase real projects and skills.' },
                            { title: 'Top Ethiopian companies', desc: 'Directly connect with industry leaders.' },
                            { title: 'Track skill growth', desc: 'Get analytics on your progression.' }
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
                <Link to="/" className="flex lg:hidden items-center gap-2 mb-8 mt-4 w-full max-w-md">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                        <span className="font-extrabold text-white text-xl">F</span>
                    </div>
                    <span className="font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white">Frelaunch.</span>
                </Link>

                <div className="w-full max-w-md my-auto flex flex-col">
                    <div className="text-left md:text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{t('auth.register_title')}</h1>
                        <p className="text-slate-600 dark:text-slate-400">{t('auth.register_subtitle')}</p>

                        {(authError || localError) && (
                            <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/50">
                                {authError || localError}
                            </div>
                        )}
                    </div>

                    {/* Role selection — custom dropdown */}
                    {(() => {
                        const roles = [
                            {
                                key: 'student',
                                label: t('auth.role_student'),
                                subtitle: 'Find work & grow',
                                icon: UserCircle2,
                                color: 'blue',
                                triggerCls: 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 text-blue-700 dark:text-blue-300 shadow-blue-200 dark:shadow-blue-900/30',
                                iconBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400',
                                hoverCls: 'hover:bg-blue-50/80 dark:hover:bg-blue-900/20',
                                activeBadge: 'bg-blue-600',
                                activeRow: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 text-blue-700 dark:text-blue-300',
                                dot: 'bg-blue-500',
                            },
                            {
                                key: 'recruiter',
                                label: t('auth.role_recruiter'),
                                subtitle: 'Hire top talent',
                                icon: Briefcase,
                                color: 'emerald',
                                triggerCls: 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 text-emerald-700 dark:text-emerald-300 shadow-emerald-200 dark:shadow-emerald-900/30',
                                iconBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400',
                                hoverCls: 'hover:bg-emerald-50/80 dark:hover:bg-emerald-900/20',
                                activeBadge: 'bg-emerald-600',
                                activeRow: 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 text-emerald-700 dark:text-emerald-300',
                                dot: 'bg-emerald-500',
                            },
                            {
                                key: 'supervisor',
                                label: t('auth.role_supervisor'),
                                subtitle: 'Guide users for managers',
                                icon: ShieldCheck,
                                color: 'violet',
                                triggerCls: 'border-violet-500 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40 text-violet-700 dark:text-violet-300 shadow-violet-200 dark:shadow-violet-900/30',
                                iconBg: 'bg-violet-100 dark:bg-violet-900/60 text-violet-600 dark:text-violet-400',
                                hoverCls: 'hover:bg-violet-50/80 dark:hover:bg-violet-900/20',
                                activeBadge: 'bg-violet-600',
                                activeRow: 'bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 text-violet-700 dark:text-violet-300',
                                dot: 'bg-violet-500',
                            },
                        ];
                        const active = roles.find(r => r.key === selectedRole) || roles[0];
                        const ActiveIcon = active.icon;
                        return (
                            <div className="mb-8" ref={roleDropdownRef}>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                                    {t('auth.select_role')}
                                </p>

                                {/* Trigger Button */}
                                <button
                                    type="button"
                                    onClick={() => setRoleDropdownOpen(o => !o)}
                                    className={clsx(
                                        'w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border-2 transition-all duration-300 shadow-md',
                                        active.triggerCls
                                    )}
                                >
                                    <span className={clsx('p-2 rounded-xl flex-shrink-0', active.iconBg)}>
                                        <ActiveIcon className="w-5 h-5" />
                                    </span>
                                    <span className="flex-1 text-left">
                                        <span className="font-bold text-sm block leading-tight">{active.label}</span>
                                        <span className="text-[11px] opacity-70 block mt-0.5">{active.subtitle}</span>
                                    </span>
                                    <ChevronDown
                                        className={clsx(
                                            'w-4 h-4 opacity-60 transition-transform duration-300 flex-shrink-0',
                                            roleDropdownOpen ? 'rotate-180' : 'rotate-0'
                                        )}
                                    />
                                </button>

                                {/* Dropdown Panel */}
                                <div
                                    className={clsx(
                                        'mt-2 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/60 dark:shadow-slate-900/60 transition-all duration-300 origin-top',
                                        roleDropdownOpen
                                            ? 'opacity-100 scale-y-100 max-h-72 pointer-events-auto'
                                            : 'opacity-0 scale-y-95 max-h-0 pointer-events-none'
                                    )}
                                    style={{ transformOrigin: 'top' }}
                                >
                                    <div className="p-1.5 space-y-1">
                                        {roles.map((role) => {
                                            const Icon = role.icon;
                                            const isActive = selectedRole === role.key;
                                            return (
                                                <button
                                                    key={role.key}
                                                    type="button"
                                                    onClick={async () => {
                                                        handleRoleSelect(role.key);
                                                        setRoleDropdownOpen(false);
                                                        if (role.key === 'supervisor' && recruiters.length === 0) {
                                                            await loadRecruiters();
                                                        }
                                                    }}
                                                    className={clsx(
                                                        'w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group',
                                                        isActive ? role.activeRow : `text-slate-600 dark:text-slate-300 ${role.hoverCls}`
                                                    )}
                                                >
                                                    <span className={clsx(
                                                        'p-2 rounded-xl flex-shrink-0 transition-all duration-200',
                                                        isActive ? role.iconBg : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:' + role.iconBg
                                                    )}>
                                                        <Icon className="w-4 h-4" />
                                                    </span>
                                                    <span className="flex-1 text-left">
                                                        <span className="font-semibold text-sm block leading-tight">{role.label}</span>
                                                        <span className="text-[11px] opacity-60 block mt-0.5">{role.subtitle}</span>
                                                    </span>
                                                    {isActive && (
                                                        <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', role.dot)} />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* For supervisors: choose manager/company to send request to */}
                    {selectedRole === 'supervisor' && (
                        <div className="mb-6">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 md:text-left">
                                Choose manager / company to supervise for
                            </p>
                            <div className="space-y-2">
                                <select
                                    value={selectedRecruiterId}
                                    onChange={(e) => setSelectedRecruiterId(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                >
                                    <option value="">
                                        {recruiterLoading
                                            ? 'Loading recruiters...'
                                            : 'Select a manager / company (optional)'}
                                    </option>
                                    {recruiters.map((r) => (
                                        <option key={r._id} value={r._id}>
                                            {r.company || r.name} — {r.email}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    We&apos;ll send a request to the selected manager so they can approve your supervisor
                                    account. You can skip this step and ask a manager to approve you later.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-slate-900 text-slate-500 font-medium">account details</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <input type="hidden" {...register('role')} />
                        <Input label={t('auth.full_name')} icon={User} type="text" placeholder="Abebe Girma" error={errors.fullName?.message} required {...register('fullName')} />
                        <Input label={t('auth.email')} icon={Mail} type="email" placeholder="you@example.com" error={errors.email?.message} required {...register('email')} />

                        <div className="relative">
                            <Input label={t('auth.password')} icon={Lock} type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" error={errors.password?.message} required
                                rightIcon={() => (
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 relative z-10 w-8 h-8 flex items-center justify-center">
                                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                )}
                                {...register('password')}
                            />
                        </div>

                        <div className="relative">
                            <Input label={t('auth.confirm_password')} icon={Lock} type={showConfirmPass ? 'text' : 'password'} placeholder="Repeat password" error={errors.confirmPassword?.message} required
                                rightIcon={() => (
                                    <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 relative z-10 w-8 h-8 flex items-center justify-center">
                                        {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                )}
                                {...register('confirmPassword')}
                            />
                        </div>

                        <button type="submit" disabled={loading}
                            className={`w-full text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 mt-4
                                ${selectedRole === 'student' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'}`}>
                            {loading ? 'Creating Account...' : t('auth.sign_up')}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <p className="text-left md:text-center font-medium text-slate-600 dark:text-slate-400 mt-8 pb-8">
                        {t('auth.have_account')}{' '}
                        <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                            {t('auth.sign_in')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
