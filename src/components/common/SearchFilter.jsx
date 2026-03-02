import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
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

                {/* Sort */}
                <select
                    value={filters.sort}
                    onChange={(e) => handleFilter('sort', e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="newest">{t('common.newest')}</option>
                    <option value="best_match">{t('common.best_match')}</option>
                    <option value="highest_stipend">{t('common.highest_stipend')}</option>
                </select>

                <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className={clsx(
                        'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200',
                        filtersOpen || activeCount > 0
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
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
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 animate-fade-in-up">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Skill */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">{t('search.skill_filter')}</label>
                            <select
                                value={filters.skill}
                                onChange={(e) => handleFilter('skill', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Skills</option>
                                {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">{t('search.duration_filter')}</label>
                            <select
                                value={filters.duration}
                                onChange={(e) => handleFilter('duration', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Any Duration</option>
                                {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">{t('search.location_filter')}</label>
                            <select
                                value={filters.location}
                                onChange={(e) => handleFilter('location', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Any Location</option>
                                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>

                        {/* Stipend Range */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">{t('search.stipend_range')}</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.stipendMin}
                                    onChange={(e) => handleFilter('stipendMin', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.stipendMax}
                                    onChange={(e) => handleFilter('stipendMax', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {activeCount > 0 && (
                        <button onClick={clearFilters} className="mt-3 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors">
                            <X size={14} /> Clear all filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
