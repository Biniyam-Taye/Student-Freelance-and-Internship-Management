import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import SearchFilter from '../../components/common/SearchFilter';
import Pagination from '../../components/ui/Pagination';
import { mockApplications } from '../../utils/mockData';
import { MapPin, DollarSign, Clock, Briefcase } from 'lucide-react';

export default function StudentApplications() {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({});
    const PER_PAGE = 4;

    const filtered = mockApplications.filter((a) => {
        if (search && !a.position.toLowerCase().includes(search.toLowerCase()) && !a.company.toLowerCase().includes(search.toLowerCase())) return false;
        if (filters.skill && !a.skills.includes(filters.skill)) return false;
        if (filters.location && a.location !== filters.location) return false;
        return true;
    });

    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const columns = [
        {
            key: 'company', title: 'Company & Role',
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 flex items-center justify-center flex-shrink-0">
                        <Briefcase size={15} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{row.position}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{row.company}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'skills', title: 'Skills',
            render: (skills) => (
                <div className="flex flex-wrap gap-1">
                    {skills.slice(0, 2).map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">{s}</span>
                    ))}
                    {skills.length > 2 && <span className="text-xs text-gray-400">+{skills.length - 2}</span>}
                </div>
            ),
        },
        {
            key: 'stipend', title: 'Stipend',
            render: (v) => (
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <DollarSign size={12} />{v}
                </div>
            ),
        },
        {
            key: 'location', title: 'Location',
            render: (v) => (
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <MapPin size={12} />{v}
                </div>
            ),
        },
        {
            key: 'date', title: 'Applied',
            render: (v) => (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} />{v}
                </div>
            ),
        },
        {
            key: 'status', title: 'Status', align: 'center',
            render: (v) => <Badge variant={v} dot>{t(`status.${v}`)}</Badge>,
        },
    ];

    return (
        <div className="space-y-6 page-enter">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('dashboard.applications')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track all your internship and freelance applications</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total', val: mockApplications.length, color: 'text-gray-700 dark:text-gray-200' },
                    { label: 'Pending', val: mockApplications.filter(a => a.status === 'pending').length, color: 'text-amber-600 dark:text-amber-400' },
                    { label: 'Shortlisted', val: mockApplications.filter(a => a.status === 'shortlisted').length, color: 'text-blue-600 dark:text-blue-400' },
                    {
                        label: 'Accepted',
                        val: mockApplications.filter(a => a.status === 'accepted').length,
                        color: 'text-emerald-600 dark:text-emerald-400',
                        subText: mockApplications.length > 0 ? `(${Math.round((mockApplications.filter(a => a.status === 'accepted').length / mockApplications.length) * 100)}% Success Rate)` : ''
                    },
                ].map(({ label, val, color, subText }) => (
                    <div key={label} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-4 text-center shadow-sm">
                        <div className={`text-2xl font-black flex items-center justify-center gap-1 ${color}`}>
                            {val}
                            {subText && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded-full">{subText}</span>}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</div>
                    </div>
                ))}
            </div>

            <SearchFilter onSearch={setSearch} onFilterChange={setFilters} />

            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-1 shadow-sm">
                <Table columns={columns} data={paginated} emptyMessage={t('common.no_data')} />
            </div>

            <Pagination currentPage={page} totalPages={Math.ceil(filtered.length / PER_PAGE)} onPageChange={setPage} />
        </div>
    );
}
