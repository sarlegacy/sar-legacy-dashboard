
import React, { useState, useRef, useEffect } from 'react';
import type { Conversation, Message, SocialPlatform } from '../types';
import { SearchIcon, PaperAirplaneIcon, MailIcon, FacebookIcon, WhatsAppIcon, TelegramIcon, WeChatIcon, SnapchatIcon, ArrowLeftIcon } from '../components/Icons';
import { LogService } from '../services/LogService';

// --- Mock Data ---

const mockConversations: Conversation[] = [
    {
        id: 'CONV001',
        userName: 'Jane Doe',
        avatarUrl: 'https://picsum.photos/seed/user2/64/64',
        platform: 'whatsapp',
        lastMessage: 'Sounds good! I will review the new project specs and get back to you.',
        lastMessageTimestamp: '10m ago',
        unreadCount: 2,
        messages: [
            { id: 'M1', text: 'Hey, did you get a chance to look at the latest project update?', sender: 'other', timestamp: '1h ago' },
            { id: 'M2', text: 'Yes, I did. The new designs look great!', sender: 'me', timestamp: '55m ago' },
            { id: 'M3', text: 'Awesome! Let me know if you have any feedback on the user flow for the checkout page.', sender: 'other', timestamp: '30m ago' },
            { id: 'M4', text: 'Sounds good! I will review the new project specs and get back to you.', sender: 'me', timestamp: '10m ago' },
        ],
    },
    {
        id: 'CONV002',
        userName: 'John Smith',
        avatarUrl: 'https://picsum.photos/seed/user3/64/64',
        platform: 'telegram',
        lastMessage: 'Okay, I\'ve pushed the latest commit.',
        lastMessageTimestamp: '1h ago',
        unreadCount: 0,
        messages: [
            { id: 'M5', text: 'Can you check the bug report on the login page?', sender: 'me', timestamp: '2h ago' },
            { id: 'M6', text: 'Sure, taking a look now.', sender: 'other', timestamp: '1h 50m ago' },
            { id: 'M7', text: 'Okay, I\'ve pushed the latest commit.', sender: 'other', timestamp: '1h ago' },
        ],
    },
    {
        id: 'CONV003',
        userName: 'Emily White',
        avatarUrl: 'https://picsum.photos/seed/user4/64/64',
        platform: 'facebook',
        lastMessage: 'Here are the assets for the new landing page.',
        lastMessageTimestamp: '3h ago',
        unreadCount: 1,
        messages: [
             { id: 'M8', text: 'Here are the assets for the new landing page.', sender: 'other', timestamp: '3h ago' },
        ],
    },
    {
        id: 'CONV004',
        userName: 'Michael Brown',
        avatarUrl: 'https://picsum.photos/seed/user5/64/64',
        platform: 'internal',
        lastMessage: 'Meeting at 3 PM confirmed.',
        lastMessageTimestamp: '5h ago',
        unreadCount: 0,
        messages: [
             { id: 'M9', text: 'Can we move the meeting to 3 PM?', sender: 'other', timestamp: '6h ago' },
             { id: 'M10', text: 'Meeting at 3 PM confirmed.', sender: 'me', timestamp: '5h ago' },
        ],
    },
     {
        id: 'CONV005',
        userName: 'Client Support',
        avatarUrl: 'https://picsum.photos/seed/support/64/64',
        platform: 'wechat',
        lastMessage: 'Thank you for your feedback!',
        lastMessageTimestamp: '1d ago',
        unreadCount: 0,
        messages: [],
    },
];

const playNotificationSound = () => {
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (!audioContext) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    } catch (e) {
        console.error("Could not play notification sound.", e);
        LogService.log('Failed to play notification sound.', 'ERROR');
    }
};

// --- Subcomponents ---

const PlatformIcon: React.FC<{ platform: SocialPlatform; className?: string }> = ({ platform, className = 'w-5 h-5' }) => {
    switch (platform) {
        case 'facebook': return <FacebookIcon className={className + " text-blue-600"} />;
        case 'whatsapp': return <WhatsAppIcon className={className + " text-green-500"} />;
        case 'telegram': return <TelegramIcon className={className + " text-blue-400"} />;
        case 'wechat': return <WeChatIcon className={className + " text-green-400"} />;
        case 'snapchat': return <SnapchatIcon className={className + " text-yellow-400"} />;
        default: return <MailIcon className={className} />;
    }
};

