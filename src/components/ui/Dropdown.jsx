import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export default function Dropdown({ trigger, children, align = 'left', className = '' }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className={clsx('relative', className)} ref={ref}>
            <div onClick={() => setOpen(!open)} className="cursor-pointer">
                {trigger}
            </div>
            {open && (
                <div className={clsx(
                    'absolute z-50 mt-2 min-w-[180px] rounded-xl border border-gray-100 dark:border-gray-700',
                    'bg-white dark:bg-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50',
                    'animate-fade-in-up py-1',
                    align === 'right' ? 'right-0' : 'left-0',
                )}>
                    {children}
                </div>
            )}
        </div>
    );
}

export function DropdownItem({ children, onClick, icon: Icon, danger = false }) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                'w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors text-left',
                danger
                    ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            )}
        >
            {Icon && <Icon size={14} className="opacity-70" />}
            {children}
        </button>
    );
}
