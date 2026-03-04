import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Send, Search, Paperclip, MoreVertical, Phone, Video, MessageCircle } from 'lucide-react';
import { setActiveConversation, sendMessage } from '../../features/chat/chatSlice';
import clsx from 'clsx';

// Mock chat data always uses 'u1' for the logged-in student
const STUDENT_SENDER_ID = 'u1';

export default function Messages() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { conversations, activeConversationId } = useSelector((s) => s.chat);
    const [message, setMessage] = useState('');
    const [search, setSearch] = useState('');
    const messagesEndRef = useRef(null);
    const activeConv = conversations.find((c) => c.id === activeConversationId);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConv?.messages.length]);

    const handleSend = () => {
        if (!message.trim() || !activeConversationId) return;
        dispatch(sendMessage({
            conversationId: activeConversationId,
            message: {
                id: Date.now().toString(),
                senderId: STUDENT_SENDER_ID,
                text: message.trim(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
        }));
        setMessage('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const filtered = conversations.filter((c) =>
        c.user.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page-enter flex flex-col" style={{ height: 'calc(100vh - 88px)' }}>

            {/* Page Header */}
            <div className="mb-4 flex-shrink-0">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('dashboard.messages')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Chat with recruiters and collaborators</p>
            </div>

            {/* Chat Container */}
            <div className="flex-1 min-h-0 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm overflow-hidden flex">

                {/* Left: Conversations List */}
                <div className="w-72 flex-shrink-0 border-r border-gray-100 dark:border-gray-700/60 flex flex-col">
                    {/* Search */}
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700/60 flex-shrink-0">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search conversations..."
                                className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border-0"
                            />
                        </div>
                    </div>

                    {/* Conversation Items */}
                    <div className="flex-1 overflow-y-auto">
                        {filtered.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => dispatch(setActiveConversation(conv.id))}
                                className={clsx(
                                    'w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors text-left border-b border-gray-50 dark:border-gray-700/20',
                                    activeConversationId === conv.id && 'bg-blue-50/80 dark:bg-blue-900/20 border-l-2 border-l-blue-500'
                                )}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                                        {conv.user.name[0]}
                                    </div>
                                    {conv.user.online && (
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white dark:border-gray-800 rounded-full" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className={clsx('text-sm font-semibold truncate', activeConversationId === conv.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200')}>
                                            {conv.user.name}
                                        </p>
                                        <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">{conv.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage}</p>
                                </div>
                                {conv.unread > 0 && (
                                    <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {conv.unread}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Chat Window */}
                {activeConv ? (
                    <div className="flex-1 flex flex-col min-w-0">

                        {/* Chat Header */}
                        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 dark:border-gray-700/60 flex-shrink-0 bg-white dark:bg-gray-800/80">
                            <div className="relative">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                                    {activeConv.user.name[0]}
                                </div>
                                {activeConv.user.online && (
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white dark:border-gray-900 rounded-full" />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">{activeConv.user.name}</p>
                                <p className="text-xs flex items-center gap-1 mt-0.5">
                                    <span className={clsx('w-1.5 h-1.5 rounded-full', activeConv.user.online ? 'bg-emerald-400' : 'bg-gray-300')} />
                                    <span className={activeConv.user.online ? 'text-emerald-500' : 'text-gray-400'}>
                                        {activeConv.user.online ? 'Online' : 'Offline'}
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"><Phone size={16} /></button>
                                <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"><Video size={16} /></button>
                                <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"><MoreVertical size={16} /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/20">
                            {activeConv.messages.map((msg) => {
                                const isMine = msg.senderId === STUDENT_SENDER_ID;
                                return (
                                    <div key={msg.id} className={clsx('flex items-end gap-2', isMine ? 'justify-end' : 'justify-start')}>
                                        {!isMine && (
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                {activeConv.user.name[0]}
                                            </div>
                                        )}
                                        <div className="max-w-[65%]">
                                            <div className={clsx(
                                                'px-4 py-2.5 text-sm leading-relaxed',
                                                isMine
                                                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-2xl rounded-br-sm'
                                                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 dark:border-gray-600'
                                            )}>
                                                {msg.text}
                                            </div>
                                            <p className={clsx('text-[10px] text-gray-400 mt-1 px-1', isMine ? 'text-right' : 'text-left')}>
                                                {msg.time}
                                            </p>
                                        </div>
                                        {isMine && (
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                                                Me
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700/60 flex-shrink-0 bg-white dark:bg-gray-800/80">
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-2xl px-3 py-2 border border-gray-200 dark:border-gray-600 focus-within:border-blue-400 transition-colors">
                                <button className="p-1 text-gray-400 hover:text-blue-500 transition-colors flex-shrink-0">
                                    <Paperclip size={16} />
                                </button>
                                <input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={t('chat.type_message')}
                                    className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none py-0.5"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!message.trim()}
                                    className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-center text-white disabled:opacity-40 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex-shrink-0"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50/50 dark:bg-gray-900/20">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                                <MessageCircle size={28} className="text-blue-400" />
                            </div>
                            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Your messages</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">Select a conversation to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
