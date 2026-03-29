import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, Globe, ArrowRight, Play, CheckCircle2, Target, BarChart2, ClipboardList, MessageCircle, Twitter, Linkedin, Github, Instagram, Mail, MapPin, Phone, ChevronDown, UserCircle2, Search, TrendingUp, Zap, Shield, Users } from 'lucide-react';
import Dropdown, { DropdownItem } from '../../components/ui/Dropdown';
import { toggleTheme } from '../../features/theme/themeSlice';
import { setLanguage } from '../../features/language/languageSlice';

export default function HomePage() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { mode } = useSelector((state) => state.theme);
    const { lang } = useSelector((state) => state.language);

    React.useEffect(() => {
        if (window.location.hash) {
            const id = window.location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [window.location.hash]);

    const handleToggleTheme = () => {
        dispatch(toggleTheme());
    };

    const changeLanguage = (e) => {
        const selectedLang = e.target.value;
        i18n.changeLanguage(selectedLang);
        dispatch(setLanguage(selectedLang));
    };

    return (
        <div className={`min-h-screen ${mode === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} font-sans transition-colors duration-300`}>

            {/* Navbar */}
            <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-10">
                <nav className={`max-w-7xl mx-auto transition-all duration-300 ${mode === 'dark' ? 'bg-slate-900/85' : 'bg-white/85'} backdrop-blur-md border ${mode === 'dark' ? 'border-slate-700/60' : 'border-slate-200/80'} rounded-2xl shadow-lg shadow-black/10`}>
                    <div className="px-5 sm:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                                    <span className="font-extrabold text-white text-lg">F</span>
                                </div>
                                <span className={`font-extrabold text-xl tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-800'}`}>Frelaunch.</span>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center gap-8 font-medium">
                                <a href="#how-it-works" className={`hover:text-blue-500 transition-colors text-sm ${mode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{t('how_it_works.title')}</a>
                                <a href="#features" className={`hover:text-blue-500 transition-colors text-sm ${mode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{t('features.title')}</a>
                                <Link to="/success-stories" className={`hover:text-blue-500 transition-colors text-sm ${mode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{t('testimonials.title')}</Link>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-3">
                                <Dropdown
                                    align="right"
                                    trigger={
                                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full px-3 py-1.5 transition-colors cursor-pointer">
                                            <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase">{lang}</span>
                                            <ChevronDown size={14} className="text-slate-400" />
                                        </div>
                                    }
                                >
                                    {[
                                        { code: 'en', label: 'English' },
                                        { code: 'am', label: 'አማርኛ' },
                                        { code: 'or', label: 'Afaan Oromo' },
                                    ].map((l) => (
                                        <DropdownItem
                                            key={l.code}
                                            onClick={() => changeLanguage({ target: { value: l.code } })}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span>{l.label}</span>
                                                {lang === l.code && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                            </div>
                                        </DropdownItem>
                                    ))}
                                </Dropdown>

                                <button onClick={handleToggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                                    {mode === 'light' ? <Moon className="w-5 h-5 text-slate-600" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                                </button>

                                <Link to="/login" className={`hidden sm:block text-sm font-bold transition-colors whitespace-nowrap ${mode === 'dark' ? 'text-white hover:text-blue-400' : 'text-slate-700 hover:text-blue-600'}`}>
                                    {t('auth.sign_in')}
                                </Link>

                                <Link to="/register" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-md shadow-blue-500/30 whitespace-nowrap flex-shrink-0">
                                    {t('auth.sign_up')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Hero Section */}
            <section className={`relative min-h-screen flex items-center justify-center pt-20 ${mode === 'dark' ? 'bg-slate-900' : 'bg-white'} overflow-hidden`}>
                {/* Hero Background Image — untouched */}
                <div
                    className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat pointer-events-none"
                    style={{ backgroundImage: "url('/hero-bg.jpg')", opacity: 0.22 }}
                />
                {/* Gradient overlay */}
                <div className={`absolute inset-0 z-0 pointer-events-none ${mode === 'dark'
                    ? 'bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-900/90'
                    : 'bg-gradient-to-b from-white/70 via-white/30 to-white/90'
                    }`} />

                {/* Subtle radial glow behind content */}
                <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
                    <div className={`w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 ${mode === 'dark' ? 'bg-blue-500' : 'bg-blue-300'}`} />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">

                    {/* Pill badge */}
                    <div className="inline-flex items-center gap-2 mb-6">
                        <span className={`inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full border backdrop-blur-sm
                            ${mode === 'dark'
                                ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                                : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            {t('hero.badge')}
                        </span>
                    </div>

                    {/* Headline — refined size */}
                    <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.2] mb-5 ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {t('hero.title_part1')}
                        <br />
                        <span className="relative inline-block">
                            <span className="text-blue-600 dark:text-blue-400">{t('hero.title_highlight1')}</span>
                        </span>
                        {' '}&amp;{' '}
                        <span className="relative inline-block">
                            <span className="text-blue-600 dark:text-blue-400">{t('hero.title_highlight2')}</span>
                            {/* Underline decoration */}
                            <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" preserveAspectRatio="none" height="6">
                                <path d="M0,5 Q50,0 100,5 Q150,10 200,5" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                            </svg>
                        </span>
                        {' '}{t('hero.title_part2')}
                    </h1>

                    {/* Subheadline */}
                    <p className={`text-sm sm:text-base font-normal max-w-xl mx-auto mb-8 leading-relaxed ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {t('hero.subheadline')}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
                        <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-500/30 active:scale-95 whitespace-nowrap">
                            {t('hero.cta_register')} <ArrowRight className="w-4 h-4 flex-shrink-0" />
                        </Link>
                        <Link to="/login" className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 border ${mode === 'dark' ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'} px-7 py-3 rounded-full text-sm font-semibold transition-all active:scale-95 shadow-sm whitespace-nowrap backdrop-blur-sm`}>
                            {t('hero.cta_login')}
                        </Link>
                    </div>

                    {/* Floating stat cards */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {[
                            { value: '720+', label: t('hero.stat_students') },
                            { value: '112+', label: t('hero.stat_companies') },
                            { value: '85%', label: t('hero.stat_placement') },
                        ].map(({ value, label }) => (
                            <div key={label} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border backdrop-blur-sm text-left
                                ${mode === 'dark'
                                    ? 'bg-slate-800/60 border-slate-700/60 text-white'
                                    : 'bg-white/70 border-slate-200 text-slate-800'} shadow-sm`}>
                                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{value}</span>
                                <span className={`text-xs font-medium ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-50">
                    <span className={`text-[10px] font-semibold uppercase tracking-widest ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t('hero.scroll')}</span>
                    <div className={`w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5 ${mode === 'dark' ? 'border-slate-600' : 'border-slate-300'}`}>
                        <div className={`w-1 h-2 rounded-full animate-bounce ${mode === 'dark' ? 'bg-slate-400' : 'bg-slate-400'}`} />
                    </div>
                </div>
            </section>


            {/* How It Works — Rich Content Layout */}
            <section id="how-it-works" className={`py-24 relative overflow-hidden ${mode === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>

                {/* Subtle grid pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
                    style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    {/* Header row */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-px w-8 bg-blue-500" />
                                <span className={`text-xs font-bold uppercase tracking-[0.2em] ${mode === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{t('how_it_works.label')}</span>
                            </div>
                            <h2 className={`text-3xl md:text-4xl font-bold tracking-tight leading-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {t('how_it_works.title')}
                            </h2>
                        </div>
                        <p className={`text-sm max-w-xs leading-relaxed ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {t('how_it_works.subtitle')}
                        </p>
                    </div>

                    {/* Step 01 */}
                    <div className={`rounded-3xl border overflow-hidden mb-5 ${mode === 'dark' ? 'border-slate-800 bg-slate-800/30' : 'border-slate-100 bg-slate-50'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="p-8 md:p-10 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-5">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${mode === 'dark' ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>Step 01</span>
                                    <span className={`text-xs ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t('how_it_works.step1_time')}</span>
                                </div>
                                <h3 className={`text-2xl font-bold mb-3 ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('how_it_works.step1_title')}</h3>
                                <p className={`text-sm leading-relaxed mb-6 ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t('how_it_works.step1_desc')}</p>
                                <ul className="space-y-2.5 mb-7">
                                    {[t('how_it_works.step1_b1'), t('how_it_works.step1_b2'), t('how_it_works.step1_b3'), t('how_it_works.step1_b4')].map(item => (
                                        <li key={item} className="flex items-center gap-2.5">
                                            <CheckCircle2 size={14} className={`flex-shrink-0 ${mode === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                                            <span className={`text-sm ${mode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className={`flex items-center gap-6 pt-5 border-t ${mode === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                                    {[{ v: '720+', l: t('how_it_works.step1_stat1') }, { v: '2 min', l: t('how_it_works.step1_stat2') }].map(({ v, l }) => (
                                        <div key={l}>
                                            <div className={`text-xl font-black ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{v}</div>
                                            <div className={`text-xs ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{l}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={`relative flex items-center justify-center p-8 ${mode === 'dark' ? 'bg-slate-800/50' : 'bg-white'}`}>
                                <span className={`absolute text-[120px] font-black leading-none select-none right-4 top-4 ${mode === 'dark' ? 'text-blue-500/5' : 'text-blue-50'}`}>01</span>
                                <div className={`relative z-10 w-full max-w-xs rounded-2xl border p-5 shadow-lg ${mode === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">A</div>
                                        <div>
                                            <div className={`text-sm font-bold ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Abebe Tadesse</div>
                                            <div className={`text-xs ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Computer Science · AAU</div>
                                        </div>
                                        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">{t('how_it_works.mock_active')}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {['React', 'Node.js', 'Python', 'UI/UX'].map(s => (
                                            <span key={s} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${mode === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>{s}</span>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className={mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}>{t('how_it_works.profile_completion')}</span>
                                        <span className={`font-bold ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>92%</span>
                                    </div>
                                    <div className={`h-1.5 rounded-full overflow-hidden ${mode === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                        <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 02 */}
                    <div className={`rounded-3xl border overflow-hidden mb-5 ${mode === 'dark' ? 'border-slate-800 bg-slate-800/30' : 'border-slate-100 bg-slate-50'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className={`relative flex items-center justify-center p-8 order-2 md:order-1 ${mode === 'dark' ? 'bg-slate-800/50' : 'bg-white'}`}>
                                <span className={`absolute text-[120px] font-black leading-none select-none left-4 top-4 ${mode === 'dark' ? 'text-violet-500/5' : 'text-violet-50'}`}>02</span>
                                <div className={`relative z-10 w-full max-w-xs rounded-2xl border p-5 shadow-lg ${mode === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                                    <div className={`text-xs font-bold mb-3 ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t('how_it_works.step2_card_title')}</div>
                                    {[
                                        { role: 'Frontend Developer Intern', co: 'TechStartup Ethiopia', match: '97%', color: 'text-emerald-400' },
                                        { role: 'UI/UX Freelance Project', co: 'Creative Agency AA', match: '91%', color: 'text-blue-400' },
                                        { role: 'Full-stack Developer', co: 'FinTech Co.', match: '85%', color: 'text-violet-400' },
                                    ].map(job => (
                                        <div key={job.role} className={`flex items-center gap-3 py-2.5 border-b last:border-0 ${mode === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                                            <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-[10px] font-black ${mode === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>{job.co[0]}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className={`text-xs font-semibold truncate ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{job.role}</div>
                                                <div className={`text-[10px] ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{job.co}</div>
                                            </div>
                                            <span className={`text-xs font-black flex-shrink-0 ${job.color}`}>{job.match}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-8 md:p-10 flex flex-col justify-center order-1 md:order-2">
                                <div className="flex items-center gap-3 mb-5">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${mode === 'dark' ? 'bg-violet-500/15 text-violet-400' : 'bg-violet-100 text-violet-600'}`}>Step 02</span>
                                    <span className={`text-xs ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t('how_it_works.step2_time')}</span>
                                </div>
                                <h3 className={`text-2xl font-bold mb-3 ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('how_it_works.step2_title')}</h3>
                                <p className={`text-sm leading-relaxed mb-6 ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t('how_it_works.step2_desc')}</p>
                                <ul className="space-y-2.5 mb-7">
                                    {[t('how_it_works.step2_b1'), t('how_it_works.step2_b2'), t('how_it_works.step2_b3'), t('how_it_works.step2_b4')].map(item => (
                                        <li key={item} className="flex items-center gap-2.5">
                                            <CheckCircle2 size={14} className={`flex-shrink-0 ${mode === 'dark' ? 'text-violet-400' : 'text-violet-500'}`} />
                                            <span className={`text-sm ${mode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className={`flex items-center gap-6 pt-5 border-t ${mode === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                                    {[{ v: '112+', l: t('how_it_works.step2_stat1') }, { v: '94%', l: t('how_it_works.step2_stat2') }].map(({ v, l }) => (
                                        <div key={l}>
                                            <div className={`text-xl font-black ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{v}</div>
                                            <div className={`text-xs ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{l}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 03 */}
                    <div className={`rounded-3xl border overflow-hidden ${mode === 'dark' ? 'border-slate-800 bg-slate-800/30' : 'border-slate-100 bg-slate-50'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="p-8 md:p-10 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-5">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${mode === 'dark' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>Step 03</span>
                                    <span className={`text-xs ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t('how_it_works.step3_time')}</span>
                                </div>
                                <h3 className={`text-2xl font-bold mb-3 ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('how_it_works.step3_title')}</h3>
                                <p className={`text-sm leading-relaxed mb-6 ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t('how_it_works.step3_desc')}</p>
                                <ul className="space-y-2.5 mb-7">
                                    {[t('how_it_works.step3_b1'), t('how_it_works.step3_b2'), t('how_it_works.step3_b3'), t('how_it_works.step3_b4')].map(item => (
                                        <li key={item} className="flex items-center gap-2.5">
                                            <CheckCircle2 size={14} className={`flex-shrink-0 ${mode === 'dark' ? 'text-emerald-400' : 'text-emerald-500'}`} />
                                            <span className={`text-sm ${mode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className={`flex items-center gap-6 pt-5 border-t ${mode === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                                    {[{ v: '85%', l: t('how_it_works.step3_stat1') }, { v: '4.9★', l: t('how_it_works.step3_stat2') }].map(({ v, l }) => (
                                        <div key={l}>
                                            <div className={`text-xl font-black ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{v}</div>
                                            <div className={`text-xs ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{l}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={`relative flex items-center justify-center p-8 ${mode === 'dark' ? 'bg-slate-800/50' : 'bg-white'}`}>
                                <span className={`absolute text-[120px] font-black leading-none select-none right-4 top-4 ${mode === 'dark' ? 'text-emerald-500/5' : 'text-emerald-50'}`}>03</span>
                                <div className="relative z-10 w-full max-w-xs space-y-3">
                                    {[
                                        { label: 'React Skills', pct: 88, color: 'from-blue-500 to-cyan-400' },
                                        { label: 'Project Delivery', pct: 95, color: 'from-emerald-500 to-teal-400' },
                                        { label: 'Communication', pct: 91, color: 'from-violet-500 to-purple-400' },
                                        { label: 'Problem Solving', pct: 78, color: 'from-orange-500 to-amber-400' },
                                    ].map(({ label, pct, color }) => (
                                        <div key={label} className={`p-4 rounded-2xl border ${mode === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                                            <div className="flex justify-between text-xs mb-2">
                                                <span className={`font-semibold ${mode === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
                                                <span className={`font-black ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{pct}%</span>
                                            </div>
                                            <div className={`h-1.5 rounded-full overflow-hidden ${mode === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                                <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-10 text-center">
                        <Link to="/register" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-full text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all active:scale-95">
                            {t('how_it_works.cta')} <ArrowRight size={15} />
                        </Link>
                    </div>

                </div>
            </section>

            {/* Features Section — Premium Split Layout */}
            <section id="features" className={`py-28 relative overflow-hidden ${mode === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>

                {/* Decorative blobs */}
                <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.06] bg-indigo-500 pointer-events-none -translate-x-1/2 -translate-y-1/4" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.06] bg-blue-400 pointer-events-none translate-x-1/4 translate-y-1/4" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    {/* Top label + heading */}
                    <div className="text-center mb-16">
                        <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5
                            ${mode === 'dark' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                            <Shield size={12} /> {t('features.label')}
                        </span>
                        <h2 className={`text-3xl md:text-4xl font-bold tracking-tight mb-3 ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {t('features.title')}
                        </h2>
                        <p className={`text-sm max-w-md mx-auto ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {t('features.section_desc')}
                        </p>
                    </div>

                    {/* Main grid: spotlight left + feature list right */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">

                        {/* Left — Spotlight hero card */}
                        <div className={`lg:col-span-2 relative rounded-3xl overflow-hidden p-8 flex flex-col justify-between min-h-[420px] border
                            ${mode === 'dark'
                                ? 'bg-gradient-to-b from-blue-600/20 via-indigo-900/30 to-slate-900 border-blue-700/30'
                                : 'bg-gradient-to-b from-blue-500 to-indigo-600 border-transparent'}`}>

                            {/* Decorative rings */}
                            <div className="absolute top-0 right-0 w-64 h-64 rounded-full border border-white/10 -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute top-0 right-0 w-44 h-44 rounded-full border border-white/10 -translate-y-1/2 translate-x-1/2" />

                            <div>
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${mode === 'dark' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/20 text-white'}`}>
                                    <Target size={26} />
                                </div>
                                <h3 className={`text-2xl font-bold mb-3 leading-tight ${mode === 'dark' ? 'text-white' : 'text-white'}`}>
                                    {t('features.spotlight_title')}
                                </h3>
                                <p className={`text-sm leading-relaxed ${mode === 'dark' ? 'text-blue-200/70' : 'text-blue-100'}`}>
                                    {t('features.spotlight_desc')}
                                </p>
                            </div>

                            {/* Live match metric */}
                            <div className={`mt-8 p-4 rounded-2xl ${mode === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white/15 border border-white/20'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-xs font-semibold ${mode === 'dark' ? 'text-blue-300' : 'text-white/80'}`}>{t('features.match_accuracy')}</span>
                                    <span className={`text-xs font-black ${mode === 'dark' ? 'text-white' : 'text-white'}`}>94%</span>
                                </div>
                                <div className={`h-1.5 rounded-full overflow-hidden ${mode === 'dark' ? 'bg-white/10' : 'bg-white/20'}`}>
                                    <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-300" />
                                </div>
                                <div className="flex gap-2 mt-3">
                                    {[t('features.tag_ai'), t('features.tag_realtime'), t('features.tag_personal')].map(tag => (
                                        <span key={tag} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${mode === 'dark' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/20 text-white'}`}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right — Stacked feature cards */}
                        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {[
                                {
                                    icon: BarChart2,
                                    num: '01',
                                    title: t('features.f1_title'),
                                    desc: t('features.f1_desc'),
                                    accent: mode === 'dark' ? 'from-violet-500/10 to-transparent border-violet-700/30 hover:border-violet-600/50' : 'from-violet-50 to-white border-violet-100 hover:border-violet-300',
                                    iconBg: mode === 'dark' ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-600',
                                    numColor: mode === 'dark' ? 'text-violet-500/30' : 'text-violet-200',
                                    bar: 'w-3/4 bg-gradient-to-r from-violet-400 to-purple-400',
                                    barLabel: t('features.f1_bar'),
                                },
                                {
                                    icon: ClipboardList,
                                    num: '02',
                                    title: t('features.f2_title'),
                                    desc: t('features.f2_desc'),
                                    accent: mode === 'dark' ? 'from-emerald-500/10 to-transparent border-emerald-700/30 hover:border-emerald-600/50' : 'from-emerald-50 to-white border-emerald-100 hover:border-emerald-300',
                                    iconBg: mode === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600',
                                    numColor: mode === 'dark' ? 'text-emerald-500/30' : 'text-emerald-200',
                                    bar: 'w-[88%] bg-gradient-to-r from-emerald-400 to-teal-400',
                                    barLabel: t('features.f2_bar'),
                                },
                                {
                                    icon: MessageCircle,
                                    num: '03',
                                    title: t('features.f3_title'),
                                    desc: t('features.f3_desc'),
                                    accent: mode === 'dark' ? 'from-orange-500/10 to-transparent border-orange-700/30 hover:border-orange-600/50' : 'from-orange-50 to-white border-orange-100 hover:border-orange-300',
                                    iconBg: mode === 'dark' ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600',
                                    numColor: mode === 'dark' ? 'text-orange-500/30' : 'text-orange-200',
                                    bar: 'w-[60%] bg-gradient-to-r from-orange-400 to-amber-400',
                                    barLabel: t('features.f3_bar'),
                                },
                                {
                                    icon: Shield,
                                    num: '04',
                                    title: t('features.f4_title'),
                                    desc: t('features.f4_desc'),
                                    accent: mode === 'dark' ? 'from-sky-500/10 to-transparent border-sky-700/30 hover:border-sky-600/50' : 'from-sky-50 to-white border-sky-100 hover:border-sky-300',
                                    iconBg: mode === 'dark' ? 'bg-sky-500/20 text-sky-400' : 'bg-sky-100 text-sky-600',
                                    numColor: mode === 'dark' ? 'text-sky-500/30' : 'text-sky-200',
                                    bar: 'w-full bg-gradient-to-r from-sky-400 to-cyan-400',
                                    barLabel: t('features.f4_bar'),
                                },
                            ].map(({ icon: Icon, num, title, desc, accent, iconBg, numColor, bar, barLabel }) => (
                                <div key={num} className={`relative p-6 rounded-3xl border bg-gradient-to-br overflow-hidden group transition-all duration-300 ${accent}`}>
                                    {/* Big faded number */}
                                    <span className={`absolute top-3 right-4 text-6xl font-black leading-none select-none pointer-events-none ${numColor}`}>{num}</span>

                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
                                        <Icon size={20} />
                                    </div>
                                    <h4 className={`text-sm font-bold mb-1.5 ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
                                    <p className={`text-xs leading-relaxed mb-4 ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>

                                    {/* Metric bar */}
                                    <div>
                                        <div className={`h-1 rounded-full overflow-hidden mb-1 ${mode === 'dark' ? 'bg-white/5' : 'bg-slate-200'}`}>
                                            <div className={`h-full rounded-full ${bar}`} />
                                        </div>
                                        <span className={`text-[10px] font-semibold ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{barLabel}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom CTA strip */}
                    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl border ${mode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div>
                            <p className={`font-bold text-sm ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('features.cta_title')}</p>
                            <p className={`text-xs ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t('features.cta_desc')}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {[t('features.stat1'), t('features.stat2'), t('features.stat3')].map(stat => (
                                <span key={stat} className={`hidden sm:inline text-xs font-semibold px-3 py-1.5 rounded-full ${mode === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{stat}</span>
                            ))}
                            <Link to="/register" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all active:scale-95 whitespace-nowrap">
                                {t('features.cta_btn')} <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                </div>
            </section>



            {/* Footer */}
            <footer className={`${mode === 'dark' ? 'bg-slate-950' : 'bg-slate-900'} text-white`}>

                {/* Main Footer Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

                        {/* Brand Column */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                                    <span className="font-bold text-white text-base">F</span>
                                </div>
                                <span className="font-extrabold text-xl tracking-tight text-white">Frelaunch.</span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
                                The ultimate platform connecting ambitious Ethiopian students with top companies through freelance and internship opportunities.
                            </p>
                            {/* Contact Info */}
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <MapPin size={14} className="text-blue-400 flex-shrink-0" />
                                    <span>Addis Ababa, Ethiopia</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <Mail size={14} className="text-blue-400 flex-shrink-0" />
                                    <span>hello@frelaunch.et</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <Phone size={14} className="text-blue-400 flex-shrink-0" />
                                    <span>+251 91 234 5678</span>
                                </div>
                            </div>
                            {/* Social Icons */}
                            <div className="flex items-center gap-3">
                                {[
                                    { Icon: Twitter, href: '#' },
                                    { Icon: Linkedin, href: '#' },
                                    { Icon: Github, href: '#' },
                                    { Icon: Instagram, href: '#' },
                                ].map(({ Icon, href }, i) => (
                                    <a key={i} href={href} className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors">
                                        <Icon size={16} className="text-slate-400 group-hover:text-white" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Platform Links */}
                        <div>
                            <h4 className="font-bold text-white text-sm mb-5 uppercase tracking-wider">Platform</h4>
                            <ul className="space-y-3">
                                {[
                                    { label: 'Browse Jobs', to: '/student/browse' },
                                    { label: 'Post a Job', to: '/recruiter/post' },
                                    { label: 'Messages', to: '/student/messages' },
                                ].map(({ label, to }) => (
                                    <li key={label}>
                                        <Link to={to} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h4 className="font-bold text-white text-sm mb-5 uppercase tracking-wider">Useful Links</h4>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#how-it-works" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">How It Works</a>
                                </li>
                                <li>
                                    <Link to="/success-stories" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Success Stories</Link>
                                </li>
                                <li>
                                    <Link to="/register" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Register Now</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="font-bold text-white text-sm mb-5 uppercase tracking-wider">Stay Updated</h4>
                            <p className="text-sm text-slate-400 mb-4 leading-relaxed">Get the latest opportunities and platform updates in your inbox.</p>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 placeholder:text-slate-500 transition-colors"
                                />
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                                    Subscribe <ArrowRight size={14} />
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-3">No spam. Unsubscribe anytime.</p>
                        </div>

                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-500">
                            &copy; 2026 Frelaunch Inc. {t('footer.rights')}
                        </p>
                        <div className="flex gap-6 text-sm text-slate-500">
                            <Link to="#" className="hover:text-blue-400 transition-colors">{t('footer.privacy')}</Link>
                            <Link to="#" className="hover:text-blue-400 transition-colors">{t('footer.terms')}</Link>
                            <Link to="#" className="hover:text-blue-400 transition-colors">{t('footer.contact')}</Link>
                        </div>
                    </div>
                </div>

            </footer>

        </div>
    );
}
