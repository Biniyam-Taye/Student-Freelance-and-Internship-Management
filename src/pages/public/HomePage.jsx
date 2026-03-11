import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, Globe, ArrowRight, Play, CheckCircle2, Target, BarChart2, ClipboardList, MessageCircle, Twitter, Linkedin, Github, Instagram, Mail, MapPin, Phone, ChevronDown } from 'lucide-react';
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
                {/* Hero Background Image */}
                <div
                    className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat pointer-events-none"
                    style={{ backgroundImage: "url('/hero-bg.jpg')", opacity: 0.22 }}
                />
                {/* Gradient overlay for readability */}
                <div className={`absolute inset-0 z-0 pointer-events-none ${mode === 'dark'
                    ? 'bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-slate-900/80'
                    : 'bg-gradient-to-b from-white/60 via-white/20 to-white/80'
                    }`} />

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <h1 className={`text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 ${mode === 'dark' ? 'text-white drop-shadow-md' : 'text-slate-900 drop-shadow-sm'}`}>
                        {t('hero.title_part1')} <br className="hidden lg:block" />
                        <span className="text-blue-600 dark:text-blue-400 relative inline-block">
                            {t('hero.title_highlight1')}
                            <div className="absolute w-[105%] h-3 bg-blue-200/50 dark:bg-blue-800/50 -bottom-1 -left-2 rounded-full -z-10 rotate-[-1deg]"></div>
                        </span> {t('hero.title_and')} <span className="text-blue-600 dark:text-blue-400 relative inline-block">
                            {t('hero.title_highlight2')}
                            <div className="absolute w-[105%] h-3 bg-blue-200/50 dark:bg-blue-800/50 -bottom-1 -left-2 rounded-full -z-10 rotate-[1deg]"></div>
                        </span> {t('hero.title_part2')}
                    </h1>
                    <p className={`text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 ${mode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        {t('hero.subheadline')}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-xl shadow-blue-500/20 active:scale-95 whitespace-nowrap">
                            {t('hero.cta_register')} <ArrowRight className="w-5 h-5 flex-shrink-0" />
                        </Link>
                        <Link to="/login" className={`w-full sm:w-auto flex items-center justify-center gap-2 border ${mode === 'dark' ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'} px-8 py-4 rounded-full text-lg font-bold transition-all active:scale-95 shadow-sm whitespace-nowrap`}>
                            {t('hero.cta_login')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className={`py-24 ${mode === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">{t('how_it_works.title')}</h2>
                        <p className={`text-lg ${mode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{t('how_it_works.subtitle')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Steps */}
                        {[1, 2, 3].map((stepNum, idx) => (
                            <div key={idx} className={`p-8 rounded-3xl ${mode === 'dark' ? 'bg-slate-800' : 'bg-slate-50'} border ${mode === 'dark' ? 'border-slate-700' : 'border-slate-100'} text-center`}>
                                <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-6 shadow-lg shadow-blue-500/30">
                                    {stepNum}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{t(`how_it_works.step${stepNum}_title`)}</h3>
                                <p className={`leading-relaxed ${mode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {t(`how_it_works.step${stepNum}_desc`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className={`py-24 ${mode === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        {/* Left - Rich Content */}
                        <div>
                            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full mb-4">
                                Why Frelaunch?
                            </span>
                            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                                {t('features.title')}
                            </h2>
                            <p className={`text-base mb-10 leading-relaxed ${mode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                Everything you need to find, manage, and grow your freelance or internship career — all in one powerful platform built for Ethiopian students and top companies.
                            </p>

                            {/* Feature Cards */}
                            <div className="space-y-5 mb-10">
                                {[
                                    { Icon: Target, title: 'Smart Matching', desc: 'Our AI engine connects students to opportunities that match their exact skillset and career goals.' },
                                    { Icon: BarChart2, title: 'Skill Analytics', desc: 'Track your growth month by month with visual skill progression charts and performance scores.' },
                                    { Icon: ClipboardList, title: 'Task Management', desc: 'Manage assigned freelance tasks with deadlines, priorities, and built-in progress tracking.' },
                                    { Icon: MessageCircle, title: 'Real-time Chat', desc: 'Communicate directly with recruiters and team members via instant messaging inside the platform.' },
                                ].map(({ Icon, title, desc }, i) => (
                                    <div key={i} className={`flex gap-4 p-4 rounded-2xl border transition-colors ${mode === 'dark' ? 'border-slate-700 bg-slate-900/50 hover:border-blue-700' : 'border-slate-200 bg-white hover:border-blue-300'}`}>
                                        <div className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center ${mode === 'dark' ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                            <Icon size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm mb-1">{title}</h4>
                                            <p className={`text-sm leading-relaxed ${mode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Stats Row */}
                            <div className={`flex gap-8 py-6 border-t ${mode === 'dark' ? 'border-slate-700' : 'border-slate-200'} mb-8`}>
                                {[
                                    { value: '720+', label: 'Active Students' },
                                    { value: '112+', label: 'Partner Companies' },
                                    { value: '85%', label: 'Placement Rate' },
                                ].map(({ value, label }) => (
                                    <div key={label}>
                                        <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{value}</div>
                                        <div className={`text-xs font-semibold mt-0.5 ${mode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <Link to="/register" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-full font-bold text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-95">
                                Get Started for Free <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Right - Image */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 rounded-3xl blur-3xl opacity-20 transform translate-x-5 translate-y-5"></div>
                            <img
                                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                                alt="Dashboard preview"
                                className="relative rounded-3xl shadow-2xl border-4 border-white dark:border-slate-700 object-cover"
                            />
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
