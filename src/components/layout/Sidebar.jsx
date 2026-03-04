import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
    LayoutDashboard, FileText, CheckSquare, TrendingUp, MessageSquare,
    Settings, Briefcase, PlusSquare, Users, BarChart2, Flag,
    Activity, ChevronLeft, ChevronRight, LogOut, AlignLeft, Search,
} from 'lucide-react';
import { logout } from '../../features/auth/authSlice';
import clsx from 'clsx';

const studentNav = [
    { key: 'overview', label: 'dashboard.overview', icon: LayoutDashboard, path: '/student' },
    { key: 'browse', label: 'dashboard.browse_opportunities', icon: Search, path: '/student/browse' },
    { key: 'applications', label: 'dashboard.applications', icon: FileText, path: '/student/applications' },
    { key: 'tasks', label: 'dashboard.tasks', icon: CheckSquare, path: '/student/tasks' },
    { key: 'skills', label: 'dashboard.skill_progress', icon: TrendingUp, path: '/student/skills' },
    { key: 'messages', label: 'dashboard.messages', icon: MessageSquare, path: '/student/messages', badge: 'chat' },
    { key: 'profile', label: 'dashboard.profile_settings', icon: Settings, path: '/student/profile' },
];

const recruiterNav = [
    { key: 'overview', label: 'dashboard.overview', icon: LayoutDashboard, path: '/recruiter' },
    { key: 'post', label: 'dashboard.post_opportunity', icon: PlusSquare, path: '/recruiter/post' },
    { key: 'posts', label: 'dashboard.my_posts', icon: Briefcase, path: '/recruiter/posts' },
    { key: 'applications', label: 'dashboard.applications', icon: FileText, path: '/recruiter/applications' },
    { key: 'tasks', label: 'dashboard.assigned_tasks', icon: CheckSquare, path: '/recruiter/tasks' },
    { key: 'messages', label: 'dashboard.messages', icon: MessageSquare, path: '/recruiter/messages', badge: 'chat' },
    { key: 'company', label: 'dashboard.company_profile', icon: Settings, path: '/recruiter/profile' },
];

const adminNav = [
    { key: 'overview', label: 'dashboard.overview', icon: LayoutDashboard, path: '/admin' },
    { key: 'users', label: 'dashboard.manage_users', icon: Users, path: '/admin/users' },
    { key: 'posts', label: 'dashboard.manage_posts', icon: Briefcase, path: '/admin/posts' },
    { key: 'reports', label: 'dashboard.reports', icon: Flag, path: '/admin/reports' },
    { key: 'analytics', label: 'dashboard.system_analytics', icon: Activity, path: '/admin/analytics' },
];

const navByRole = { student: studentNav, recruiter: recruiterNav, admin: adminNav };

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((s) => s.auth);
    const chatState = useSelector((s) => s.chat);
    // Compute unread: count messages in conversations not sent by me
    const chatUnread = 0; // Real unread tracking would require server-side unread counts

    const navItems = navByRole[user?.role] || studentNav;

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const getBadge = (item) => {
        if (item.badge === 'chat' && chatUnread > 0) return chatUnread;
        return null;
    };

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={onMobileClose}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                'fixed top-16 left-0 bottom-0 z-30 flex flex-col',
                'bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800',
                'sidebar-transition overflow-hidden',
                // Desktop
                collapsed ? 'w-[72px]' : 'w-64',
                // Mobile
                'lg:translate-x-0',
                mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}>
                {/* Collapse toggle (desktop) */}
                <button
                    onClick={onToggle}
                    id="sidebar-collapse-btn"
                    className="hidden lg:flex absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full items-center justify-center shadow-md text-gray-500 hover:text-blue-600 dark:text-gray-400 z-10 transition-colors"
                >
                    {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                </button>

                {/* Nav items */}
                <nav className="flex-1 py-4 px-2 overflow-y-auto overflow-x-hidden">
                    <div className="space-y-0.5">
                        {navItems.map((item) => {
                            const badge = getBadge(item);
                            return (
                                <NavLink
                                    key={item.key}
                                    to={item.path}
                                    end={item.path === '/student' || item.path === '/recruiter' || item.path === '/admin'}
                                    onClick={onMobileClose}
                                    className={({ isActive }) => clsx(
                                        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                                        isActive
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                    )}
                                >
                                    {({ isActive }) => (
                                        <>
                                            {isActive && (
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-600 rounded-r-full" />
                                            )}
                                            <item.icon size={18} className="flex-shrink-0" />
                                            {!collapsed && (
                                                <span className="text-sm font-medium truncate">{t(item.label)}</span>
                                            )}
                                            {badge && !collapsed && (
                                                <span className="ml-auto w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                    {badge}
                                                </span>
                                            )}
                                            {badge && collapsed && (
                                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
                                            )}
                                            {/* Tooltip on collapsed */}
                                            {collapsed && (
                                                <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">
                                                    {t(item.label)}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>

                {/* User info + logout */}
                <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                    >
                        <LogOut size={18} className="flex-shrink-0" />
                        {!collapsed && <span className="text-sm font-medium">{t('nav.logout')}</span>}
                        {collapsed && (
                            <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                                {t('nav.logout')}
                            </div>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}