const ConversationItem: React.FC<{ conv: Conversation; isActive: boolean; onClick: () => void }> = ({ conv, isActive, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-start space-x-4 p-4 rounded-2xl cursor-pointer transition-colors ${isActive ? 'bg-dark-bg' : 'hover:bg-dark-bg/50'}`}
    >
        <div className="relative shrink-0">
            <img src={conv.avatarUrl} alt={conv.userName} className="w-12 h-12 rounded-full" />
            <div className="absolute -bottom-1 -right-1 bg-dark-bg p-1 rounded-full border border-dark-card">
                 <PlatformIcon platform={conv.platform} className="w-4 h-4" />
            </div>
            {conv.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-cyan text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {conv.unreadCount}
                </span>
            )}
        </div>
        <div className="flex-grow overflow-hidden">
            <div className="flex justify-between items-center">
                <h3 className="font-bold truncate">{conv.userName}</h3>
                <p className="text-xs text-light-gray shrink-0">{conv.lastMessageTimestamp}</p>
            </div>
            <p className="text-sm text-light-gray truncate mt-1">{conv.lastMessage}</p>
        </div>
    </div>
);

const MessageBubble: React.FC<{ msg: Message }> = ({ msg }) => {
    const isMe = msg.sender === 'me';
    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${isMe ? 'bg-accent-cyan text-black rounded-br-none' : 'bg-dark-bg text-white rounded-bl-none'}`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 opacity-70 ${isMe ? '' : 'text-right'}`}>{msg.timestamp}</p>
            </div>
        </div>
    );
};

// --- Main Page Component ---

export const MessengerPage: React.FC = () => {
    const [conversations, setConversations] = useState(mockConversations);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const activeConversation = conversations.find(c => c.id === activeConversationId);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversation?.messages]);

    const handleSelectConversation = (id: string) => {
        setActiveConversationId(id);
        setConversations(convs => convs.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
    };

    const handleBackToList = () => {
        setActiveConversationId(null);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversationId) return;

        const sentMessage: Message = {
            id: `M${Date.now()}`,
            text: newMessage,
            timestamp: 'Just now',
            sender: 'me',
        };
        
        const activeConvBeforeUpdate = conversations.find(c => c.id === activeConversationId);

        // Add user's message and move conversation to top
        setConversations(currentConvs => {
            const updatedConvs = currentConvs.map(c => {
                if (c.id === activeConversationId) {
                    return {
                        ...c,
                        messages: [...c.messages, sentMessage],
                        lastMessage: sentMessage.text,
                        lastMessageTimestamp: sentMessage.timestamp,
                    };
                }
                return c;
            });
            const activeConv = updatedConvs.find(c => c.id === activeConversationId);
            const otherConvs = updatedConvs.filter(c => c.id !== activeConversationId);
            return activeConv ? [activeConv, ...otherConvs] : updatedConvs;
        });
        
        LogService.log(`Message sent to ${activeConvBeforeUpdate?.userName}: "${sentMessage.text}"`, 'INFO');
        setNewMessage('');
        
        // --- Simulate reply and play sound ---
        setTimeout(() => {
            const replyMessage: Message = {
                id: `M${Date.now() + 1}`,
                text: `This is an automated reply to: "${sentMessage.text}"`,
                timestamp: 'Just now',
                sender: 'other',
            };

            setConversations(currentConvs => {
                const updatedConvsWithReply = currentConvs.map(c => {
                    if (c.id === activeConversationId) {
                        return {
                            ...c,
                            messages: [...c.messages, replyMessage],
                            lastMessage: replyMessage.text,
                            lastMessageTimestamp: replyMessage.timestamp,
                            unreadCount: (c.unreadCount || 0) + 1,
                        };
                    }
                    return c;
                });
                LogService.log(`Message received from ${activeConvBeforeUpdate?.userName}: "${replyMessage.text}"`, 'INFO');
                playNotificationSound();
                return updatedConvsWithReply;
            });
        }, 1500 + Math.random() * 1000); // random delay for realism
    };
    
    const showList = isMobile ? activeConversationId === null : true;
    const showChat = isMobile ? activeConversationId !== null : true;

    return (
        <div className="mt-6 h-[calc(100vh-10rem)] flex flex-col">
             <h1 className="text-2xl font-bold mb-4">Messenger</h1>
            <div className="bg-dark-card rounded-3xl flex-grow flex overflow-hidden transition-all duration-300 hover:shadow-glow-cyan hover:-translate-y-1">
                {/* Left: Conversation List */}
                <div className={`w-full md:w-1/3 xl:w-1/4 border-r border-dark-border flex flex-col ${showList ? 'flex' : 'hidden'} md:flex`}>
                    <div className="p-4 border-b border-dark-border">
                         <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="text-light-gray" />
                            </div>
                            <input
                                type="search"
                                placeholder="Search messages..."
                                className="w-full bg-dark-bg border border-dark-border rounded-lg h-10 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-accent-cyan"
                            />
                        </div>
                    </div>
                    <div className="flex-grow p-2 overflow-y-auto space-y-1">
                        {conversations.map(conv => (
                            <ConversationItem
                                key={conv.id}
                                conv={conv}
                                isActive={conv.id === activeConversationId}
                                onClick={() => handleSelectConversation(conv.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Right: Active Chat */}
                <div className={`flex-1 flex-col ${showChat ? 'flex' : 'hidden'} md:flex`}>
                    {activeConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="flex items-center space-x-4 p-4 border-b border-dark-border">
                                <button onClick={handleBackToList} className="md:hidden p-2 -ml-2 text-light-gray hover:text-white">
                                    <ArrowLeftIcon />
                                </button>
                                <img src={activeConversation.avatarUrl} alt={activeConversation.userName} className="w-12 h-12 rounded-full" />
                                <div>
                                    <h2 className="text-lg font-bold">{activeConversation.userName}</h2>
                                    <div className="flex items-center gap-2 text-sm text-light-gray">
                                        <PlatformIcon platform={activeConversation.platform} className="w-4 h-4"/>
                                        <span className="capitalize">{activeConversation.platform === 'internal' ? 'Messenger' : activeConversation.platform}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-grow p-4 md:p-6 overflow-y-auto">
                                <div className="space-y-4">
                                    {activeConversation.messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
                                </div>
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-dark-border">
                                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder={`Message on ${activeConversation.platform === 'internal' ? 'Messenger' : activeConversation.platform}...`}
                                        className="flex-grow bg-dark-bg border border-dark-border rounded-xl h-12 px-4 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                                    />
                                    <button type="submit" className="w-12 h-12 flex items-center justify-center bg-accent-cyan text-black rounded-xl hover:bg-accent-cyan-light transition-colors shrink-0 disabled:bg-mid-gray" disabled={!newMessage.trim()}>
                                        <PaperAirplaneIcon />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:flex items-center justify-center h-full">
                            <p className="text-light-gray">Select a conversation to start chatting.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};