import clsx from 'clsx';

const badgeVariants = {
    pending: 'badge-pending',
    shortlisted: 'badge-shortlisted',
    accepted: 'badge-accepted',
    rejected: 'badge-rejected',
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    closed: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    purple: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
};

export default function Badge({ children, variant = 'info', className = '', dot = false }) {
    return (
        <span className={clsx('tag', badgeVariants[variant], className)}>
            {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />}
            {children}
        </span>
    );
}
