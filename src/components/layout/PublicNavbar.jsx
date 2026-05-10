import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, Globe, ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import { toggleTheme } from '../../features/theme/themeSlice';
import { setLanguage } from '../../features/language/languageSlice';

export default function PublicNavbar() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { mode } = useSelector((state) => state.theme);
    const { lang } = useSelector((state) => state.language);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleToggleTheme = () => {
        dispatch(toggleTheme());
    };

    const changeLanguage = (code) => {
        i18n.changeLanguage(code);
        dispatch(setLanguage(code));
    };

    return (
        <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-10">
            <nav className={`max-w-7xl mx-auto transition-all duration-300 ${mode === 'dark' ? 'bg-slate-900/85' : 'bg-white/85'} backdrop-blur-md border ${mode === 'dark' ? 'border-slate-700/60' : 'border-slate-200/80'} rounded-2xl shadow-lg shadow-black/10`}>
                <div className="px-5 sm:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                                    <span className="font-extrabold text-white text-lg">F</span>
                                </div>
                                <span className={`font-extrabold text-xl tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-800'}`}>Frelaunch.</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8 font-medium">
                            <Link to="/explore-jobs" className={`hover:text-blue-500 transition-colors text-sm ${mode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Explore Jobs</Link>
                            <Link to="/#features" className={`hover:text-blue-500 transition-colors text-sm ${mode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{t('features.title')}</Link>
                            <Link to="/success-stories" className={`hover:text-blue-500 transition-colors text-sm ${mode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{t('testimonials.title')}</Link>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3">
                            {/* Mobile Menu Button */}
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>

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
                                        onClick={() => changeLanguage(l.code)}
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

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-slate-200 dark:border-slate-700 overflow-hidden"
                        >
                            <div className="px-5 py-6 flex flex-col gap-4">
                                <Link to="/explore-jobs" onClick={() => setIsMenuOpen(false)} className={`text-sm font-medium ${mode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Explore Jobs</Link>
                                <Link to="/#features" onClick={() => setIsMenuOpen(false)} className={`text-sm font-medium ${mode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{t('features.title')}</Link>
                                <Link to="/success-stories" onClick={() => setIsMenuOpen(false)} className={`text-sm font-medium ${mode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{t('testimonials.title')}</Link>
                                <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className={`text-sm font-bold ${mode === 'dark' ? 'text-white' : 'text-slate-700'}`}>{t('auth.sign_in')}</Link>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="inline-flex items-center justify-center bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30">
                                    {t('auth.sign_up')}
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </div>
    );
}
