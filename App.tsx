
import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, BellIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ShoppingCartIcon, BriefcaseIcon, ShieldCheckIcon, UsersIcon, SettingsIcon, LogoutIcon, DollarSignIcon, AtSymbolIcon } from './components/Icons';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { EcommercePage } from './pages/EcommercePage';
import { P2PTradingPage } from './pages/P2PTradingPage';
import { FinancePage } from './pages/FinancePage';
import { StatisticsPage } from './pages/StatisticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { MessengerPage } from './pages/MessengerPage';
import { LoginPage } from './pages/LoginPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import type { Notification, AuthUser } from './types';
import { LogService } from './services/LogService';

// --- Notifications Data & Helpers ---

const mockNotifications: Notification[] = [
    { id: '1', type: 'order', message: 'New order #ORD552 received from Alex Green.', timestamp: '5m ago', read: false, actionText: 'View Order', actionLink: '#' },
    { id: '2', type: 'mention', message: 'Jane Doe mentioned you in the "Mobile App" project.', timestamp: '25m ago', read: false, actionText: 'View Comment', actionLink: '#' },
    { id: '3', type: 'project', message: 'Project "Mobile App Development" is at risk.', timestamp: '1h ago', read: false, actionText: 'View Project', actionLink: '#' },
    { id: '4', type: 'finance', message: 'Your monthly budget for "Groceries" is nearing its limit (92%).', timestamp: '2h ago', read: false, actionText: 'Review Budget', actionLink: '#' },
    { id: '5', type: 'security', message: 'Unusual login detected from a new device.', timestamp: '3h ago', read: true },
    { id: '6', type: 'user', message: 'John Smith has been added to the team.', timestamp: '8h ago', read: true },
    { id: '7', type: 'system', message: 'System maintenance is scheduled for tonight at 2 AM.', timestamp: '1d ago', read: true },
    { id: '8', type: 'order', message: 'Order #ORD551 has been shipped.', timestamp: '1d ago', read: true },
];

export const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'order':
            return <ShoppingCartIcon className="w-5 h-5 text-accent-cyan" />;
        case 'project':
            return <BriefcaseIcon className="w-5 h-5 text-accent-purple" />;
        case 'security':
            return <ShieldCheckIcon className="w-5 h-5 text-red-500" />;
        case 'user':
            return <UsersIcon className="w-5 h-5 text-blue-400" />;
        case 'finance':
            return <DollarSignIcon className="w-5 h-5 text-green-400" />;
        case 'mention':
            return <AtSymbolIcon className="w-5 h-5 text-indigo-400" />;
        case 'system':
            return <SettingsIcon className="w-5 h-5 text-light-gray" />;
        default:
            return <BellIcon className="w-5 h-5 text-light-gray" />;
    }
};

const useOnlineStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            LogService.log('Application is back online.', 'INFO');
        };
        const handleOffline = () => {
            setIsOnline(false);
            LogService.log('Application is offline. Some features may be unavailable.', 'WARN');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
};


const NotificationsPanel: React.FC<{
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onNavigateToAll: () => void;
    onNavigateToSettings: () => void;
}> = ({ notifications, onMarkAsRead, onMarkAllAsRead, onNavigateToAll, onNavigateToSettings }) => {
    return (
        <div className="bg-dark-card rounded-2xl shadow-lg border border-dark-border overflow-hidden flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-dark-border">
                <h3 className="font-bold text-lg">Notifications</h3>
                <button onClick={onMarkAllAsRead} className="text-xs text-accent-cyan hover:underline">Mark all as read</button>
            </div>
            <div className="flex-grow max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <div
                            key={n.id}
                            onClick={() => onMarkAsRead(n.id)}
                            className="flex items-start gap-4 p-4 border-b border-dark-border/50 hover:bg-dark-bg cursor-pointer transition-colors"
                        >
                            {!n.read && <span className="w-2 h-2 rounded-full bg-accent-cyan mt-1.5 shrink-0"></span>}
                            <div className={`shrink-0 ${n.read ? 'ml-4' : ''}`}>
                                {getNotificationIcon(n.type)}
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm">{n.message}</p>
                                <p className="text-xs text-light-gray mt-1">{n.timestamp}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="p-4 text-center text-sm text-light-gray">No new notifications.</p>
                )}
            </div>
             <div className="p-2 border-t border-dark-border bg-dark-bg/50 flex justify-between items-center">
                <button
                    onClick={onNavigateToSettings}
                    title="Notification Settings"
                    className="p-2 rounded-lg hover:bg-dark-border transition-colors"
                >
                    <SettingsIcon className="w-5 h-5 text-light-gray"/>
                </button>
                <button
                    onClick={onNavigateToAll}
                    className="text-center text-sm py-2 px-4 text-accent-cyan hover:underline rounded-lg"
                >
                    See all notifications
                </button>
            </div>
        </div>
    );
};


