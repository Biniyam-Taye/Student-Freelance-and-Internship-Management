import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Eye, MapPin, Users, Clock } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import SearchFilter from '../../components/common/SearchFilter';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { fetchOpportunities, deleteOpportunity } from '../../features/opportunities/opportunitySlice';

export default function ManagePosts() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { items: posts, loading } = useSelector(state => state.opportunities);
    const [search, setSearch] = useState('');
    const [deleteModal, setDeleteModal] = useState(null);

    useEffect(() => {
        dispatch(fetchOpportunities());
    }, [dispatch]);

    const filtered = posts.filter(p => !search || p.position?.toLowerCase().includes(search.toLowerCase()) || p.company?.toLowerCase().includes(search.toLowerCase()));

    const deletePost = (id) => {
        dispatch(deleteOpportunity(id));
        setDeleteModal(null);
    };

    return (
        <div className="space-y-6 page-enter">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('dashboard.manage_posts')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{filtered.length} active posts on the platform</p>
            </div>

            <SearchFilter onSearch={setSearch} />

            <div className="space-y-3">
                {loading && <div className="text-gray-500 text-center py-10 font-medium">Loading posts...</div>}
                {!loading && filtered.length === 0 && <div className="text-gray-500 text-center py-10 font-medium">No active posts found.</div>}

                {!loading && filtered.map((post) => (
                    <div key={post._id} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-5 shadow-sm flex flex-col sm:flex-row items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold flex-shrink-0">
                            {post.company?.[0] || 'C'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{post.position}</h3>
                                <Badge variant={post.type === 'internship' ? 'info' : 'purple'}>{post.type}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{post.company}</p>
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1"><MapPin size={11} />{post.location}</span>
                                <span className="flex items-center gap-1"><Users size={11} />{post.applicantsCount || 0} applicants</span>
                                <span className="flex items-center gap-1"><Clock size={11} />Deadline: {new Date(post.deadline).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <Eye size={15} />
                            </button>
                            <button onClick={() => setDeleteModal(post)} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                <Trash2 size={15} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Post" size="sm"
                footer={<>
                    <Button variant="secondary" onClick={() => setDeleteModal(null)}>Cancel</Button>
                    <Button variant="danger" disabled={loading} onClick={() => deletePost(deleteModal?._id)}>Delete</Button>
                </>}>
                <div className="text-center py-2">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Trash2 size={22} className="text-red-500" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Are you sure you want to delete <strong>"{deleteModal?.position}"</strong> by {deleteModal?.company}? This cannot be undone.</p>
                </div>
            </Modal>
        </div>
    );
}
