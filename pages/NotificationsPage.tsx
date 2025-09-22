
import React, { useState } from 'react';
import type { Notification } from '../types';
import { getNotificationIcon } from '../App';
import { ArrowUpRightIcon, CheckCircleIcon } from '../components/Icons';

interface NotificationsPageProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [categoryFilter, setCategoryFilter] = useState<Notification['type'] | 'all'>('all');
    
    const categories: Notification['type'][] = ['order', 'project', 'security', 'user', 'finance', 'mention', 'system'];

    const filteredNotifications = notifications
        .filter(n => filter === 'unread' ? !n.read : true)
        .filter(n => categoryFilter === 'all' ? true : n.type === categoryFilter)
        .sort((a, b) => (a.read === b.read) ? 0 : a.read ? 1 : -1);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="mt-6 pb-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">All Notifications</h1>
                    <p className="text-light-gray mt-1">You have {unreadCount} unread notifications.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onMarkAllAsRead}
                        className="text-sm text-accent-cyan hover:underline disabled:text-light-gray disabled:no-underline"
                        disabled={unreadCount === 0}
                    >
                        Mark all as read
                    </button>
                </div>
            </div>

            <div className="bg-dark-card rounded-3xl mt-4 p-6 transition-all duration-300 hover:shadow-glow-cyan hover:-translate-y-1">
                 <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-dark-border mb-4">
                    {/* Main filters */}
                    <div className="flex shrink-0">
                        <button 
                            onClick={() => setFilter('all')} 
                            className={`px-4 py-2 text-sm font-semibold transition-colors ${filter === 'all' ? 'border-b-2 border-accent-cyan text-white' : 'text-light-gray hover:text-white'}`}
                        >
                            All ({notifications.length})
                        </button>
                        <button 
                            onClick={() => setFilter('unread')} 
                            className={`px-4 py-2 text-sm font-semibold transition-colors ${filter === 'unread' ? 'border-b-2 border-accent-cyan text-white' : 'text-light-gray hover:text-white'}`}
                        >
                            Unread ({unreadCount})
                        </button>
                    </div>
                    {/* Category filters */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
                        <button onClick={() => setCategoryFilter('all')} className={`px-3 py-1 text-xs rounded-lg font-semibold whitespace-nowrap ${categoryFilter === 'all' ? 'bg-white text-black' : 'bg-dark-bg hover:bg-mid-gray'}`}>All Categories</button>
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1 text-xs rounded-lg font-semibold whitespace-nowrap capitalize ${categoryFilter === cat ? 'bg-white text-black' : 'bg-dark-bg hover:bg-mid-gray'}`}>{cat}</button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map(n => (
                            <div
                                key={n.id}
                                className={`flex items-center gap-4 p-4 rounded-xl transition-colors duration-200 ${n.read ? 'opacity-60 hover:opacity-100' : 'bg-dark-bg/50'}`}
                            >
                                <div className="shrink-0 self-start pt-1">
                                    {getNotificationIcon(n.type)}
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm">{n.message}</p>
                                    <p className="text-xs text-light-gray mt-1">{n.timestamp}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {n.actionText && n.actionLink && (
                                        <button className="text-xs font-semibold bg-dark-border px-3 py-1.5 rounded-lg hover:bg-mid-gray transition-colors flex items-center gap-1">
                                            {n.actionText} <ArrowUpRightIcon className="w-3 h-3" />
                                        </button>
                                    )}
                                    {!n.read && (
                                        <button 
                                            onClick={() => onMarkAsRead(n.id)}
                                            title="Mark as read"
                                            className="p-2 text-light-gray hover:text-green-400 rounded-full hover:bg-dark-bg transition-colors"
                                        >
                                            <CheckCircleIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="p-8 text-center text-light-gray">
                           No notifications match your filters.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};