import { useState } from 'react';
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
    X
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
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden">
                        {/* Banner */}
                        <div className="h-14 bg-[url('https://static.licdn.com/sc/h/5q92zj25macptill1tayvj6gq')] bg-cover bg-center"></div>

                        <div className="px-3 pb-4 relative">
                            {/* Avatar */}
                            <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-[72px] h-[72px] rounded-full border-2 border-white dark:border-gray-900 bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden shadow-sm">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user?.name || 'User'} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 text-slate-600 flex items-center justify-center text-2xl font-semibold">
                                        {user?.name?.charAt(0) || 'B'}
                                    </div>
                                )}
                            </div>

                            <div className="mt-12 text-center">
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
                <div className="space-y-4 hidden lg:block">
                    {/* Add to your feed / Recommendations */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-gray-900 dark:text-white text-base">Add to your feed</h2>
                            <button className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-200 dark:hover:bg-gray-700">i</button>
                        </div>

                        <div className="space-y-4">
                            {/* Recommend 1 */}
                            <div className="flex gap-2">
                                <img src="https://ui-avatars.com/api/?name=F+A&background=random&color=fff" className="w-12 h-12 rounded-full flex-shrink-0" alt="Avatar" />
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Fitness Authority ®</h4>
                                    <p className="text-[12px] text-gray-500 mt-0.5 line-clamp-2 leading-snug">Company • Health, Wellness & Fitness</p>
                                    <button className="mt-1.5 flex items-center gap-1 border border-gray-600 dark:border-gray-400 text-gray-600 dark:text-gray-300 rounded-full px-4 py-[3px] text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-900 hover:text-gray-900 dark:hover:border-white dark:hover:text-white transition-colors">
                                        <Plus size={16} /> Follow
                                    </button>
                                </div>
                            </div>

                            {/* Recommend 2 */}
                            <div className="flex gap-2">
                                <img src="https://ui-avatars.com/api/?name=i+C&background=random&color=fff" className="w-12 h-12 rounded-full flex-shrink-0" alt="Avatar" />
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">iCog Labs</h4>
                                    <p className="text-[12px] text-gray-500 mt-0.5 line-clamp-2 leading-snug">Company • Artificial Intelligence</p>
                                    <button className="mt-1.5 flex items-center gap-1 border border-gray-600 dark:border-gray-400 text-gray-600 dark:text-gray-300 rounded-full px-4 py-[3px] text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-900 hover:text-gray-900 dark:hover:border-white dark:hover:text-white transition-colors">
                                        <Plus size={16} /> Follow
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-1">
                            <a href="#" className="flex items-center gap-1 text-[13px] font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                                View all recommendations →
                            </a>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="text-center px-4 sticky top-[80px]">
                        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-gray-500">
                            <a href="#" className="hover:text-blue-600 hover:underline">About</a>
                            <a href="#" className="hover:text-blue-600 hover:underline">Accessibility</a>
                            <a href="#" className="hover:text-blue-600 hover:underline">Help Center</a>
                            <a href="#" className="hover:text-blue-600 hover:underline">Privacy & Terms</a>
                            <a href="#" className="hover:text-blue-600 hover:underline">Ad Choices</a>
                            <a href="#" className="hover:text-blue-600 hover:underline">Advertising</a>
                            <a href="#" className="hover:text-blue-600 hover:underline">Business Services</a>
                            <a href="#" className="hover:text-blue-600 hover:underline">Get the App</a>
                            <a href="#" className="hover:text-blue-600 hover:underline">More</a>
                        </div>
                        <p className="text-xs text-gray-900 dark:text-gray-300 mt-4 flex items-center justify-center gap-1">
                            <span className="font-bold text-[#0a66c2] text-sm">Linked<span className="bg-[#0a66c2] text-white px-0.5 rounded-sm ml-0.5">in</span></span>
                            LinkedIn Corporation © 2026
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

