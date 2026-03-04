import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, DollarSign, Clock, Users, Calendar, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import SearchFilter from '../../components/common/SearchFilter';
import Dropdown, { DropdownItem } from '../../components/ui/Dropdown';
import { fetchOpportunities, deleteOpportunity } from '../../features/opportunities/opportunitySlice';
import clsx from 'clsx';

export default function MyPosts() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { items: allPosts, loading } = useSelector(state => state.opportunities);
    const { user } = useSelector(state => state.auth);
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(fetchOpportunities());
    }, [dispatch]);

    // Local filter by this recruiter's ID, plus search
    const filtered = allPosts.filter(p => {
        const isMine = p.recruiter?._id === user?._id || p.recruiter === user?._id;
        if (!isMine) return false;

        if (search) {
            const matchTitle = p.position?.toLowerCase().includes(search.toLowerCase());
            const matchCompany = p.company?.toLowerCase().includes(search.toLowerCase());
            return matchTitle || matchCompany;
        }
        return true;
    });

    const removePost = (id) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            dispatch(deleteOpportunity(id));
        }
    };

    return (
        <div className="space-y-6 page-enter">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('dashboard.my_posts')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{filtered.length} opportunities posted</p>
                </div>
                <a href="/recruiter/post" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all w-fit">
                    + Post New
                </a>
            </div>

            <SearchFilter onSearch={setSearch} />

            {loading && <div className="text-gray-500 py-10 text-center font-medium">Fetching your posts...</div>}
            {!loading && filtered.length === 0 && <div className="text-gray-500 py-10 text-center font-medium">No posts found. Create one!</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {!loading && filtered.map((opp) => (
                    <div key={opp._id} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-5 shadow-sm hover:shadow-lg dark:hover:shadow-gray-900/50 card-hover">
                        <div className="flex items-start justify-between gap-2 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400 font-bold text-sm">
                                    {opp.company?.[0] || 'C'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug">{opp.position}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{opp.company}</p>
                                </div>
                            </div>
                            <Dropdown align="right" trigger={
                                <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors">
                                    <MoreVertical size={15} />
                                </button>
                            }>
                                <DropdownItem icon={Edit}>Edit Post</DropdownItem>
                                <DropdownItem icon={Eye}>View Details</DropdownItem>
                                <DropdownItem icon={Trash2} danger onClick={() => removePost(opp._id)}>Delete</DropdownItem>
                            </Dropdown>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {opp.skills?.slice(0, 3).map(s => (
                                <span key={s} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">{s}</span>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1"><MapPin size={11} />{opp.location}</div>
                            <div className="flex items-center gap-1"><DollarSign size={11} />{opp.stipend}</div>
                            <div className="flex items-center gap-1"><Clock size={11} />{opp.duration}</div>
                            <div className="flex items-center gap-1"><Calendar size={11} />{new Date(opp.deadline).toLocaleDateString()}</div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700/60">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <Users size={13} />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">{opp.applicantsCount || 0}</span> applicants
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={opp.type === 'internship' ? 'info' : 'purple'}>{opp.type}</Badge>
                                <Badge variant={opp.status === 'open' ? 'active' : 'warning'} dot>{opp.status}</Badge>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
