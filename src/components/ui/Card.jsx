import clsx from 'clsx';

export default function Card({ children, className = '', hover = false, glass = false, padding = 'p-6' }) {
    return (
        <div
            className={clsx(
                'rounded-3xl border transition-all duration-300',
                glass
                    ? 'glass'
                    : 'bg-white/90 dark:bg-gray-900/80 border-gray-100/80 dark:border-gray-800',
                'shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.6)]',
                hover && 'card-hover cursor-pointer',
                padding,
                className
            )}
        >
            {children}
        </div>
    );
}
