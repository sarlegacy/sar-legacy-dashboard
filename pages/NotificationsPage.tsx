
import React, { useState } from 'react';
import type { Notification } from '../types';
import { getNotificationIcon } from '../App';

interface NotificationsPageProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const filteredNotifications = notifications.filter(n => filter === 'unread' ? !n.read : true).sort((a, b) => (a.read === b.read) ? 0 : a.read ? 1 : -1);
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
                <div className="flex border-b border-dark-border mb-4">
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

                <div className="space-y-2">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map(n => (
                            <div
                                key={n.id}
                                onClick={() => onMarkAsRead(n.id)}
                                className="flex items-start gap-4 p-4 rounded-xl hover:bg-dark-bg cursor-pointer transition-colors"
                            >
                                {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan mt-1.5 shrink-0 animate-pulse"></span>}
                                <div className={`shrink-0 ${n.read ? 'ml-[18px] opacity-60' : ''}`}>
                                    {getNotificationIcon(n.type)}
                                </div>
                                <div className={`flex-grow ${n.read ? 'opacity-60' : ''}`}>
                                    <p className="text-sm">{n.message}</p>
                                    <p className="text-xs text-light-gray mt-1">{n.timestamp}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="p-8 text-center text-light-gray">
                            {filter === 'unread' ? "You're all caught up!" : "No notifications yet."}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};