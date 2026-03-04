import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, Moon, Bell, Menu, X, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { toggleTheme } from '../../features/theme/themeSlice';
import { setLanguage } from '../../features/language/languageSlice';
import { logout } from '../../features/auth/authSlice';
import { markAllAsRead } from '../../features/notifications/notificationSlice';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import Badge from '../ui/Badge';
import i18n from '../../i18n';

const LANGS = [
    { code: 'en', label: 'EN', full: 'English' },
    { code: 'am', label: 'AM', full: 'አማርኛ' },
    { code: 'or', label: 'OR', full: 'Afaan Oromo' },
];

export default function Navbar({ onMenuToggle, sidebarOpen }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { mode } = useSelector((s) => s.theme);
    const { lang } = useSelector((s) => s.language);
    const { user } = useSelector((s) => s.auth);
    const { items, unreadCount } = useSelector((s) => s.notifications);
    const chatUnread = 0; // server-side unread tracking placeholder
    const [notifOpen, setNotifOpen] = useState(false);

    const handleLangChange = (code) => {
        dispatch(setLanguage(code));
        i18n.changeLanguage(code);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return t('dashboard.good_morning');
        if (h < 17) return t('dashboard.good_afternoon');
        return t('dashboard.good_evening');
    };

    const rolePaths = { student: '/student', recruiter: '/recruiter', admin: '/admin' };

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4 px-4 sm:px-6 h-16">
                {/* Menu toggle */}
                <button
                    id="navbar-menu-toggle"
                    onClick={onMenuToggle}
                    className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors lg:hidden"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Logo */}
                <Link to={user ? rolePaths[user.role] : '/'} className="flex items-center gap-2 mr-auto">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <span className="text-white font-bold text-sm">F</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white text-lg hidden sm:block">
                        Fre<span className="gradient-text">launch</span>
                    </span>
                </Link>

                {/* Greeting (desktop) */}
                {user && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
                        {greeting()}, <span className="font-semibold text-gray-700 dark:text-gray-200">{user.name.split(' ')[0]}</span>
                    </p>
                )}

                <div className="flex items-center gap-1 sm:gap-2 ml-auto">
                    {/* Language Switcher */}
                    <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                        {LANGS.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => handleLangChange(l.code)}
                                title={l.full}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${lang === l.code
                                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>

                    {/* Theme toggle */}
                    <button
                        id="theme-toggle"
                        onClick={() => dispatch(toggleTheme())}
                        className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                        {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Notifications */}
                    {user && (
                        <div className="relative">
                            <button
                                id="notifications-btn"
                                onClick={() => setNotifOpen(!notifOpen)}
                                className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                            >
                                <Bell size={18} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            {notifOpen && (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 animate-fade-in-up overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</h3>
                                        <button onClick={() => dispatch(markAllAsRead())} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Mark all read</button>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-700/50">
                                        {items.map((n) => (
                                            <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!n.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                                <div className="flex items-start gap-2">
                                                    {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                                                    <div className={!n.read ? '' : 'pl-4'}>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{n.title}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                                                        <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* User Menu */}
                    {user && (
                        <Dropdown
                            align="right"
                            trigger={
                                <button id="user-menu-btn" className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                                        {user.name?.[0] || 'U'}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-none">{user.name?.split(' ')[0]}</p>
                                        <p className="text-[10px] text-gray-400 capitalize mt-0.5">{user.role}</p>
                                    </div>
                                    <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
                                </button>
                            }
                        >
                            <DropdownItem icon={User} onClick={() => navigate(`/${user.role}/profile`)}>Profile Settings</DropdownItem>
                            <DropdownItem icon={Settings} onClick={() => navigate(`/${user.role}`)}>Dashboard</DropdownItem>
                            <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                            <DropdownItem icon={LogOut} danger onClick={handleLogout}>{t('nav.logout')}</DropdownItem>
                        </Dropdown>
                    )}
                </div>
            </div>
        </header>
    );
}
