import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Briefcase,
  Clock3,
  DollarSign,
  MapPin,
  Search,
  Share2,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { fetchOpportunities } from '../../features/opportunities/opportunitySlice';
import { setPendingJobIntent } from '../../utils/jobIntent';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { Filter, X as CloseIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FILTERS = {
  jobType: ['Volunteer', 'Paid Intern', 'Unpaid Intern'],
  jobSite: ['On-site', 'Remote', 'Hybrid'],
  experienceLevel: ['Entry Level', 'Junior', 'Intermediate', 'Senior', 'Expert'],
};

const formatDate = (value) => {
  if (!value) return 'Not specified';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not specified';
  return date.toLocaleDateString();
};

const timeAgo = (value) => {
  if (!value) return 'Recently posted';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently posted';
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
};

const getExperienceLevel = (job) => {
  const text = `${job?.description || ''} ${job?.position || ''}`.toLowerCase();
  if (text.includes('expert')) return 'Expert';
  if (text.includes('senior')) return 'Senior';
  if (text.includes('intermediate') || text.includes('mid-level')) return 'Intermediate';
  if (text.includes('junior')) return 'Junior';
  return 'Entry Level';
};

const getJobSite = (job) => {
  const value = `${job?.location || ''}`.toLowerCase();
  if (value.includes('remote')) return 'Remote';
  if (value.includes('hybrid')) return 'Hybrid';
  return 'On-site';
};

const getJobType = (job) => {
  const text = `${job?.type || ''} ${job?.description || ''}`.toLowerCase();
  if (text.includes('volunteer')) return 'Volunteer';
  if (job?.type === 'internship' && !job?.stipend) return 'Unpaid Intern';
  return 'Paid Intern';
};

const getSalaryText = (job) => {
  if (job?.stipend) return job.stipend;
  return getJobType(job) === 'Volunteer' ? 'Volunteer' : 'Not disclosed';
};

export default function ExploreJobsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: jobs, loading } = useSelector((state) => state.opportunities);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    jobType: new Set(),
    jobSite: new Set(),
    experienceLevel: new Set(),
  });
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [selectedJob, setSelectedJob] = useState(null);
  const [authPrompt, setAuthPrompt] = useState({ open: false, action: 'view details' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOpportunities({ keyword: '', type: '' }));
  }, [dispatch]);

  const filteredJobs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return jobs.filter((job) => {
      const title = `${job?.position || ''}`.toLowerCase();
      const company = `${job?.company || ''}`.toLowerCase();
      const description = `${job?.description || ''}`.toLowerCase();
      const skills = Array.isArray(job?.skills) ? job.skills.join(' ').toLowerCase() : '';
      const matchesSearch =
        !query ||
        title.includes(query) ||
        company.includes(query) ||
        description.includes(query) ||
        skills.includes(query);

      if (!matchesSearch) return false;

      const computed = {
        jobType: getJobType(job),
        jobSite: getJobSite(job),
        experienceLevel: getExperienceLevel(job),
      };

      return Object.entries(selectedFilters).every(([key, values]) => {
        if (values.size === 0) return true;
        return values.has(computed[key]);
      });
    });
  }, [jobs, searchTerm, selectedFilters]);

  const toggleFilter = (group, value) => {
    setSelectedFilters((prev) => {
      const next = {
        ...prev,
        [group]: new Set(prev[group]),
      };
      if (next[group].has(value)) {
        next[group].delete(value);
      } else {
        next[group].add(value);
      }
      return next;
    });
  };

  const toggleExpanded = (jobId) => {
    setExpandedDescriptions((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  };

  const toggleSaved = (jobId) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  };

  const handleShare = async (job) => {
    const shareText = `${job.position} at ${job.company}`;
    const shareUrl = `${window.location.origin}/explore-jobs`;
    try {
      if (navigator.share) {
        await navigator.share({ title: shareText, text: shareText, url: shareUrl });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${shareText} - ${shareUrl}`);
      }
    } catch {
      // Ignore share cancellation/failures to keep UI clean.
    }
  };

  const openAuthPrompt = (action, job) => {
    setPendingJobIntent({ jobId: job?._id, action });
    setAuthPrompt({ open: true, action });
  };

  const handleViewDetails = (job) => {
    if (!isAuthenticated) {
      openAuthPrompt('view', job);
      return;
    }
    setSelectedJob(job);
  };

  const handleApply = (job) => {
    if (!isAuthenticated) {
      openAuthPrompt('apply', job);
      return;
    }
    navigate('/student/browse', { state: { openApplyId: job._id } });
  };

  const renderDescription = (job) => {
    const text = job?.description || 'No description provided yet.';
    const expanded = expandedDescriptions.has(job._id);
    if (text.length <= 150 || expanded) return text;
    return `${text.slice(0, 150)}...`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <PublicNavbar />
      
      <div className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
            <section className="space-y-5">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      Explore Jobs
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Browse all opportunities. You can search and filter before signing in.
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm"
                  >
                    <Filter size={16} /> Filters
                  </button>
                </div>

                <label className="relative block">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, company, skill, or keyword..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </label>
              </div>

            {loading && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-slate-500 dark:text-slate-400">
                Loading jobs...
              </div>
            )}

            {!loading && filteredJobs.length === 0 && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-slate-500 dark:text-slate-400">
                No jobs matched your current search and filters.
              </div>
            )}

            <div className="space-y-4">
              {!loading &&
                filteredJobs.map((job) => {
                  const isSaved = savedJobs.has(job._id);
                  const computedType = getJobType(job);
                  const computedSite = getJobSite(job);
                  const computedExperience = getExperienceLevel(job);
                  const descriptionExpanded = expandedDescriptions.has(job._id);
                  return (
                    <article
                      key={job._id}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            {job.position}
                          </h2>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {job.company}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleShare(job)}
                            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            <Share2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleSaved(job._id)}
                            className={clsx(
                              'p-2 rounded-lg border border-slate-200 dark:border-slate-700',
                              isSaved
                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                                : 'text-slate-500 hover:text-blue-600 dark:hover:text-blue-400'
                            )}
                          >
                            <Bookmark size={16} className={isSaved ? 'fill-current' : ''} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} />
                          {job.location || 'Location not specified'}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 size={13} />
                          {timeAgo(job.createdAt)}
                        </span>
                      </div>

                      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {renderDescription(job)}
                        {job?.description?.length > 150 && (
                          <button
                            type="button"
                            onClick={() => toggleExpanded(job._id)}
                            className="ml-2 text-blue-600 dark:text-blue-400 font-semibold"
                          >
                            {descriptionExpanded ? 'Show Less' : 'Show More'}
                          </button>
                        )}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {(job.skills || []).map((skill) => (
                          <span
                            key={`${job._id}-${skill}`}
                            className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 text-xs">
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-slate-600 dark:text-slate-300">
                          <span className="text-slate-400 dark:text-slate-500">Salary</span>
                          <div className="font-semibold flex items-center gap-1 mt-0.5">
                            <DollarSign size={13} />
                            {getSalaryText(job)}
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-slate-600 dark:text-slate-300">
                          <span className="text-slate-400 dark:text-slate-500">Experience</span>
                          <div className="font-semibold mt-0.5">{computedExperience}</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-slate-600 dark:text-slate-300">
                          <span className="text-slate-400 dark:text-slate-500">Job Type</span>
                          <div className="font-semibold mt-0.5">{computedType}</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-slate-600 dark:text-slate-300">
                          <span className="text-slate-400 dark:text-slate-500">Job Site</span>
                          <div className="font-semibold mt-0.5">{computedSite}</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-slate-600 dark:text-slate-300">
                          <span className="text-slate-400 dark:text-slate-500">Deadline</span>
                          <div className="font-semibold mt-0.5">{formatDate(job.deadline)}</div>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                        <span className="text-xs inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Sparkles size={13} />
                          {job.status === 'open' ? 'Accepting applications' : 'Applications closed'}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={Briefcase}
                            onClick={() => handleViewDetails(job)}
                          >
                            View Details
                          </Button>
                          <Button size="sm" onClick={() => handleApply(job)}>
                            Apply
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          </section>

          <aside className="hidden lg:block lg:sticky lg:top-28">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Filter Jobs</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
                Refine listings with quick checkboxes.
              </p>

              <div className="space-y-6">
                {Object.entries(FILTERS).map(([group, values]) => (
                  <div key={group}>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">
                      {group === 'jobType'
                        ? 'Job Type'
                        : group === 'jobSite'
                          ? 'Job Site'
                          : 'Experience Level'}
                    </p>
                    <div className="space-y-2.5">
                      {values.map((value) => (
                        <label
                          key={value}
                          className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFilters[group].has(value)}
                            onChange={() => toggleFilter(group, value)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{value}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white dark:bg-slate-900 z-[70] shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Filters</h3>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                  >
                    <CloseIcon size={24} />
                  </button>
                </div>

                <div className="space-y-8">
                  {Object.entries(FILTERS).map(([group, values]) => (
                    <div key={group}>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">
                        {group === 'jobType'
                          ? 'Job Type'
                          : group === 'jobSite'
                            ? 'Job Site'
                            : 'Experience Level'}
                      </p>
                      <div className="space-y-3.5">
                        {values.map((value) => (
                          <label
                            key={value}
                            className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFilters[group].has(value)}
                              onChange={() => toggleFilter(group, value)}
                              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            {value}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-10">
                  <Button className="w-full" onClick={() => setIsFilterOpen(false)}>
                    Show Results
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <PublicFooter />
    </div>

      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob?.position || 'Job Details'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedJob(null)}>
              Close
            </Button>
            {selectedJob && <Button onClick={() => handleApply(selectedJob)}>Apply Now</Button>}
          </>
        }
      >
        {selectedJob && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedJob.company}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {selectedJob.location || 'Location not specified'} . Posted {timeAgo(selectedJob.createdAt)}
              </p>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedJob.description || 'No description provided yet.'}
            </p>
            <div className="flex flex-wrap gap-2">
              {(selectedJob.skills || []).map((skill) => (
                <span
                  key={`${selectedJob._id}-detail-${skill}`}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                <span className="text-slate-400 dark:text-slate-500">Salary</span>
                <div className="font-semibold mt-0.5">{getSalaryText(selectedJob)}</div>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                <span className="text-slate-400 dark:text-slate-500">Experience</span>
                <div className="font-semibold mt-0.5">{getExperienceLevel(selectedJob)}</div>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                <span className="text-slate-400 dark:text-slate-500">Job Type</span>
                <div className="font-semibold mt-0.5">{getJobType(selectedJob)}</div>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                <span className="text-slate-400 dark:text-slate-500">Deadline</span>
                <div className="font-semibold mt-0.5">{formatDate(selectedJob.deadline)}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={authPrompt.open}
        onClose={() => setAuthPrompt({ open: false, action: 'view details' })}
        title="Login Required"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setAuthPrompt({ open: false, action: 'view details' })}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setAuthPrompt({ open: false, action: 'view details' });
                navigate('/register');
              }}
            >
              Create Account
            </Button>
            <Button
              onClick={() => {
                setAuthPrompt({ open: false, action: 'view details' });
                navigate('/login');
              }}
            >
              Log In
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Please log in or create an account to {authPrompt.action}.
        </p>
      </Modal>
    </div>
  );
}
