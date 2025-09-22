import React, { useState, useRef, useEffect } from 'react';
import type { LoginActivity, BillingHistoryItem, AuditLogEntry, LogEntry, NotificationPreferences, DataExportRequest } from '../types';
import { 
    UserCircleIcon, LockClosedIcon, CreditCardIcon, BellAlertIcon, ShieldCheckIcon, 
    TrashIcon, GlobeAltIcon, ClockIcon, LoginIcon, PencilIcon, PlusIcon, DocumentTextIcon, DownloadIcon, ArchiveBoxIcon 
} from '../components/Icons';
import { LogService } from '../services/LogService';


const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; icon?: React.ReactNode; }> = ({ children, className = '', title, icon }) => (
    <div className={`bg-dark-card rounded-3xl p-6 transition-all duration-300 ${className}`}>
        {title && (
             <h2 className="text-lg font-bold mb-4 flex items-center">
                {icon && <span className="mr-3 text-accent-cyan">{icon}</span>}
                {title}
            </h2>
        )}
        {children}
    </div>
);

const InputField: React.FC<{ label: string; type: string; value: string; placeholder?: string }> = ({ label, type, value, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-light-gray mb-1">{label}</label>
        <input type={type} defaultValue={value} placeholder={placeholder} className="w-full bg-dark-bg border border-dark-border rounded-lg h-11 px-4 focus:outline-none focus:ring-2 focus:ring-accent-cyan" />
    </div>
);

const TextAreaField: React.FC<{ label: string; value: string; placeholder?: string; rows?: number }> = ({ label, value, placeholder, rows = 3 }) => (
    <div>
        <label className="block text-sm font-medium text-light-gray mb-1">{label}</label>
        <textarea defaultValue={value} placeholder={placeholder} rows={rows} className="w-full bg-dark-bg border border-dark-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-accent-cyan" />
    </div>
);

const SelectField: React.FC<{ label: string; children: React.ReactNode; defaultValue: string }> = ({ label, children, defaultValue }) => (
    <div>
        <label className="block text-sm font-medium text-light-gray mb-1">{label}</label>
        <select defaultValue={defaultValue} className="w-full bg-dark-bg border border-dark-border rounded-lg h-11 px-3 focus:outline-none focus:ring-2 focus:ring-accent-cyan appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}>
            {children}
        </select>
    </div>
);


const Toggle: React.FC<{ label: string; description: string; enabled: boolean; onClick: () => void; }> = ({ label, description, enabled, onClick }) => (
     <div className="flex items-center justify-between">
        <div>
            <p className="font-semibold">{label}</p>
            <p className="text-sm text-light-gray">{description}</p>
        </div>
        <button onClick={onClick} className={`w-12 h-6 rounded-full flex items-center transition-colors ${enabled ? 'bg-accent-cyan justify-end' : 'bg-mid-gray justify-start'}`}>
            <span className="w-5 h-5 bg-white rounded-full block mx-0.5 transform transition-transform"></span>
        </button>
    </div>
);

// --- Data for Cards ---
const billingHistoryData: BillingHistoryItem[] = [
    { id: '1', date: '2024-09-01', description: 'Premium Plan Monthly Subscription', amount: 12.99 },
    { id: '2', date: '2024-08-01', description: 'Premium Plan Monthly Subscription', amount: 12.99 },
];

// --- Audit Log Content ---
const mockAuditLogData: AuditLogEntry[] = [
    { id: '1', user: { name: 'Saiful Alam Rafi', avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' }, action: 'Logged in successfully from IP 192.168.1.1', timestamp: '2m ago', type: 'login' },
    { id: '2', user: { name: 'Jane Doe', avatarUrl: 'https://picsum.photos/seed/user2/64/64' }, action: 'Updated their profile information.', timestamp: '1h ago', type: 'update' },
    { id: '3', user: { name: 'Saiful Alam Rafi', avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' }, action: 'Created a new user: John Smith (USR003)', timestamp: '5h ago', type: 'create' },
    { id: '4', user: { name: 'Noah Brooks', avatarUrl: 'https://picsum.photos/seed/user/40/40' }, action: 'Logged in successfully.', timestamp: '8h ago', type: 'login' },
    { id: '5', user: { name: 'Saiful Alam Rafi', avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' }, action: 'Deleted the project "Legacy System Migration"', timestamp: '1d ago', type: 'delete' },
    { id: '6', user: { name: 'John Smith', avatarUrl: 'https://picsum.photos/seed/user3/64/64' }, action: 'Logged in successfully.', timestamp: '1d ago', type: 'login' },
];

const getActionIcon = (type: AuditLogEntry['type']) => {
    switch(type) {
        case 'login': return <LoginIcon className="w-5 h-5 text-green-400" />;
        case 'update': return <PencilIcon className="w-5 h-5 text-yellow-400" />;
        case 'create': return <PlusIcon className="w-5 h-5 text-blue-400" />;
        case 'delete': return <TrashIcon className="w-5 h-5 text-red-500" />;
        default: return <ClockIcon className="w-5 h-5 text-light-gray" />;
    }
}

const AuditLogTabContent: React.FC = () => {
    const [logs, setLogs] = useState(mockAuditLogData);
    const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());

    const handleSelectLog = (id: string) => {
        setSelectedLogs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedLogs(new Set(logs.map(log => log.id)));
        } else {
            setSelectedLogs(new Set());
        }
    };
    
    const handleDeleteSelected = () => {
        if (selectedLogs.size === 0) return;
        if (window.confirm(`Are you sure you want to delete ${selectedLogs.size} log entries?`)) {
            setLogs(currentLogs => currentLogs.filter(log => !selectedLogs.has(log.id)));
            setSelectedLogs(new Set());
        }
    };

    const handleExport = () => {
        const headers = ["ID", "Timestamp", "User", "Action", "Type"];
        const selectedLogData = logs.filter(log => selectedLogs.has(log.id));
        const dataToExport = selectedLogs.size > 0 ? selectedLogData : logs;

        const csvContent = [
            headers.join(','),
            ...dataToExport.map(log => [
                log.id,
                log.timestamp,
                `"${log.user.name}"`,
                `"${log.action.replace(/"/g, '""')}"`,
                log.type
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isAllSelected = logs.length > 0 && selectedLogs.size === logs.length;

    return (
        <Card>
             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 border-b border-dark-border pb-4">
                <div className="flex items-center gap-4">
                    <input 
                        type="checkbox" 
                        title={isAllSelected ? "Deselect all" : "Select all"}
                        className="form-checkbox h-5 w-5 bg-dark-bg border-dark-border text-accent-cyan focus:ring-accent-cyan rounded cursor-pointer"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        aria-label="Select all logs"
                    />
                    <label className="text-sm">{selectedLogs.size} of {logs.length} selected</label>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleDeleteSelected} 
                        disabled={selectedLogs.size === 0}
                        className="flex items-center gap-2 text-sm font-semibold bg-red-500/20 text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <TrashIcon className="w-4 h-4" /> Delete Selected
                    </button>
                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 text-sm font-semibold bg-dark-border px-4 py-2 rounded-lg hover:bg-mid-gray"
                    >
                        <DownloadIcon className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>
            <div className="space-y-1 max-h-[calc(100vh-28rem)] overflow-y-auto pr-2">
                {logs.map(log => (
                    <div key={log.id} className={`flex items-start space-x-4 p-3 rounded-xl transition-colors ${selectedLogs.has(log.id) ? 'bg-dark-bg ring-1 ring-accent-cyan' : 'hover:bg-dark-bg'}`}>
                        <input 
                            type="checkbox" 
                            className="form-checkbox h-5 w-5 bg-dark-bg border-dark-border text-accent-cyan focus:ring-accent-cyan rounded mt-1 cursor-pointer shrink-0"
                            checked={selectedLogs.has(log.id)}
                            onChange={() => handleSelectLog(log.id)}
                            aria-labelledby={`log-action-${log.id}`}
                        />
                        <div className="mt-1 bg-dark-bg p-2 rounded-full">
                            {getActionIcon(log.type)}
                        </div>
                        <div className="flex-grow">
                            <p id={`log-action-${log.id}`}>
                                <span className="font-bold">{log.user.name}</span> {log.action}
                            </p>
                            <p className="text-sm text-light-gray mt-1">{log.timestamp}</p>
                        </div>
                        <img src={log.user.avatarUrl} alt={log.user.name} className="w-10 h-10 rounded-full" />
                    </div>
                ))}
            </div>
        </Card>
    );
};

// --- Client Log Content ---
const LogLevelChip: React.FC<{ level: LogEntry['level'] }> = ({ level }) => {
    const levelStyles = {
        INFO: 'bg-blue-500/20 text-blue-300',
        WARN: 'bg-yellow-500/20 text-yellow-300',
        ERROR: 'bg-red-500/20 text-red-300',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${levelStyles[level]}`}>
            {level}
        </span>
    );
};

const ClientLogTabContent: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>(LogService.getLogs());
    const [filter, setFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');

    useEffect(() => {
        const handleUpdate = () => {
            setLogs(LogService.getLogs());
        };
        LogService.subscribe(handleUpdate);
        return () => LogService.unsubscribe(handleUpdate);
    }, []);

    const filteredLogs = logs.filter(log => filter === 'ALL' || log.level === filter);

    const formatTimestamp = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    };

    const handleExport = () => {
        const logContent = filteredLogs.map(log => `[${log.timestamp.toISOString()}] [${log.level}] ${log.message}`).join('\n');
        const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `client_logs_${new Date().toISOString().split('T')[0]}.log`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 border-b border-dark-border pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold">Filter by level:</span>
                    {(['ALL', 'INFO', 'WARN', 'ERROR'] as const).map(level => (
                        <button
                            key={level}
                            onClick={() => setFilter(level)}
                            className={`px-3 py-1 text-sm rounded-lg font-semibold ${filter === level ? 'bg-accent-cyan text-black' : 'bg-dark-bg hover:bg-mid-gray'}`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
                 <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-dark-border text-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-mid-gray transition-colors"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        Download .log
                    </button>
                    <button
                        onClick={() => LogService.clearLogs()}
                        className="flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-lg font-semibold hover:bg-red-500/30 transition-colors"
                    >
                        <TrashIcon className="w-4 h-4" />
                        Clear Logs
                    </button>
                </div>
            </div>
            
            <div className="font-mono text-sm h-[calc(100vh-28rem)] overflow-y-auto pr-2">
                {filteredLogs.map(log => (
                    <div key={log.id} className="flex items-start gap-4 p-2 rounded hover:bg-dark-bg">
                        <span className="text-light-gray">{formatTimestamp(log.timestamp)}</span>
                        <LogLevelChip level={log.level} />
                        <p className="flex-1 whitespace-pre-wrap break-words">{log.message}</p>
                    </div>
                ))}
                    {filteredLogs.length === 0 && (
                    <div className="text-center py-16 text-light-gray">No logs to display for this filter.</div>
                )}
            </div>
        </Card>
    );
};


// --- Main Page ---
export const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [avatarPreview, setAvatarPreview] = useState("https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
        orders: true, projects: true, security: true, users: true,
        finance: true, mentions: true, system: false,
    });
    const [exportRequests, setExportRequests] = useState<DataExportRequest[]>([
        { id: 'EXP-001', requestDate: '2024-09-25', status: 'Completed', dataType: 'All Transactions', downloadUrl: '#' },
        { id: 'EXP-002', requestDate: '2024-09-28', status: 'Pending', dataType: 'Full Account Data' },
    ]);
    
    const handlePreferenceChange = (key: keyof NotificationPreferences) => {
        setNotificationPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) { setAvatarPreview(URL.createObjectURL(file)); }
    };

    const handleUploadClick = () => { fileInputRef.current?.click(); };

    const getExportStatusChip = (status: DataExportRequest['status']) => {
        switch (status) {
            case 'Completed': return <span className="px-2 py-1 text-xs font-semibold text-green-300 bg-green-500/20 rounded-full">Completed</span>;
            case 'Pending': return <span className="px-2 py-1 text-xs font-semibold text-yellow-300 bg-yellow-500/20 rounded-full">Pending</span>;
            case 'Failed': return <span className="px-2 py-1 text-xs font-semibold text-red-300 bg-red-500/20 rounded-full">Failed</span>;
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <UserCircleIcon /> },
        { id: 'security', label: 'Security', icon: <ShieldCheckIcon /> },
        { id: 'notifications', label: 'Notifications', icon: <BellAlertIcon /> },
        { id: 'billing', label: 'Billing', icon: <CreditCardIcon /> },
        { id: 'data', label: 'Data & Privacy', icon: <ArchiveBoxIcon /> },
        { id: 'audit', label: 'Audit Log', icon: <ClockIcon /> },
        { id: 'client', label: 'Client Log', icon: <DocumentTextIcon /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card title="Profile Information" icon={<UserCircleIcon />}>
                                <div className="flex items-center space-x-6 mb-6">
                                    <img src={avatarPreview} alt="Saiful Alam Rafi" className="w-24 h-24 rounded-full object-cover"/>
                                    <div>
                                        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden"/>
                                        <button onClick={handleUploadClick} className="bg-accent-cyan text-black font-semibold px-4 py-2 rounded-lg hover:bg-accent-cyan-light transition-colors">Upload new picture</button>
                                        <p className="text-xs text-light-gray mt-2">PNG, JPG, GIF up to 10MB.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Full Name" type="text" value="Saiful Alam Rafi" />
                                    <InputField label="Role" type="text" value="Founder/Admin" />
                                    <InputField label="Email Address" type="email" value="saiful@sarlegacy.com" />
                                    <InputField label="Phone Number" type="tel" value="+1 234 567 890" />
                                    <div className="md:col-span-2">
                                        <TextAreaField label="Bio" value="Experienced Founder and Admin with a demonstrated history of working in the computer software industry." placeholder="Tell us about yourself..." />
                                    </div>
                                    <InputField label="LinkedIn Profile" type="text" value="linkedin.com/in/saiful" />
                                </div>
                                <div className="text-right mt-4">
                                    <button className="bg-white text-black font-bold px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-colors">Save Changes</button>
                                </div>
                            </Card>
                        </div>
                        <div className="lg:col-span-1">
                            <Card title="Language & Region" icon={<GlobeAltIcon />}>
                                <div className="space-y-4">
                                    <SelectField label="Language" defaultValue="en-us">
                                        <option value="en-us">English (United States)</option>
                                    </SelectField>
                                    <SelectField label="Timezone" defaultValue="est">
                                        <option value="est">(GMT-5:00) Eastern Time</option>
                                    </SelectField>
                                </div>
                            </Card>
                        </div>
                    </div>
                );
            case 'security':
                return (
                     <div className="max-w-3xl mx-auto space-y-6">
                        <Card title="Password & Security" icon={<LockClosedIcon />}>
                            <div className="space-y-4">
                                <InputField label="Current Password" type="password" value="" placeholder="••••••••" />
                                <InputField label="New Password" type="password" value="" placeholder="••••••••" />
                                <InputField label="Confirm New Password" type="password" value="" placeholder="••••••••" />
                            </div>
                            <div className="text-right mt-4">
                                <button className="bg-white text-black font-bold px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-colors">Update Password</button>
                            </div>
                            <hr className="border-dark-border my-6" />
                             <Toggle 
                                label="Two-Factor Authentication (2FA)" 
                                description="Add an extra layer of security to your account." 
                                enabled={true} 
                                onClick={() => alert('This would open a 2FA setup wizard.')}
                             />
                        </Card>
                         <Card title="Active Sessions" icon={<GlobeAltIcon />}>
                            <p className="text-sm text-light-gray mb-4">You can log out of other sessions for security.</p>
                            <div className="text-sm flex justify-between items-center p-3 bg-dark-bg rounded-lg">
                                <div>
                                    <p className="font-bold">Chrome on macOS <span className="text-green-400 font-normal">(This device)</span></p>
                                    <p className="text-light-gray">New York, USA (192.168.1.1)</p>
                                </div>
                                <p className="text-light-gray">Active now</p>
                            </div>
                            <div className="text-sm flex justify-between items-center p-3 mt-2 hover:bg-dark-bg rounded-lg">
                                <div><p>Safari on iPhone</p><p className="text-light-gray">New York, USA (192.168.1.1)</p></div>
                                <p className="text-light-gray">Active 1 day ago</p>
                            </div>
                            <div className="text-right mt-4">
                                <button onClick={() => alert('All other sessions have been logged out.')} className="bg-yellow-500/20 text-yellow-300 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500/30 transition-colors">
                                    Log out of all other devices
                                </button>
                            </div>
                        </Card>
                        <Card title="Account Management" icon={<TrashIcon />}>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-yellow-400">Deactivate Account</h3>
                                    <p className="text-sm text-light-gray mt-1">Temporarily disable your account.</p>
                                    <button className="mt-2 text-yellow-400 font-semibold text-sm hover:underline">Deactivate</button>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-red-500">Delete Account</h3>
                                    <p className="text-sm text-light-gray mt-1">Permanently delete your account and all associated data.</p>
                                    <button className="mt-2 text-red-500 font-semibold text-sm hover:underline">Delete my account</button>
                                </div>
                            </div>
                        </Card>
                    </div>
                );
            case 'notifications':
                 return (
                    <div className="max-w-3xl mx-auto">
                        <Card title="Notification Preferences" icon={<BellAlertIcon />}>
                            <div className="space-y-5 divide-y divide-dark-border/50">
                                {Object.entries(notificationPreferences).map(([key, value]) => (
                                    <div className="pt-5 first:pt-0" key={key}>
                                        <Toggle 
                                            label={`${key.charAt(0).toUpperCase() + key.slice(1)} Alerts`}
                                            description={`Receive notifications for ${key}.`} 
                                            enabled={value}
                                            onClick={() => handlePreferenceChange(key as keyof NotificationPreferences)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                 );
            case 'billing':
                return (
                    <div className="max-w-3xl mx-auto">
                        <Card title="Billing & Plan" icon={<CreditCardIcon />}>
                            <div>
                                <p className="text-light-gray">Current Plan</p>
                                <p className="text-xl font-bold">Premium</p>
                                <p className="text-sm text-light-gray">৳12.99 per month, renews on 2024-10-01</p>
                                <button className="w-full mt-3 bg-accent-cyan text-black font-semibold py-2 rounded-lg hover:bg-accent-cyan-light transition-colors">Manage Subscription</button>
                            </div>
                            <hr className="border-dark-border my-6" />
                            <h3 className="font-semibold mb-2">Payment Method</h3>
                            <div className="flex items-center space-x-3 bg-dark-bg p-3 rounded-lg">
                                <CreditCardIcon className="w-8 h-8"/>
                                <div><p>Visa ending in 1234</p><p className="text-xs text-light-gray">Expires 12/2028</p></div>
                                <button className="ml-auto text-sm font-semibold hover:underline">Update</button>
                            </div>
                            <hr className="border-dark-border my-6" />
                            <h3 className="font-semibold mb-2">Billing History</h3>
                            {billingHistoryData.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm p-2 hover:bg-dark-bg rounded-lg">
                                    <div><p>{item.description}</p><p className="text-light-gray">{item.date}</p></div>
                                    <div className="flex items-center gap-4"><p className="font-semibold">৳{item.amount.toFixed(2)}</p><button className="text-xs font-semibold text-accent-cyan hover:underline">Download</button></div>
                                </div>
                            ))}
                        </Card>
                    </div>
                );
            case 'data':
                return (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <Card title="Request Data Export" icon={<DownloadIcon className="w-6 h-6" />}>
                            <p className="text-sm text-light-gray mb-4">You can request an export of your personal data. We'll email you a link to download your data when it's ready.</p>
                            <form onSubmit={(e) => { e.preventDefault(); alert('Export request submitted!'); }}>
                                <div className="flex flex-col sm:flex-row items-end gap-4">
                                    <div className="flex-grow w-full">
                                        <SelectField label="Data to export" defaultValue="all">
                                            <option value="all">Full Account Data</option>
                                            <option value="profile">Profile Information</option>
                                            <option value="transactions">All Transactions</option>
                                            <option value="projects">Project Data</option>
                                        </SelectField>
                                    </div>
                                    <button type="submit" className="bg-accent-cyan text-black font-semibold px-4 py-2.5 rounded-lg hover:bg-accent-cyan-light transition-colors h-11 w-full sm:w-auto">Request Export</button>
                                </div>
                            </form>
                        </Card>
                        <Card title="Recent Exports" icon={<ClockIcon />}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-dark-border"><th className="p-3 font-semibold text-light-gray">Request ID</th><th className="p-3 font-semibold text-light-gray">Date</th><th className="p-3 font-semibold text-light-gray">Data Type</th><th className="p-3 font-semibold text-light-gray">Status</th><th className="p-3 font-semibold text-light-gray"></th></tr>
                                    </thead>
                                    <tbody>
                                        {exportRequests.map(req => (
                                            <tr key={req.id} className="border-b border-dark-border/50">
                                                <td className="p-3 font-mono">{req.id}</td><td className="p-3">{req.requestDate}</td>
                                                <td className="p-3">{req.dataType}</td><td className="p-3">{getExportStatusChip(req.status)}</td>
                                                <td className="p-3 text-right">
                                                    {req.status === 'Completed' && req.downloadUrl && (<a href={req.downloadUrl} className="font-semibold text-accent-cyan hover:underline">Download</a>)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                );
            case 'audit':
                return <AuditLogTabContent />;
            case 'client':
                return <ClientLogTabContent />;
            default:
                return null;
        }
    };

    return (
        <div className="mt-6 pb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <div className="flex items-center border-b border-dark-border mt-4 mb-6 overflow-x-auto">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-b-2 border-accent-cyan text-white' : 'text-light-gray hover:text-white'}`}
                    >
                        {/* Fix: Cast icon to a ReactElement with a className prop to resolve overload error. */}
                        {React.cloneElement(tab.icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5" })}
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="page-container" key={activeTab}>
                {renderContent()}
            </div>
        </div>
    );
};
