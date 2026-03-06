import clsx from 'clsx';

export default function Table({ columns, data, loading = false, emptyMessage = 'No data found', onRowClick }) {
    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton h-12 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-700/60">
            <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50/80 dark:bg-gray-800/60">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className={clsx(
                                'px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                                col.align === 'right' && 'text-right',
                                col.align === 'center' && 'text-center'
                            )}>
                                {col.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800/30 divide-y divide-gray-100 dark:divide-gray-700/40">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={clsx(
                                    'hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors',
                                    onRowClick && 'cursor-pointer'
                                )}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className={clsx(
                                        'px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300',
                                        col.align === 'right' && 'text-right',
                                        col.align === 'center' && 'text-center'
                                    )}>
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
