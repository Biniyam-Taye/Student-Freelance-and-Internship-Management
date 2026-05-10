import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, DollarSign, Clock, Users, Calendar, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import SearchFilter from '../../components/common/SearchFilter';
import Dropdown, { DropdownItem } from '../../components/ui/Dropdown';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { fetchOpportunities, deleteOpportunity, updateOpportunity } from '../../features/opportunities/opportunitySlice';
import clsx from 'clsx';

export default function MyPosts() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { items: allPosts, loading } = useSelector(state => state.opportunities);
    const { user } = useSelector(state => state.auth);
    const [search, setSearch] = useState('');
    const [editingPost, setEditingPost] = useState(null);
    const [savingEdit, setSavingEdit] = useState(false);
    const [editForm, setEditForm] = useState({
        position: '',
        description: '',
        location: '',
        stipend: '',
        duration: '',
        deadline: '',
        type: 'internship',
        category: '',
        skills: '',
        status: 'open',
    });

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

    const openEdit = (opp) => {
        setEditingPost(opp);
        setEditForm({
            position: opp.position || '',
            description: opp.description || '',
            location: opp.location || '',
            stipend: opp.stipend || '',
            duration: opp.duration || '',
            deadline: opp.deadline ? new Date(opp.deadline).toISOString().split('T')[0] : '',
            type: opp.type || 'internship',
            category: opp.category || '',
            skills: Array.isArray(opp.skills) ? opp.skills.join(', ') : '',
            status: opp.status || 'open',
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const saveEdit = async () => {
        if (!editingPost) return;
        if (!editForm.position.trim() || !editForm.description.trim() || !editForm.location.trim() || !editForm.deadline) {
            alert('Please fill all required fields: title, description, location, and deadline.');
            return;
        }

        setSavingEdit(true);
        try {
            await dispatch(updateOpportunity({
                id: editingPost._id,
                data: {
                    position: editForm.position.trim(),
                    description: editForm.description.trim(),
                    location: editForm.location.trim(),
                    stipend: editForm.stipend.trim(),
                    duration: editForm.duration.trim(),
                    deadline: editForm.deadline,
                    type: editForm.type,
                    category: editForm.category.trim(),
                    status: editForm.status,
                    skills: editForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
                },
            })).unwrap();
            setEditingPost(null);
        } catch (err) {
            alert(err || 'Failed to update post');
        } finally {
            setSavingEdit(false);
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
                                <DropdownItem icon={Edit} onClick={() => openEdit(opp)}>Edit Post</DropdownItem>
                                <DropdownItem icon={Eye}>View Details</DropdownItem>
                                <DropdownItem icon={Trash2} danger onClick={() => removePost(opp._id)}>Delete</DropdownItem>
                            </Dropdown>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                            {opp.category && (
                                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium rounded-md text-[11px] uppercase tracking-wider border border-blue-200 dark:border-blue-800 border-opacity-50">
                                    {opp.category}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {opp.skills?.slice(0, 3).map(s => (
                                <span key={s} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-[11px]">{s}</span>
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

            <Modal
                isOpen={!!editingPost}
                onClose={() => setEditingPost(null)}
                title="Edit Opportunity"
                size="lg"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setEditingPost(null)}>Cancel</Button>
                        <Button onClick={saveEdit} loading={savingEdit}>Save Changes</Button>
                    </>
                }
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Title *</label>
                        <input name="position" value={editForm.position} onChange={handleEditChange} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Description *</label>
                        <textarea name="description" value={editForm.description} onChange={handleEditChange} rows={4} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none" />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Location *</label>
                        <input name="location" value={editForm.location} onChange={handleEditChange} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Deadline *</label>
                        <input type="date" name="deadline" value={editForm.deadline} onChange={handleEditChange} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Type</label>
                        <select name="type" value={editForm.type} onChange={handleEditChange} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
                            <option value="internship">internship</option>
                            <option value="freelance">freelance</option>
                            <option value="part-time">part-time</option>
                            <option value="full-time">full-time</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Status</label>
                        <select name="status" value={editForm.status} onChange={handleEditChange} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
                            <option value="open">open</option>
                            <option value="closed">closed</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Stipend</label>
                        <input name="stipend" value={editForm.stipend} onChange={handleEditChange} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Duration</label>
                        <input name="duration" value={editForm.duration} onChange={handleEditChange} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Category</label>
                        <input name="category" value={editForm.category} onChange={handleEditChange} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Skills (comma separated)</label>
                        <input name="skills" value={editForm.skills} onChange={handleEditChange} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
