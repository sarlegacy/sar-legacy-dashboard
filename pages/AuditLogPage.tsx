
import React from 'react';
import type { AuditLogEntry } from '../types';
import { ClockIcon, LoginIcon, PencilIcon, PlusIcon, TrashIcon } from '../components/Icons';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-dark-card rounded-3xl p-6 transition-all duration-300 hover:shadow-glow-cyan hover:-translate-y-1 ${className}`}>
        {children}
    </div>
);

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
        case 'login':
            return <LoginIcon className="w-5 h-5 text-green-400" />;
        case 'update':
            return <PencilIcon className="w-5 h-5 text-yellow-400" />;
        case 'create':
            return <PlusIcon className="w-5 h-5 text-blue-400" />;
        case 'delete':
            return <TrashIcon className="w-5 h-5 text-red-500" />;
        default:
            return <ClockIcon className="w-5 h-5 text-light-gray" />;
    }
}

export const AuditLogPage: React.FC = () => {
    return (
        <div className="mt-6 pb-6">
            <h1 className="text-2xl font-bold">Audit Log</h1>
            <p className="text-light-gray mt-1">A chronological record of all significant activities in the system.</p>
            
            <Card className="mt-4">
                <div className="space-y-2">
                    {mockAuditLogData.map(log => (
                        <div key={log.id} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-dark-bg transition-colors">
                            <div className="mt-1 bg-dark-bg p-2 rounded-full">
                                {getActionIcon(log.type)}
                            </div>
                            <div className="flex-grow">
                                <p>
                                    <span className="font-bold">{log.user.name}</span> {log.action}
                                </p>
                                <p className="text-sm text-light-gray mt-1">{log.timestamp}</p>
                            </div>
                             <img src={log.user.avatarUrl} alt={log.user.name} className="w-10 h-10 rounded-full" />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};