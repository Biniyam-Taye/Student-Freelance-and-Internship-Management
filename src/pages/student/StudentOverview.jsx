import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
    Image as ImageIcon,
    Video,
    FileText,
    ThumbsUp,
    MessageSquare,
    Repeat,
    Send,
    MoreHorizontal,
    Bookmark,
    Users,
    Calendar,
    Briefcase,
    Plus,
    X,
    Sparkles
} from 'lucide-react';

export default function StudentOverview() {
    const { t } = useTranslation();
    const { user } = useSelector((s) => s.auth);

    // Mock Feed Posts
    const [posts] = useState([
        {
            id: 1,
            author: {
                name: 'Yetmgeta Redahegn',
                headline: 'Software Eng. Student @ASTU | Aspiring Backend Engineer | Building ...',
                avatar: 'https://ui-avatars.com/api/?name=Yetmgeta+Redahegn&background=random&color=fff',
            },
            time: '1m • 🌍',
            content: `🚀 Students & Creatives - Ready to Learn How to Make Money on Upwork?\n\nZulu Tech(@zulu-software) is opening unpaid internship opportunities for developers...`,
            likes: 24,
            comments: 5
        },
        {
            id: 2,
            author: {
                name: 'TechEthiopia',
                headline: 'Leading Tech Company in East Africa',
                avatar: 'https://ui-avatars.com/api/?name=Tech+Ethiopia&background=random&color=fff',
            },
            time: '2h • 🌍',
            content: `We're excited to announce our summer internship program! 🌟\n\nIf you're a student looking to gain practical experience in React, Node.js, and Cloud Computing, apply now through the platform.`,
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            likes: 156,
            comments: 42
        }
    ]);

    return (
        <div className="max-w-[1128px] mx-auto page-enter pt-2">
            <div className="grid grid-cols-1 md:grid-cols-[225px_1fr] lg:grid-cols-[225px_1fr_300px] gap-6">

                {/* Left Sidebar */}
                <div className="space-y-4 hidden md:block">
                    {/* Profile Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] overflow-visible">
                        {/* Banner */}
                        <div className="h-14 bg-[url('https://static.licdn.com/sc/h/5q92zj25macptill1tayvj6gq')] bg-cover bg-center rounded-t-xl"></div>

                        <div className="px-3 pb-4">
                            {/* Avatar — sits on top of the banner via negative margin */}
                            <div className="flex justify-center -mt-9 mb-2">
                                <div className="w-[72px] h-[72px] rounded-full border-2 border-white dark:border-gray-900 bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user?.name || 'User'} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 text-slate-600 flex items-center justify-center text-2xl font-semibold">
                                            {user?.name?.charAt(0) || 'B'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="text-center">
                                <h2 className="text-base font-bold text-gray-900 dark:text-white hover:underline cursor-pointer">
                                    {user?.name || 'Biniyam Taye'}
                                </h2>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 px-2">
                                    Full-Stack Software Engineer (MERN) | AI & Scalable Web ...
                                </p>
                                <p className="text-[11px] text-gray-500 mt-1">Ethiopia</p>

                                <div className="flex items-center justify-center gap-1.5 mt-3 text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    <img src="https://ui-avatars.com/api/?name=AMU&background=random" className="w-4 h-4 rounded" alt="AMU" />
                                    Arba Minch University
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-800 py-3">
                            <div className="px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-center transition-colors group">
                                <span className="text-xs text-gray-500 font-semibold group-hover:text-gray-600 dark:group-hover:text-gray-300">Profile viewers</span>
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">58</span>
                            </div>
                            <div className="px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-center transition-colors group">
                                <span className="text-xs text-gray-500 font-semibold group-hover:text-gray-600 dark:group-hover:text-gray-300">Post impressions</span>
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">90</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-800 py-2">
                            <div className="px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 font-semibold transition-colors">
                                <Bookmark size={14} className="text-gray-500 fill-gray-500" />
                                Saved items
                            </div>
                            <div className="px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 font-semibold transition-colors">
                                <Users size={14} className="text-gray-500 fill-gray-500" />
                                Groups
                            </div>
                            <div className="px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 font-semibold transition-colors">
                                <Calendar size={14} className="text-gray-500" />
                                Events
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Feed Column */}
                <div className="space-y-4">
                    {/* Create Post Container */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] p-3">
                        <div className="flex gap-2 mb-2">
                            <div className="w-[48px] h-[48px] rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-600 font-semibold overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0) || 'B'
                                )}
                            </div>
                            <button className="flex-1 text-left px-5 rounded-full border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-600 dark:text-gray-300 font-semibold">
                                Start a post
                            </button>
                        </div>
                        <div className="flex justify-around items-center pt-1">
                            <button className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors">
                                <Video size={24} className="text-[#378fe9] fill-[#378fe9]" />
                                <span>Video</span>
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors">
                                <ImageIcon size={24} className="text-[#5f9b41] fill-[#5f9b41]" />
                                <span>Photo</span>
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors">
                                <FileText size={24} className="text-[#e16745] fill-[#e16745]" />
                                <span>Write article</span>
                            </button>
                        </div>
                    </div>

                    <div className="relative flex items-center my-1">
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                        <span className="flex-shrink-0 mx-2 text-xs text-gray-500">Sort by: <strong className="text-gray-900 dark:text-gray-200 cursor-pointer">Top ▼</strong></span>
                    </div>

                    {/* Feed Posts */}
                    {posts.map(post => (
                        <div key={post.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden">
                            {/* Post Header */}
                            <div className="p-3 lg:p-4 flex gap-3 items-start">
                                <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full flex-shrink-0 object-cover" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm hover:text-blue-700 hover:underline cursor-pointer flex items-center gap-1">
                                                {post.author.name}
                                                <span className="text-gray-500 font-normal text-[13px] no-underline">• 1st</span>
                                            </h3>
                                            <p className="text-xs text-gray-500 text-[12px] truncate">{post.author.headline}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                {post.time}
                                            </p>
                                        </div>
                                        <div className="flex items-center text-gray-500">
                                            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600">
                                                <MoreHorizontal size={20} />
                                            </button>
                                            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600">
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Post Content */}
                            <div className="px-3 lg:px-4 pb-2">
                                <p className="text-sm text-gray-900 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                                    {post.content}
                                </p>
                            </div>

                            {/* Post Image */}
                            {post.image && (
                                <div className="mt-2 text-center bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                    <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" />
                                </div>
                            )}

                            {/* Post Stats */}
                            <div className="mx-3 lg:mx-4 py-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
                                <div className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600">
                                    <div className="bg-[#1485bd] rounded-full p-[3px]">
                                        <ThumbsUp size={10} className="text-white fill-white" />
                                    </div>
                                    <span className="text-xs text-gray-500 hover:text-blue-600">{post.likes}</span>
                                </div>
                                <span className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 cursor-pointer">
                                    {post.comments} comments • 2 reposts
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="px-2 py-1 flex justify-between gap-1 mt-1 mb-1">
                                <button className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold text-sm transition-colors">
                                    <ThumbsUp size={20} className="text-gray-500" /> <span className="hidden sm:inline">Like</span>
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold text-sm transition-colors">
                                    <MessageSquare size={20} className="text-gray-500 flex-shrink-0 translate-y-[1px]" style={{ transform: 'scaleX(-1)' }} /> <span className="hidden sm:inline">Comment</span>
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold text-sm transition-colors">
                                    <Repeat size={20} className="text-gray-500" /> <span className="hidden sm:inline">Repost</span>
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold text-sm transition-colors">
                                    <Send size={20} className="text-gray-500 -rotate-45 -translate-y-[2px]" /> <span className="hidden sm:inline">Send</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Sidebar */}
                <div className="hidden lg:block">
                    <div className="sticky top-[80px] space-y-4">

                        {/* AI Recommendations */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] p-4 border-t-2 border-blue-500">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-blue-100 dark:bg-blue-900/40 p-1.5 rounded-lg text-blue-600 dark:text-blue-400">
                                    <Sparkles size={16} />
                                </span>
                                <h2 className="font-bold text-gray-900 dark:text-white text-sm">AI Recommends</h2>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { title: 'Frontend Developer', company: 'iCog Labs', match: '98% Match', type: 'Internship', color: 'bg-violet-500' },
                                    { title: 'UI/UX Designer', company: 'Kifiya Financial', match: '92% Match', type: 'Freelance', color: 'bg-emerald-500' },
                                    { title: 'Mobile Developer', company: 'Ride Ethiopia', match: '85% Match', type: 'Part-time', color: 'bg-blue-500' },
                                ].map(({ title, company, type, color, match }) => (
                                    <div key={title} className="flex gap-3 items-start group cursor-pointer">
                                        <div className={`w-10 h-10 rounded-lg ${color} flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform`}>
                                            {company.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug truncate group-hover:text-blue-600 transition-colors">{title}</h4>
                                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded ml-2 flex-shrink-0">{match}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">{company}</p>
                                            <span className="inline-block mt-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-800 px-2 flex-shrink-0 rounded-full">{type}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <Link to="/student/browse" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                    Browse all matches →
                                </Link>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] p-4">
                            <h2 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Quick Links</h2>
                            <div className="space-y-1">
                                {[
                                    { label: 'My Applications', to: '/student/applications' },
                                    { label: 'My Tasks', to: '/student/tasks' },
                                    { label: 'My Skills', to: '/student/skills' },
                                    { label: 'Messages', to: '/student/messages' },
                                    { label: 'My Profile', to: '/student/profile' },
                                ].map(({ label, to }) => (
                                    <Link key={label} to={to} className="block px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium">
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Platform Footer */}
                        <div className="px-2 flex flex-wrap gap-x-3 gap-y-1">
                            {['Privacy Policy', 'Terms of Service', 'Help Center'].map(link => (
                                <a key={link} href="#" className="text-[11px] text-gray-400 hover:text-blue-500 hover:underline transition-colors">{link}</a>
                            ))}
                            <p className="w-full text-[11px] text-gray-400 mt-1">© 2026 Frelaunch Inc.</p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

