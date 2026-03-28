import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Button from './Button';
import clsx from 'clsx';

export default function Modal({ isOpen, onClose, title, children, size = 'md', footer = null }) {
    const overlayRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-6xl',
    };

    return createPortal(
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
            <div className={clsx(
                'relative w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl',
                'animate-fade-in-up',
                sizes[size]
            )}>
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:bg-gray-800 transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-6 overflow-visible">{children}</div>
                {footer && (
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-gray-800">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
