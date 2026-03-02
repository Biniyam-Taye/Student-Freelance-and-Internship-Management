import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Sun, Moon, Star, ArrowRight, Zap, MessageSquare, BarChart2,
    Globe, Shield, CheckCircle2, Users, Briefcase, Sparkles,
    TrendingUp, Award, ChevronDown, Play
} from 'lucide-react';
import { toggleTheme } from '../../features/theme/themeSlice';
import { setLanguage } from '../../features/language/languageSlice';
import i18n from '../../i18n';
import { TESTIMONIALS } from '../../utils/mockData';

const LANGS = [
    { code: 'en', label: 'EN' },
    { code: 'am', label: 'AM' },
    { code: 'or', label: 'OR' },
];

const CATEGORIES = ['Branding', 'UI / UX', 'Video Editing', 'Mobile Apps', 'Content Writing'];

function useScrollY() {
    const [y, setY] = useState(0);
    useEffect(() => {
        const fn = () => setY(window.scrollY);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);
    return y;
}

function CountUp({ end, suffix = '', duration = 2000 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !started.current) {
                started.current = true;
                const startTime = performance.now();
                const tick = (now) => {
                    const progress = Math.min((now - startTime) / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.floor(ease * end));
                    if (progress < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            }
        }, { threshold: 0.5 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
}

export default function HomePage() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { mode } = useSelector((s) => s.theme);
    const { lang } = useSelector((s) => s.language);
    const scrollY = useScrollY();
    const [activeCat, setActiveCat] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLang = (code) => {
        dispatch(setLanguage(code));
        i18n.changeLanguage(code);
    };

    const features = [
        { icon: Zap, key: 'f1', color: '#3b82f6', glow: 'rgba(59,130,246,0.35)', label: 'Smart Matching', desc: 'AI-powered job matching based on your skills and preferences.' },
        { icon: MessageSquare, key: 'f2', color: '#8b5cf6', glow: 'rgba(139,92,246,0.35)', label: 'Real-time Chat', desc: 'Communicate instantly with recruiters and team members.' },
        { icon: BarChart2, key: 'f3', color: '#10b981', glow: 'rgba(16,185,129,0.35)', label: 'Skill Analytics', desc: 'Track your skill growth with detailed analytics and insights.' },
        { icon: CheckCircle2, key: 'f4', color: '#f59e0b', glow: 'rgba(245,158,11,0.35)', label: 'Task Management', desc: 'Manage assignments and deadlines with our built-in task system.' },
        { icon: Globe, key: 'f5', color: '#ec4899', glow: 'rgba(236,72,153,0.35)', label: 'Multilingual', desc: 'Full support for English, Amharic, and Afan Oromo.' },
        { icon: Shield, key: 'f6', color: '#6366f1', glow: 'rgba(99,102,241,0.35)', label: 'Secure Platform', desc: 'Enterprise-grade security to protect your data and privacy.' },
    ];

    const steps = [
        {
            num: '01', icon: Users,
            title: t('how_it_works.step1_title'),
            desc: t('how_it_works.step1_desc'),
            accent: '#3b82f6',
        },
        {
            num: '02', icon: Briefcase,
            title: t('how_it_works.step2_title'),
            desc: t('how_it_works.step2_desc'),
            accent: '#8b5cf6',
        },
        {
            num: '03', icon: TrendingUp,
            title: t('how_it_works.step3_title'),
            desc: t('how_it_works.step3_desc'),
            accent: '#10b981',
        },
    ];

    const navScrolled = scrollY > 20;

    return (
        <div style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }}
            className="bg-white dark:bg-[#06040f] text-gray-900 dark:text-white min-h-screen overflow-x-hidden transition-colors duration-300">

            {/* ─── NAVBAR ─────────────────────────────────────────────── */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled
                ? 'bg-[rgba(8,4,20,0.92)] backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
                : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 mr-auto flex-shrink-0">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
                            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)', boxShadow: '0 0 20px rgba(168,85,247,0.5)' }}>
                            <span className="text-white font-black text-sm">F</span>
                        </div>
                        <span className="font-extrabold text-white text-lg tracking-tight">
                            Fre<span style={{ background: 'linear-gradient(90deg,#a855f7,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>launch</span>
                        </span>
                    </Link>

                    {/* Category pills – desktop */}
                    <div className="hidden lg:flex items-center gap-1">
                        {CATEGORIES.map((c, i) => (
                            <button key={c} onClick={() => setActiveCat(i)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${i === activeCat
                                    ? 'bg-white/15 text-white'
                                    : 'text-purple-200/70 hover:text-white hover:bg-white/8'
                                    }`}>
                                {c}
                            </button>
                        ))}
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-2 ml-auto lg:ml-0">
                        {/* Lang */}
                        <div className="hidden sm:flex items-center bg-white/8 rounded-xl p-0.5 border border-white/10">
                            {LANGS.map((l) => (
                                <button key={l.code} onClick={() => handleLang(l.code)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-200 ${lang === l.code
                                        ? 'bg-white text-purple-700 shadow-sm'
                                        : 'text-white/50 hover:text-white'
                                        }`}>
                                    {l.label}
                                </button>
                            ))}
                        </div>

                        {/* Theme */}
                        <button onClick={() => dispatch(toggleTheme())}
                            className="w-9 h-9 flex items-center justify-center rounded-xl text-purple-200 hover:bg-white/10 transition-colors">
                            {mode === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                        </button>

                        <Link to="/login"
                            className="hidden sm:flex px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors">
                            {t('nav.login')}
                        </Link>
                        <Link to="/register"
                            className="px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105"
                            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 0 20px rgba(168,85,247,0.4)' }}>
                            {t('nav.register')}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ─── HERO ────────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Deep dark bg */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#0d0521 0%,#130a2e 40%,#06040f 100%)' }} />

                {/* Ambient orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-30"
                        style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)', filter: 'blur(80px)' }} />
                    <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-20"
                        style={{ background: 'radial-gradient(circle,#06b6d4,transparent 70%)', filter: 'blur(80px)' }} />
                    <div className="absolute bottom-[0%] left-[30%] w-[400px] h-[400px] rounded-full opacity-15"
                        style={{ background: 'radial-gradient(circle,#ec4899,transparent 70%)', filter: 'blur(80px)' }} />
                </div>

                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Left copy */}
                        <div className="text-center lg:text-left animate-fade-in-up">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-purple-200 text-xs mb-8">
                                <Sparkles size={13} className="text-amber-400" />
                                <span>Empowering Ethiopian Students · Recruiters · Admins</span>
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-white mb-6">
                                {t('hero.headline').split('Through')[0]}
                                <br />
                                <span className="relative">
                                    <span style={{ background: 'linear-gradient(90deg,#c084fc,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        Through
                                    </span>
                                </span>
                                <br />
                                <span style={{ background: 'linear-gradient(90deg,#f9a8d4,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Freelance &amp;
                                </span>
                                <br />
                                <span style={{ background: 'linear-gradient(90deg,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Internships
                                </span>
                            </h1>

                            <p className="text-purple-200/70 text-lg sm:text-xl max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
                                {t('hero.subheadline')}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                                <Link to="/register"
                                    className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-white font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                    style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)', boxShadow: '0 10px 40px rgba(139,92,246,0.5)' }}>
                                    {t('hero.cta_register')}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                                </Link>
                                <Link to="/login"
                                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-base transition-all duration-300 border border-white/15 hover:bg-white/10 hover:border-white/25 bg-white/5 backdrop-blur-sm">
                                    <Play size={16} className="opacity-70" />
                                    {t('hero.cta_login')}
                                </Link>
                            </div>

                            {/* Stats row */}
                            <div className="flex flex-wrap items-center gap-8 justify-center lg:justify-start">
                                {[
                                    { icon: Users, val: 700, suffix: '+', label: 'Students' },
                                    { icon: Briefcase, val: 120, suffix: '+', label: 'Companies' },
                                    { icon: Star, val: 4.8, suffix: '', label: '/ 5.0 Rating' },
                                ].map(({ icon: Icon, val, suffix, label }) => (
                                    <div key={label} className="flex items-center gap-2 text-purple-200/80 text-sm">
                                        <Icon size={15} className="text-purple-400" />
                                        <span className="font-bold text-white">
                                            <CountUp end={val} suffix={suffix} />
                                        </span>
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — floating UI cards */}
                        <div className="relative hidden lg:block">
                            {/* Main card */}
                            <div className="relative mx-auto max-w-sm"
                                style={{ filter: 'drop-shadow(0 40px 80px rgba(139,92,246,0.4))' }}>
                                <div className="rounded-3xl overflow-hidden border border-white/10"
                                    style={{ background: 'rgba(20,10,50,0.85)', backdropFilter: 'blur(20px)' }}>

                                    {/* Card header */}
                                    <div className="px-5 py-4 border-b border-white/8"
                                        style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(99,102,241,0.15))' }}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-purple-300/70 font-semibold">Find Freelancers</span>
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                                                style={{ background: 'linear-gradient(90deg,#7c3aed,#ec4899)' }}>
                                                120 available
                                            </span>
                                        </div>
                                        <p className="text-white/60 text-xs">Connect with top student talent</p>
                                    </div>

                                    {/* Tabs */}
                                    <div className="px-5 pt-4 pb-3 border-b border-white/6">
                                        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                                            {['Designers', 'Developers', 'Video Editors', 'SEO'].map((tab, i) => (
                                                <button key={tab}
                                                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 ${i === 0
                                                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                                                        : 'bg-white/6 text-white/50 hover:bg-white/12 hover:text-white/80 border border-white/8'}`}>
                                                    {tab}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Freelancer cards */}
                                    <div className="p-4 space-y-3">
                                        {[
                                            { name: 'Bereket A.', role: 'UI/UX Designer', rate: '$20/hr', rating: 4.9, color: '#7c3aed' },
                                            { name: 'Selam T.', role: 'React Developer', rate: '$18/hr', rating: 4.8, color: '#0ea5e9' },
                                            { name: 'Dawit M.', role: 'Brand Designer', rate: '$22/hr', rating: 5.0, color: '#ec4899' },
                                        ].map((f) => (
                                            <div key={f.name}
                                                className="group flex items-center gap-3 p-3 rounded-2xl border border-white/6 cursor-pointer transition-all duration-200 hover:bg-white/5 hover:border-white/12"
                                                style={{ background: 'rgba(255,255,255,0.03)' }}>
                                                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-lg"
                                                    style={{ background: `linear-gradient(135deg,${f.color},${f.color}aa)`, boxShadow: `0 4px 12px ${f.color}44` }}>
                                                    {f.name[0]}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-xs font-semibold truncate">{f.name}</p>
                                                    <p className="text-white/45 text-[10px] truncate">{f.role}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-white text-xs font-bold">{f.rate}</p>
                                                    <p className="text-amber-400 text-[10px] flex items-center gap-0.5 justify-end">
                                                        <Star size={9} className="fill-amber-400" /> {f.rating}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Bottom CTA */}
                                    <div className="px-4 pb-4">
                                        <button className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                                            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                                            View All Freelancers →
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Floating badge top-right */}
                            <div className="absolute -top-4 -right-4 px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-sm"
                                style={{ background: 'rgba(16,185,129,0.15)', boxShadow: '0 8px 32px rgba(16,185,129,0.25)' }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    <span className="text-emerald-300 text-xs font-semibold">700+ Active Students</span>
                                </div>
                            </div>

                            {/* Floating rating badge bottom-left */}
                            <div className="absolute -bottom-4 -left-6 px-4 py-3 rounded-2xl border border-white/10 backdrop-blur-sm"
                                style={{ background: 'rgba(20,10,50,0.9)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                                <div className="flex items-center gap-2">
                                    <Award size={16} className="text-amber-400" />
                                    <div>
                                        <p className="text-white text-xs font-bold">4.8 / 5.0</p>
                                        <p className="text-white/40 text-[10px]">Platform Rating</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
                    <ChevronDown size={20} />
                </div>
            </section>

            {/* ─── HOW IT WORKS ─────────────────────────────────────────── */}
            <section className="relative py-28 px-4 overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#0e0726 0%,#0b0619 100%)' }} />
                {/* Top divider glow */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(139,92,246,0.6),transparent)' }} />
                {/* Ambient */}
                <div className="absolute top-1/2 left-0 w-72 h-72 -translate-y-1/2 rounded-full opacity-20 pointer-events-none"
                    style={{ background: 'radial-gradient(circle,#3b82f6,transparent 70%)', filter: 'blur(60px)' }} />
                <div className="absolute top-1/2 right-0 w-72 h-72 -translate-y-1/2 rounded-full opacity-15 pointer-events-none"
                    style={{ background: 'radial-gradient(circle,#10b981,transparent 70%)', filter: 'blur(60px)' }} />

                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border"
                            style={{ color: '#a855f7', borderColor: 'rgba(168,85,247,0.3)', background: 'rgba(168,85,247,0.08)' }}>
                            Process
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                            {t('how_it_works.title')}
                        </h2>
                        <p className="text-lg max-w-lg mx-auto" style={{ color: 'rgba(196,181,253,0.6)' }}>
                            {t('how_it_works.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connector line */}
                        <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px"
                            style={{ background: 'linear-gradient(90deg,rgba(59,130,246,0.5),rgba(139,92,246,0.5),rgba(16,185,129,0.5))' }} />

                        {steps.map((s, i) => (
                            <div key={s.num}
                                className="group relative p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 cursor-default"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}
                            >
                                {/* Step number bubble */}
                                <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-xl"
                                    style={{
                                        background: `linear-gradient(135deg,${s.accent},${s.accent}bb)`,
                                        boxShadow: `0 8px 24px ${s.accent}50`
                                    }}>
                                    <s.icon size={24} className="text-white" />
                                    <span className="absolute -top-2 -right-2 text-[10px] font-black text-white w-5 h-5 rounded-full flex items-center justify-center"
                                        style={{ background: s.accent }}>
                                        {s.num}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                                <p className="leading-relaxed text-sm" style={{ color: 'rgba(196,181,253,0.6)' }}>{s.desc}</p>

                                {/* Hover glow */}
                                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                    style={{ boxShadow: `inset 0 0 0 1px ${s.accent}40, 0 20px 60px ${s.accent}20` }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FEATURES ──────────────────────────────────────────────── */}
            <section className="relative py-28 px-4 overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#0d0521 0%,#130a2e 100%)' }} />
                {/* Top divider */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(139,92,246,0.5),transparent)' }} />

                {/* Ambient */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-20 pointer-events-none"
                    style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)', filter: 'blur(120px)' }} />

                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border"
                            style={{ color: '#a78bfa', borderColor: 'rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.08)' }}>
                            Features
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                            {t('features.title')}
                        </h2>
                        <p className="text-lg max-w-lg mx-auto" style={{ color: 'rgba(196,181,253,0.6)' }}>
                            {t('features.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((f, i) => (
                            <div key={f.key}
                                className="group relative p-7 rounded-3xl transition-all duration-300 hover:-translate-y-2 cursor-default overflow-hidden"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>

                                {/* Icon */}
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110"
                                    style={{ background: `linear-gradient(135deg,${f.color},${f.color}bb)`, boxShadow: `0 8px 24px ${f.glow}` }}>
                                    <f.icon size={22} className="text-white" />
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2">{f.label}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'rgba(196,181,253,0.55)' }}>{f.desc}</p>

                                {/* Corner glow on hover */}
                                <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                    style={{ background: `radial-gradient(circle,${f.glow},transparent 70%)`, transform: 'translate(30%,30%)' }} />
                                {/* Inner top border highlight */}
                                <div className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ background: `linear-gradient(90deg,transparent,${f.color},transparent)` }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── STATS BANNER ──────────────────────────────────────────── */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#1e0a4e,#120829,#07030f)' }} />
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-0 top-0 w-[400px] h-[400px] rounded-full opacity-20"
                        style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)', filter: 'blur(60px)' }} />
                    <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full opacity-15"
                        style={{ background: 'radial-gradient(circle,#06b6d4,transparent 70%)', filter: 'blur(60px)' }} />
                </div>

                <div className="relative max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { val: 700, suffix: '+', label: 'Students Placed', color: '#c084fc' },
                            { val: 120, suffix: '+', label: 'Partner Companies', color: '#38bdf8' },
                            { val: 95, suffix: '%', label: 'Placement Rate', color: '#34d399' },
                            { val: 4.8, suffix: '★', label: 'Average Rating', color: '#fbbf24' },
                        ].map((s) => (
                            <div key={s.label} className="p-6 rounded-2xl border border-white/8"
                                style={{ background: 'rgba(255,255,255,0.04)' }}>
                                <div className="text-4xl sm:text-5xl font-black mb-2" style={{ color: s.color }}>
                                    <CountUp end={s.val} suffix={s.suffix} />
                                </div>
                                <p className="text-white/50 text-sm font-medium">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── TESTIMONIALS ──────────────────────────────────────────── */}
            <section className="relative py-28 px-4 overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#060311 0%,#0e0726 100%)' }} />
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(16,185,129,0.4),transparent)' }} />

                {/* Ambient */}
                <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none"
                    style={{ background: 'radial-gradient(circle,#10b981,transparent 70%)', filter: 'blur(80px)' }} />

                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border"
                            style={{ color: '#34d399', borderColor: 'rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.08)' }}>
                            Testimonials
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                            {t('testimonials.title')}
                        </h2>
                        <p className="text-lg max-w-lg mx-auto" style={{ color: 'rgba(196,181,253,0.6)' }}>
                            {t('testimonials.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t_, idx) => (
                            <div key={t_.id}
                                className="group relative p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                style={{
                                    background: idx === 1
                                        ? 'linear-gradient(135deg,#2d1165,#1e0a4e)'
                                        : 'rgba(255,255,255,0.04)',
                                    border: idx === 1
                                        ? '1px solid rgba(168,85,247,0.4)'
                                        : '1px solid rgba(255,255,255,0.07)',
                                    boxShadow: idx === 1
                                        ? '0 20px 60px rgba(139,92,246,0.3)'
                                        : 'none',
                                }}>

                                {/* Quote mark */}
                                <div className="absolute top-6 right-6 text-6xl font-black leading-none"
                                    style={{ color: 'rgba(168,85,247,0.15)' }}>
                                    "
                                </div>

                                {/* Stars */}
                                <div className="flex gap-1 mb-5">
                                    {[...Array(t_.rating)].map((_, i) => (
                                        <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                                    ))}
                                </div>

                                <p className="text-sm leading-relaxed mb-6 italic" style={{ color: idx === 1 ? 'rgba(233,213,255,0.9)' : 'rgba(196,181,253,0.7)' }}>
                                    "{t_.text}"
                                </p>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                                        style={{
                                            background: idx === 1
                                                ? 'linear-gradient(135deg,#a855f7,#ec4899)'
                                                : 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                                            boxShadow: `0 4px 12px ${idx === 1 ? 'rgba(168,85,247,0.5)' : 'rgba(59,130,246,0.4)'}`
                                        }}>
                                        {t_.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{t_.name}</p>
                                        <p className="text-xs" style={{ color: idx === 1 ? 'rgba(216,180,254,0.7)' : 'rgba(148,163,184,0.7)' }}>
                                            {t_.role} · {t_.company}
                                        </p>
                                    </div>
                                </div>

                                {/* Center card inner glow */}
                                {idx === 1 && (
                                    <div className="absolute inset-0 rounded-3xl pointer-events-none"
                                        style={{ boxShadow: 'inset 0 0 60px rgba(168,85,247,0.12)' }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA SECTION ───────────────────────────────────────────── */}
            <section className="relative py-28 px-4 overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#2d0b6b,#1e0a4e,#06040f)' }} />
                {/* Orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-30 pointer-events-none"
                    style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)', filter: 'blur(80px)' }} />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-20 pointer-events-none"
                    style={{ background: 'radial-gradient(circle,#ec4899,transparent 70%)', filter: 'blur(80px)' }} />

                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="relative max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-400/30 bg-purple-500/10 text-purple-300 text-xs mb-8">
                        <Sparkles size={12} className="text-amber-400" />
                        Join the Frelaunch Community Today
                    </div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                        Ready to launch
                        <br />
                        <span style={{ background: 'linear-gradient(90deg,#c084fc,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            your career?
                        </span>
                    </h2>
                    <p className="text-purple-200/70 text-lg mb-10 max-w-xl mx-auto">
                        Join thousands of students and top companies connecting on Frelaunch today.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register"
                            className="group inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 hover:scale-105"
                            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)', boxShadow: '0 10px 40px rgba(139,92,246,0.5)' }}>
                            Get Started Free
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/login"
                            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 border border-white/20 hover:bg-white/10 bg-white/5 backdrop-blur-sm">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ────────────────────────────────────────────────── */}
            <footer className="relative py-16 px-4 border-t border-white/5"
                style={{ background: '#06040f' }}>
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
                        <div>
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 0 16px rgba(168,85,247,0.4)' }}>
                                    <span className="text-white font-black text-sm">F</span>
                                </div>
                                <span className="font-extrabold text-white text-lg">Frelaunch</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed">{t('footer.tagline')}</p>
                        </div>

                        {[
                            {
                                title: t('footer.links_platform'),
                                links: [
                                    { label: 'For Students', to: '/register' },
                                    { label: 'For Recruiters', to: '/register' },
                                    { label: 'How it Works', to: '/' },
                                ],
                            },
                            {
                                title: t('footer.links_company'),
                                links: [
                                    { label: t('footer.about'), to: '#' },
                                    { label: t('footer.contact'), to: '#' },
                                ],
                            },
                            {
                                title: t('footer.links_support'),
                                links: [
                                    { label: t('footer.faq'), to: '#' },
                                    { label: t('footer.privacy'), to: '#' },
                                    { label: t('footer.terms'), to: '#' },
                                ],
                            },
                        ].map((col) => (
                            <div key={col.title}>
                                <h4 className="text-white font-semibold mb-5 text-sm">{col.title}</h4>
                                <ul className="space-y-3">
                                    {col.links.map((l) => (
                                        <li key={l.label}>
                                            <Link to={l.to}
                                                className="text-gray-500 text-sm hover:text-purple-400 transition-colors duration-200">
                                                {l.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-gray-600 text-sm">© 2026 Frelaunch. {t('footer.rights')}</p>
                        <p className="text-gray-600 text-xs">Built with ❤️ for Ethiopian talent</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
