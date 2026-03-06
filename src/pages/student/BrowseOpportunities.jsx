import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, DollarSign, Clock, Users, Calendar, Bookmark, Send, ExternalLink, RefreshCw, Sparkles } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import SearchFilter from '../../components/common/SearchFilter';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { fetchOpportunities } from '../../features/opportunities/opportunitySlice';
import { applyForJob } from '../../features/applications/applicationSlice';
import clsx from 'clsx';

export default function BrowseOpportunities() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { items: opportunities, loading, error } = useSelector(state => state.opportunities);
    const { loading: applyLoading } = useSelector(state => state.applications);
    const { user } = useSelector(state => state.auth);

    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState('Newest');
    const [typeFilter, setTypeFilter] = useState('All');
    const [page, setPage] = useState(1);
    const [saved, setSaved] = useState(new Set());
    const [applyModal, setApplyModal] = useState(null);
    const [applied, setApplied] = useState(new Set());
    const [viewModal, setViewModal] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const PER_PAGE = 4;

    // Local deterministic skill-based match between a job and the current student
    const computeSkillMatch = (jobSkills = [], studentSkills = []) => {
        const normalize = (s) =>
            s
                .toString()
                .toLowerCase()
                .trim()
                .replace(/[()]/g, ' ')
                .replace(/[\s]+/g, ' ')
                .replace(/[.+]/g, '.');

        const alias = new Map([
            ['js', 'javascript'],
            ['java script', 'javascript'],
            ['ts', 'typescript'],
            ['node', 'node.js'],
            ['nodejs', 'node.js'],
            ['reactjs', 'react'],
            ['nextjs', 'next.js'],
            ['expressjs', 'express'],
            ['mongo', 'mongodb'],
            ['postgres', 'postgresql'],
            ['py', 'python'],
            ['c sharp', 'c#'],
            ['dotnet', '.net'],
        ]);

        const splitSkillString = (value) => {
            const str = normalize(value);
            return str
                .split(/[,/|]/g)
                .map((t) => t.trim())
                .filter(Boolean);
        };

        const canonicalize = (raw) => {
            const n = normalize(raw);
            return alias.get(n) || n;
        };

        const rawJob = Array.isArray(jobSkills) ? jobSkills : [];
        const rawStudent = Array.isArray(studentSkills) ? studentSkills : [];

        const jobTokens = rawJob.flatMap(splitSkillString).map(canonicalize).filter(Boolean);
        const studentTokens = rawStudent.flatMap(splitSkillString).map(canonicalize).filter(Boolean);

        if (jobTokens.length === 0 || studentTokens.length === 0) {
            return null;
        }

        const studentSet = new Set(studentTokens);
        const isMatched = (jobSkill) => {
            if (studentSet.has(jobSkill)) return true;
            for (const s of studentSet) {
                if (!s || !jobSkill) continue;
                if (s.includes(jobSkill) || jobSkill.includes(s)) return true;
            }
            return false;
        };

        const uniqueJob = [...new Set(jobTokens)];
        const matched = uniqueJob.filter(isMatched);
        const requiredCount = uniqueJob.length;
        const matchedCount = matched.length;
        const ratio = requiredCount === 0 ? 0 : matchedCount / requiredCount;
        return Math.round(ratio * 100);
    };

    useEffect(() => {
        dispatch(fetchOpportunities({ keyword: search, type: typeFilter }));
    }, [dispatch, search, typeFilter]);

    // When coming from "Browse all matches" (AI Recommends), default to Best Match sort
    useEffect(() => {
        if (location.state?.sortByBestMatch) {
            setSortBy('Best Match');
            setPage(1);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state?.sortByBestMatch, navigate, location.pathname]);

    // Open Apply modal when navigated from AI Recommends with a specific job id
    const openApplyId = location.state?.openApplyId;
    useEffect(() => {
        if (!openApplyId || loading || opportunities.length === 0) return;
        const opp = opportunities.find((o) => o._id === openApplyId);
        if (opp) {
            setApplyModal(opp);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [openApplyId, loading, opportunities, navigate, location.pathname]);

    // Enrich opportunities with skill-based matchScore for the current student
    const scored = opportunities.map((o) => ({
        ...o,
        matchScore: user ? computeSkillMatch(o.skills, user.skills || []) : null,
    }));

    // Local filter/sort on the fetched items
    const filtered = [...scored].filter((o) => {
        // Search API usually handles basic search, but this double-filters just in case
        if (search && !o.position.toLowerCase().includes(search.toLowerCase()) && !o.company.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    }).sort((a, b) => {
        if (sortBy === 'Highest Stipend') {
            const getVal = (s) => parseInt(s.replace(/\D/g, '')) || 0;
            return getVal(b.stipend) - getVal(a.stipend);
        }
        if (sortBy === 'Best Match') {
            const getScore = (o) => (typeof o.matchScore === 'number' ? o.matchScore : -1);
            return getScore(b) - getScore(a);
        }
        return 0; // Newest (default order from backend)
    });

    // Best match among the currently filtered list, for highlighting
    const bestScore = filtered.reduce(
        (max, o) => (typeof o.matchScore === 'number' && o.matchScore > max ? o.matchScore : max),
        -1
    );

    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const toggleSave = (id) => {
        setSaved((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleApply = async () => {
        if (applyModal) {
            try {
                // Dispatch real application to backend
                await dispatch(applyForJob({
                    opportunityId: applyModal._id,
                    data: { coverLetter, resumeUrl: '' }
                })).unwrap();

                // Track locally
                setApplied((prev) => new Set([...prev, applyModal._id]));
                setApplyModal(null);
                setCoverLetter(''); // Reset form
            } catch (err) {
                alert('Failed to apply. You may have already applied to this job.');
            }
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

            {/* Quick type filter & Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-2 flex-wrap">
                    {['All', 'Internship', 'Freelance', 'Full-time', 'Part-time'].map((label) => (
                        <button key={label}
                            onClick={() => setTypeFilter(label)}
                            className={clsx(
                                'px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 border',
                                label === typeFilter
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
                            )}>
                            {label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block px-3 py-1.5 cursor-pointer outline-none"
                    >
                        <option>Newest</option>
                        <option>Best Match</option>
                        <option>Highest Stipend</option>
                    </select>
                </div>
            </div>

            <SearchFilter onSearch={setSearch} onFilterChange={setFilters} />

            {/* Opportunity Cards */}
            {loading && <div className="text-center py-10 text-gray-400 font-medium">Loading opportunities...</div>}
            {!loading && paginated.length === 0 && <div className="text-center py-10 text-gray-400 font-medium">No open opportunities found.</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!loading && paginated.map((opp) => {
                    const isSaved = saved.has(opp._id);
                    const isApplied = applied.has(opp._id);
                    return (
                        <div key={opp._id}
                            className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-5 shadow-sm hover:shadow-lg dark:hover:shadow-gray-900/50 hover:-translate-y-0.5 transition-all duration-200">
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-3 mb-3">
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
                                    <button onClick={() => toggleSave(opp._id)}
                                        className={clsx('p-1.5 rounded-lg transition-colors', isSaved ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700')}>
                                        <Bookmark size={16} className={isSaved ? 'fill-current' : ''} />
                                    </button>
                                </div>
                            </div>

                            {/* AI match pill (before applying) */}
                            {typeof opp.matchScore === 'number' && (
                                <div className="mb-3">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                                        <span>{opp.matchScore}% match</span>
                                        {opp.matchScore === bestScore && bestScore >= 0 && (
                                            <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                                                <Sparkles size={12} />
                                                Best for you
                                            </span>
                                        )}
                                    </span>
                                </div>
                            )}

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
                                    <Badge variant={opp.type === 'internship' ? 'info' : 'purple'}>{opp.type}</Badge>
                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                        <Users size={11} /> {opp.applicantsCount || 0}
                                    </span>
                                    <span className="text-xs text-gray-400">{new Date(opp.createdAt).toLocaleDateString()}</span>
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
                    <Button variant="gradient" icon={Send} onClick={handleApply} disabled={applyLoading}>
                        {applyLoading ? 'Submitting...' : 'Submit Application'}
                    </Button>
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
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
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
                    {!applied.has(viewModal?._id) && (
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
                            <Users size={12} /><span>{viewModal.applicantsCount || 0} applicants</span>
                            <span>·</span><span>Posted {new Date(viewModal.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
