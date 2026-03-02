import clsx from 'clsx';

const variants = {
    primary: 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50',
    secondary: 'bg-white hover:bg-violet-50 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-700',
    outline: 'border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white dark:border-violet-400 dark:text-violet-300',
    ghost: 'text-gray-600 hover:bg-violet-50/60 dark:text-gray-300 dark:hover:bg-gray-800',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    gradient: 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-600 text-white shadow-xl shadow-fuchsia-500/30',
};

const sizes = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
    xl: 'px-8 py-3 text-lg',
};

export default function Button({
    children, variant = 'primary', size = 'md', loading = false,
    disabled = false, fullWidth = false, icon: Icon = null,
    iconPosition = 'left', className = '', ...props
}) {
    return (
        <button
            disabled={disabled || loading}
            className={clsx(
                'inline-flex items-center justify-center gap-2 font-medium rounded-xl',
                'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed select-none',
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                className
            )}
            {...props}
        >
            {loading ? (
                <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon size={16} />}
                    {children}
                    {Icon && iconPosition === 'right' && <Icon size={16} />}
                </>
            )}
        </button>
    );
}
