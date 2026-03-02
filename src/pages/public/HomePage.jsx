import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, Globe, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { toggleTheme } from '../../features/theme/themeSlice';
import { setLanguage } from '../../features/language/languageSlice';

export default function HomePage() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { mode } = useSelector((state) => state.theme);
    const { lang } = useSelector((state) => state.language);

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
            <nav className={`fixed w-full z-50 transition-all duration-300 ${mode === 'dark' ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-md border-b ${mode === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                                <span className="font-extrabold text-white text-xl">F</span>
                            </div>
                            <span className={`font-extrabold text-2xl tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-800'}`}>Frelaunch.</span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8 font-medium">
                            <a href="#how-it-works" className={`hover:text-blue-500 transition-colors ${mode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{t('how_it_works.title')}</a>
                            <a href="#features" className={`hover:text-blue-500 transition-colors ${mode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{t('features.title')}</a>
                            <a href="#testimonials" className={`hover:text-blue-500 transition-colors ${mode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{t('testimonials.title')}</a>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4">

                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-full px-2 py-1">
                                <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                <select
                                    value={lang}
                                    onChange={changeLanguage}
                                    className="bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                                >
                                    <option value="en">EN</option>
                                    <option value="am">AM</option>
                                    <option value="or">OR</option>
                                </select>
                            </div>

                            <button onClick={handleToggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                                {mode === 'light' ? <Moon className="w-5 h-5 text-slate-600" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                            </button>

                            <Link to="/login" className={`hidden sm:block font-bold transition-colors whitespace-nowrap ${mode === 'dark' ? 'text-white hover:text-blue-400' : 'text-slate-700 hover:text-blue-600'}`}>
                                {t('auth.sign_in')}
                            </Link>

                            <Link to="/register" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-500/30 whitespace-nowrap flex-shrink-0">
                                {t('auth.sign_up')}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className={`relative min-h-screen flex items-center justify-center pt-20 ${mode === 'dark' ? 'bg-slate-900' : 'bg-white'} overflow-hidden`}>
                {/* Clean soft background blobs for SaaS style */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/20 dark:bg-blue-900/40 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300/20 dark:bg-purple-900/40 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-emerald-300/20 dark:bg-emerald-900/40 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>

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
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
                                {t('features.title')}
                            </h2>
                            <ul className="space-y-6">
                                {[
                                    t('features.f1_title'),
                                    t('features.f3_title'),
                                    t('features.f4_title'),
                                    t('features.f2_title')
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="mt-1 bg-blue-100 dark:bg-blue-900/50 p-1 rounded-full text-blue-600 dark:text-blue-400 flex-shrink-0">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <p className={`font-medium ${mode === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{feature}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
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
            <footer className={`${mode === 'dark' ? 'bg-slate-900' : 'bg-white'} border-t ${mode === 'dark' ? 'border-slate-800' : 'border-slate-200'} py-12`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <span className="font-bold text-white text-sm">F</span>
                        </div>
                        <span className="font-extrabold text-xl tracking-tight">Frelaunch.</span>
                    </div>
                    <div className={`flex gap-6 text-sm font-semibold ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Link to="#" className="hover:text-blue-500 transition-colors">{t('footer.privacy')}</Link>
                        <Link to="#" className="hover:text-blue-500 transition-colors">{t('footer.terms')}</Link>
                        <Link to="#" className="hover:text-blue-500 transition-colors">{t('footer.contact')}</Link>
                    </div>
                    <p className={`text-sm ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                        &copy; 2026 Frelaunch Inc. {t('footer.rights')}
                    </p>
                </div>
            </footer>

        </div>
    );
}
