import clsx from 'clsx';

export default function Input({
    label, error, hint, icon: Icon, rightIcon: RightIcon,
    className = '', containerClass = '', required = false, ...props
}) {
    return (
        <div className={clsx('flex flex-col gap-1.5', containerClass)}>
            {label && (
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                        <Icon size={16} />
                    </div>
                )}
                <input
                    className={clsx(
                        'w-full rounded-xl border bg-white dark:bg-gray-800/60',
                        'text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        'transition-all duration-200',
                        'py-2.5 text-sm',
                        Icon ? 'pl-10' : 'pl-3.5',
                        RightIcon ? 'pr-10' : 'pr-3.5',
                        error
                            ? 'border-red-400 dark:border-red-500 focus:ring-red-400'
                            : 'border-gray-200 dark:border-gray-700',
                        className
                    )}
                    {...props}
                />
                {RightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 cursor-pointer">
                        <RightIcon size={16} />
                    </div>
                )}
            </div>
            {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
            {hint && !error && <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
        </div>
    );
}
