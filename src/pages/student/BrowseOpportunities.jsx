import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, DollarSign, Clock, Users, Calendar, Bookmark, Send, ExternalLink } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import SearchFilter from '../../components/common/SearchFilter';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { mockOpportunities } from '../../utils/mockData';
import clsx from 'clsx';

export default function BrowseOpportunities() {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const [saved, setSaved] = useState(new Set());
    const [applyModal, setApplyModal] = useState(null);
    const [applied, setApplied] = useState(new Set());
    const [viewModal, setViewModal] = useState(null);
    const PER_PAGE = 4;

    const filtered = mockOpportunities.filter((o) => {
        if (search && !o.position.toLowerCase().includes(search.toLowerCase()) && !o.company.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const toggleSave = (id) => {
        setSaved((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleApply = () => {
        if (applyModal) {
            setApplied((prev) => new Set([...prev, applyModal.id]));
            setApplyModal(null);
        }
    };

    return (
        <div className="space-y-6 page-enter">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">Browse Opportunities</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {filtered.length} internship and freelance opportunities available
                </p>
            </div>

            {/* Quick type filter */}
            <div className="flex gap-2 flex-wrap">
                {['All', 'Internship', 'Freelance', 'Remote'].map((label) => (
                    <button key={label}
                        className={clsx(
                            'px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 border',
                            label === 'All'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
                        )}>
                        {label}
                    </button>
                ))}
            </div>

            <SearchFilter onSearch={setSearch} onFilterChange={setFilters} />

            {/* Opportunity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginated.map((opp) => {
                    const isSaved = saved.has(opp.id);
                    const isApplied = applied.has(opp.id);
                    return (
                        <div key={opp.id}
                            className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-5 shadow-sm hover:shadow-lg dark:hover:shadow-gray-900/50 hover:-translate-y-0.5 transition-all duration-200">
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-lg flex-shrink-0">
                                        {opp.company[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{opp.position}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{opp.company}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <button onClick={() => toggleSave(opp.id)}
                                        className={clsx('p-1.5 rounded-lg transition-colors', isSaved ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700')}>
                                        <Bookmark size={16} className={isSaved ? 'fill-current' : ''} />
                                    </button>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{opp.description}</p>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {opp.skills.map((s) => (
                                    <span key={s} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">{s}</span>
                                ))}
                            </div>

                            {/* Meta info */}
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-4 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-1.5"><MapPin size={12} className="text-gray-400" />{opp.location}</div>
                                <div className="flex items-center gap-1.5"><DollarSign size={12} className="text-gray-400" />{opp.stipend}</div>
                                <div className="flex items-center gap-1.5"><Clock size={12} className="text-gray-400" />{opp.duration}</div>
                                <div className="flex items-center gap-1.5"><Calendar size={12} className="text-gray-400" />{opp.deadline}</div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700/60">
                                <div className="flex items-center gap-3">
                                    <Badge variant={opp.type === 'internship' ? 'info' : 'purple'}>{t(`opportunity.${opp.type}`)}</Badge>
                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                        <Users size={11} /> {opp.applicants}
                                    </span>
                                    <span className="text-xs text-gray-400">{opp.posted}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setViewModal(opp)}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        <ExternalLink size={14} />
                                    </button>
                                    {isApplied ? (
                                        <Badge variant="accepted" dot>Applied</Badge>
                                    ) : (
                                        <button onClick={() => setApplyModal(opp)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200">
                                            <Send size={12} /> Apply
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Pagination currentPage={page} totalPages={Math.ceil(filtered.length / PER_PAGE)} onPageChange={setPage} />

            {/* Quick Apply Modal */}
            <Modal isOpen={!!applyModal} onClose={() => setApplyModal(null)}
                title={`Apply: ${applyModal?.position}`} size="md"
                footer={<>
                    <Button variant="secondary" onClick={() => setApplyModal(null)}>{t('common.cancel')}</Button>
                    <Button variant="gradient" icon={Send} onClick={handleApply}>Submit Application</Button>
                </>}>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {applyModal?.company?.[0]}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{applyModal?.position}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{applyModal?.company} · {applyModal?.location}</p>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Cover Letter (Optional)</label>
                        <textarea rows={4} placeholder="Tell the recruiter why you're a great fit..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-xs text-gray-600 dark:text-gray-400">
                        Your profile, CV, and skills will be automatically attached to this application.
                    </div>
                </div>
            </Modal>

            {/* View Details Modal */}
            <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)}
                title={viewModal?.position} size="lg"
                footer={<>
                    <Button variant="secondary" onClick={() => setViewModal(null)}>Close</Button>
                    {!applied.has(viewModal?.id) && (
                        <Button variant="gradient" icon={Send} onClick={() => { setApplyModal(viewModal); setViewModal(null); }}>Apply Now</Button>
                    )}
                </>}>
                {viewModal && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xl">{viewModal.company[0]}</div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{viewModal.position}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{viewModal.company}</p>
                            </div>
                            <Badge variant={viewModal.type === 'internship' ? 'info' : 'purple'} className="ml-auto">{viewModal.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{viewModal.description}</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {[['Location', viewModal.location, MapPin], ['Stipend', viewModal.stipend, DollarSign], ['Duration', viewModal.duration, Clock], ['Deadline', viewModal.deadline, Calendar]].map(([label, val, Icon]) => (
                                <div key={label} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1"><Icon size={12} />{label}</div>
                                    <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{val}</div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Required Skills</p>
                            <div className="flex flex-wrap gap-2">
                                {viewModal.skills.map(s => <span key={s} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-medium">{s}</span>)}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Users size={12} /><span>{viewModal.applicants} applicants</span>
                            <span>·</span><span>Posted {viewModal.posted}</span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
