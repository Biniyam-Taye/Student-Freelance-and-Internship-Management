import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon, SlidersHorizontal, X, ChevronDown, Check } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import clsx from 'clsx';

const SKILLS = ['React', 'Python', 'JavaScript', 'TypeScript', 'Figma', 'Node.js', 'Flutter', 'Machine Learning', 'Java', 'SQL'];
const DURATIONS = ['1 month', '2 months', '3 months', '4-6 months', '6+ months'];
const LOCATIONS = ['Addis Ababa', 'Remote', 'Hybrid', 'Jimma', 'Hawassa', 'Bahir Dar'];

export default function SearchFilter({ onSearch, onFilterChange }) {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filters, setFilters] = useState({ skill: '', duration: '', location: '', sort: 'newest', stipendMin: '', stipendMax: '' });

    const handleSearch = (e) => {
        const val = e.target.value;
        setQuery(val);
        onSearch?.(val);
    };

    const handleFilter = (key, val) => {
        const updated = { ...filters, [key]: val };
        setFilters(updated);
        onFilterChange?.(updated);
    };

    const clearFilters = () => {
        const reset = { skill: '', duration: '', location: '', sort: 'newest', stipendMin: '', stipendMax: '' };
        setFilters(reset);
        onFilterChange?.(reset);
    };

    const activeCount = Object.values(filters).filter(v => v && v !== 'newest').length;

    const sortOptions = [
        { value: 'newest', label: t('common.newest') },
        { value: 'best_match', label: t('common.best_match') },
        { value: 'highest_stipend', label: t('common.highest_stipend') }
    ];

    const currentSortLabel = sortOptions.find(o => o.value === filters.sort)?.label || t('common.newest');

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearch}
                        placeholder={t('search.placeholder')}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                    />
                </div>

                {/* Sort Dropdown */}
                <Dropdown
                    trigger={
                        <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer whitespace-nowrap min-w-[140px] justify-between">
                            {currentSortLabel}
                            <ChevronDown size={15} className="text-gray-400" />
                        </div>
                    }
                >
                    {sortOptions.map((opt) => (
                        <DropdownItem
                            key={opt.value}
                            onClick={() => handleFilter('sort', opt.value)}
                            icon={filters.sort === opt.value ? Check : null}
                        >
                            <span className={clsx(filters.sort === opt.value && "font-bold text-blue-600 dark:text-blue-400")}>
                                {opt.label}
                            </span>
                        </DropdownItem>
                    ))}
                </Dropdown>

                <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className={clsx(
                        'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200',
                        filtersOpen || activeCount > 0
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    )}
                >
                    <SlidersHorizontal size={15} />
                    {t('common.filter')}
                    {activeCount > 0 && (
                        <span className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center text-xs font-bold">{activeCount}</span>
                    )}
                </button>
            </div>

            {filtersOpen && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm animate-fade-in-up">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Skill Filter */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider block ml-1">{t('search.skill_filter')}</label>
                            <Dropdown
                                className="w-full"
                                trigger={
                                    <div className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer">
                                        <span className="truncate">{filters.skill || 'All Skills'}</span>
                                        <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
                                    </div>
                                }
                            >
                                <DropdownItem onClick={() => handleFilter('skill', '')} icon={!filters.skill ? Check : null}>All Skills</DropdownItem>
                                {SKILLS.map(s => (
                                    <DropdownItem key={s} onClick={() => handleFilter('skill', s)} icon={filters.skill === s ? Check : null}>
                                        <span className={clsx(filters.skill === s && "font-bold text-blue-600")}>{s}</span>
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>

                        {/* Duration Filter */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider block ml-1">{t('search.duration_filter')}</label>
                            <Dropdown
                                className="w-full"
                                trigger={
                                    <div className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer">
                                        <span className="truncate">{filters.duration || 'Any Duration'}</span>
                                        <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
                                    </div>
                                }
                            >
                                <DropdownItem onClick={() => handleFilter('duration', '')} icon={!filters.duration ? Check : null}>Any Duration</DropdownItem>
                                {DURATIONS.map(d => (
                                    <DropdownItem key={d} onClick={() => handleFilter('duration', d)} icon={filters.duration === d ? Check : null}>
                                        <span className={clsx(filters.duration === d && "font-bold text-blue-600")}>{d}</span>
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>

                        {/* Location Filter */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider block ml-1">{t('search.location_filter')}</label>
                            <Dropdown
                                className="w-full"
                                trigger={
                                    <div className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer">
                                        <span className="truncate">{filters.location || 'Any Location'}</span>
                                        <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
                                    </div>
                                }
                            >
                                <DropdownItem onClick={() => handleFilter('location', '')} icon={!filters.location ? Check : null}>Any Location</DropdownItem>
                                {LOCATIONS.map(l => (
                                    <DropdownItem key={l} onClick={() => handleFilter('location', l)} icon={filters.location === l ? Check : null}>
                                        <span className={clsx(filters.location === l && "font-bold text-blue-600")}>{l}</span>
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>

                        {/* Stipend Range */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider block ml-1">{t('search.stipend_range')}</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.stipendMin}
                                    onChange={(e) => handleFilter('stipendMin', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.stipendMax}
                                    onChange={(e) => handleFilter('stipendMax', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {activeCount > 0 && (
                        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
                            <p className="text-[11px] text-gray-400 font-medium">Clear filters to see all results</p>
                            <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-bold">
                                <X size={14} /> Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