const UserProfileDropdown: React.FC<{
    user: AuthUser;
    onLogout: () => void;
    onNavigateToSettings: () => void;
}> = ({ user, onLogout, onNavigateToSettings }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(prev => !prev)} className="flex items-center space-x-2">
                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                <ChevronDownIcon className={`w-4 h-4 text-light-gray transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`
                absolute top-full right-0 mt-3 w-64 z-50 bg-dark-card rounded-2xl shadow-lg border border-dark-border
                transition-all duration-300 ease-in-out origin-top-right
                ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
            `}>
                <div className="p-4 border-b border-dark-border">
                    <p className="font-bold truncate">{user.name}</p>
                    <p className="text-sm text-light-gray truncate">{user.email}</p>
                </div>
                <div className="p-2">
                    <button onClick={() => { onNavigateToSettings(); setIsOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg">
                        <SettingsIcon className="w-5 h-5" /> Settings
                    </button>
                    <button onClick={onLogout} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg text-red-400">
                        <LogoutIcon className="w-5 h-5" /> Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

const Header: React.FC<{
    user: AuthUser;
    onLogout: () => void;
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onNavigateToAll: () => void;
    onNavigateToSettings: () => void;
    isOnline: boolean;
}> = ({ user, onLogout, notifications, onMarkAsRead, onMarkAllAsRead, onNavigateToAll, onNavigateToSettings, isOnline }) => {
    
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);
    const notificationsRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setNotificationsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [notificationsRef]);


    return (
        <header className="flex items-center justify-between h-auto md:h-20 flex-wrap py-4 md:py-0 border-b border-dark-border/50 mb-2">
            {/* Left Section */}
            <div className="order-1">
                <h1 className="text-2xl font-bold">SAR LEGACY</h1>
                <p className="text-sm text-light-gray hidden sm:block">Welcome back, {user.name.split(' ')[0]}!</p>
            </div>

            {/* Middle Section */}
            <div className="w-full md:flex-1 md:max-w-lg md:mx-8 order-3 md:order-2 mt-4 md:mt-0">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="text-light-gray" />
                    </div>
                    <input
                        type="search"
                        placeholder="Search"
                        className="w-full bg-dark-card border border-dark-border rounded-xl h-12 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4 md:space-x-6 order-2 md:order-3">
                 <div className="relative flex items-center" title={isOnline ? 'Online' : 'Offline'}>
                    <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {!isOnline && <span className="absolute w-3 h-3 rounded-full bg-red-500 animate-ping"></span>}
                </div>
                 <div className="relative" ref={notificationsRef}>
                    <button
                        onClick={() => setNotificationsOpen(prev => !prev)}
                        className="relative p-3 rounded-full hover:bg-dark-card transition-colors"
                        aria-label={`Notifications (${unreadCount} unread)`}
                    >
                        <BellIcon />
                        {unreadCount > 0 && (
                           <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                        )}
                    </button>
                    <div className={`
                        absolute top-full right-0 mt-3 w-80 md:w-96 z-50
                        transition-all duration-300 ease-in-out origin-top-right
                        ${isNotificationsOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
                    `}>
                        <NotificationsPanel
                            notifications={notifications}
                            onMarkAsRead={onMarkAsRead}
                            onMarkAllAsRead={() => {
                                onMarkAllAsRead();
                                setTimeout(() => setNotificationsOpen(false), 300);
                            }}
                            onNavigateToAll={() => {
                                onNavigateToAll();
                                setNotificationsOpen(false);
                            }}
                            onNavigateToSettings={() => {
                                onNavigateToSettings();
                                setNotificationsOpen(false);
                            }}
                        />
                    </div>
                </div>
                <UserProfileDropdown 
                    user={user} 
                    onLogout={onLogout}
                    onNavigateToSettings={onNavigateToSettings}
                />
            </div>
        </header>
    );
};


const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [activePage, _setActivePage] = useState('home');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(mockNotifications);
  const isOnline = useOnlineStatus();

  const setActivePage = (page: string) => {
    const pageName = page.charAt(0).toUpperCase() + page.slice(1);
    LogService.log(`Navigated to ${pageName} page.`, 'INFO');
    _setActivePage(page);
  };


  const handleMarkAsRead = (id: string) => {
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId);
    setActivePage('user-profile');
  };

  const handleBack = () => {
    setSelectedUserId(null);
    setActivePage('users');
  };

  const renderPage = () => {
    let pageComponent;
    switch (activePage) {
        case 'home':
            pageComponent = <DashboardPage />;
            break;
        case 'users':
            pageComponent = <UsersPage onViewUser={handleViewUser} />;
            break;
        case 'projects':
            pageComponent = <ProjectsPage />;
            break;
        case 'messenger':
            pageComponent = <MessengerPage />;
            break;
        case 'ecommerce':
            pageComponent = <EcommercePage />;
            break;
        case 'trading':
            pageComponent = <P2PTradingPage />;
            break;
        case 'finance':
            pageComponent = <FinancePage />;
            break;
        case 'stats':
            pageComponent = <StatisticsPage />;
            break;
        case 'settings':
            pageComponent = <SettingsPage />;
            break;
        case 'notifications':
            pageComponent = <NotificationsPage 
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
            />;
            break;
        case 'user-profile':
            if (!selectedUserId) {
                setActivePage('users');
                pageComponent = <UsersPage onViewUser={handleViewUser} />;
            } else {
               pageComponent = <UserProfilePage userId={selectedUserId} onBack={handleBack} />;
            }
            break;
        default:
            pageComponent = <DashboardPage />;
    }
    return <div key={activePage} className="page-container">{pageComponent}</div>;
  };
  
  // Ensure user is not null before rendering. Auth check is done in parent component.
  if (!user) return null;

  return (
    <div className="flex min-h-screen font-sans p-4 lg:p-6 bg-dark-bg">
      <Sidebar 
        activePage={activePage === 'user-profile' ? 'users' : activePage} 
        setActivePage={setActivePage} 
      />
      <main className="flex-1 ml-4 lg:ml-8 overflow-y-auto">
        <Header 
            user={user}
            onLogout={logout}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onNavigateToAll={() => setActivePage('notifications')}
            onNavigateToSettings={() => setActivePage('settings')}
            isOnline={isOnline}
        />
        {renderPage()}
      </main>
    </div>
  );
};


const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppWithAuthCheck />
        </AuthProvider>
    );
};

const AppWithAuthCheck: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        LogService.log('Application initialized.', 'INFO');
    }, []);

    if (loading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-dark-bg">
                <div className="w-16 h-16 border-4 border-t-accent-cyan border-dark-border rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return <AppContent />;
};

export default App;