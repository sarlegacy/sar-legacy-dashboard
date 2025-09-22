import React from 'react';
import type { User } from '../types';
import { ArrowLeftIcon, EnvelopeIcon, PhoneIcon, BriefcaseIcon, TrashIcon, ChartBarIcon } from '../components/Icons';

// This would typically come from a data store or API call, but we'll use the mock data for now.
const mockUsers: User[] = [
    { id: 'USR001', name: 'Saiful Alam Rafi', avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', email: 'saiful@sarlegacy.com', role: 'Admin', status: 'Active', lastLogin: '2 min ago', joinDate: '2022-01-15', bio: 'Experienced Founder and Admin with a demonstrated history of working in the computer software industry.', phone: '+1 234 567 890', assignedProjects: [{id: 'PROJ-003', name: 'Data Analytics Dashboard'}] },
    { id: 'USR002', name: 'Jane Doe', avatarUrl: 'https://picsum.photos/seed/user2/64/64', email: 'jane.d@example.com', role: 'Manager', status: 'Active', lastLogin: '1 hour ago', joinDate: '2022-03-20', bio: 'Project Manager with over 5 years of experience in agile methodologies and team leadership.', phone: '+1 345 678 901', assignedProjects: [{id: 'PROJ-001', name: 'E-commerce Platform Relaunch'}, {id: 'PROJ-002', name: 'Mobile App Development'}] },
    { id: 'USR003', name: 'John Smith', avatarUrl: 'https://picsum.photos/seed/user3/64/64', email: 'john.s@example.com', role: 'Developer', status: 'Active', lastLogin: '5 hours ago', joinDate: '2023-05-10', bio: 'Full-stack developer specializing in React and Node.js.', phone: '+1 456 789 012', assignedProjects: [{id: 'PROJ-001', name: 'E-commerce Platform Relaunch'}, {id: 'PROJ-004', name: 'Marketing Website Update'}] },
    { id: 'USR004', name: 'Emily White', avatarUrl: 'https://picsum.photos/seed/user4/64/64', email: 'emily.w@example.com', role: 'Designer', status: 'Inactive', lastLogin: '3 days ago', joinDate: '2022-09-01', bio: 'UI/UX designer with a passion for creating intuitive and beautiful user experiences.', phone: '+1 567 890 123', assignedProjects: [{id: 'PROJ-002', name: 'Mobile App Development'}] },
    { id: 'USR005', name: 'Michael Brown', avatarUrl: 'https://picsum.photos/seed/user5/64/64', email: 'michael.b@example.com', role: 'Developer', status: 'Active', lastLogin: '1 day ago', joinDate: '2023-02-28', bio: 'Backend developer with expertise in database management and API design.', phone: '+1 678 901 234', assignedProjects: [{id: 'PROJ-003', name: 'Data Analytics Dashboard'}] },
];

// Fix: Replaced JSX.Element with React.ReactNode to avoid namespace errors.
const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; icon?: React.ReactNode; }> = ({ children, className = '', title, icon }) => (
    <div className={`bg-dark-card rounded-3xl p-6 transition-all duration-300 hover:shadow-glow-cyan hover:-translate-y-1 ${className}`}>
        {title && (
             <h2 className="text-lg font-bold mb-4 flex items-center">
                {icon && <span className="mr-3 text-accent-cyan">{icon}</span>}
                {title}
            </h2>
        )}
        {children}
    </div>
);

const ContributionHeatmap: React.FC = () => {
    const today = new Date();
    const squares = Array.from({ length: 119 }, (_, i) => { // 17 weeks * 7 days
        const date = new Date(today);
        date.setDate(date.getDate() - (118 - i));
        const level = Math.floor(Math.random() * 5); // 0-4 activity level
        return { date, level };
    });

    const levelColors = ['#232323', '#0e4429', '#006d32', '#26a641', '#39d353'];

    return (
        <div>
            <h3 className="font-bold text-sm mb-2">{squares.length} contributions in the last 17 weeks</h3>
            <div className="grid grid-rows-7 grid-flow-col gap-1">
                {squares.map((sq, i) => (
                    <div
                        key={i}
                        className="w-4 h-4 rounded-sm"
                        style={{ backgroundColor: levelColors[sq.level] }}
                        title={`Level ${sq.level} on ${sq.date.toDateString()}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};


export const UserProfilePage: React.FC<{ userId: string, onBack: () => void }> = ({ userId, onBack }) => {
    const user = mockUsers.find(u => u.id === userId);

    if (!user) {
        return (
            <div className="mt-6 pb-6 text-center">
                <h1 className="text-2xl font-bold">User Not Found</h1>
                <p className="text-light-gray mt-2">The user you are looking for does not exist.</p>
                <button onClick={onBack} className="mt-6 flex items-center space-x-2 text-accent-cyan hover:underline mx-auto">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Back to User List</span>
                </button>
            </div>
        );
    }
    
    return (
        <div className="mt-6 pb-6">
            <button onClick={onBack} className="flex items-center space-x-2 text-light-gray hover:text-white mb-4 transition-colors">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back to Users</span>
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: Profile card */}
                <div className="lg:col-span-1">
                    <Card>
                        <div className="flex flex-col items-center text-center">
                            <img src={user.avatarUrl} alt={user.name} className="w-32 h-32 rounded-full object-cover shadow-lg"/>
                            <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
                            <p className="text-accent-cyan font-semibold">{user.role}</p>
                            <span className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full ${user.status === 'Active' ? 'text-green-300 bg-green-500/20' : 'text-gray-400 bg-gray-500/20'}`}>
                                {user.status}
                            </span>
                            <p className="text-sm text-light-gray mt-6 text-left">{user.bio}</p>
                        </div>
                    </Card>
                </div>
                {/* Right column: Details and actions */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                     <Card title="Contribution Activity" icon={<ChartBarIcon />}>
                        <ContributionHeatmap />
                    </Card>
                    <Card title="Contact Information" icon={<EnvelopeIcon />}>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center"><span className="text-light-gray">Email</span><span className="font-semibold">{user.email}</span></div>
                            <div className="flex justify-between items-center"><span className="text-light-gray">Phone</span><span className="font-semibold">{user.phone}</span></div>
                            <div className="flex justify-between items-center"><span className="text-light-gray">Joined Date</span><span className="font-semibold">{user.joinDate}</span></div>
                            <div className="flex justify-between items-center"><span className="text-light-gray">Last Login</span><span className="font-semibold">{user.lastLogin}</span></div>
                        </div>
                    </Card>
                     <Card title="Assigned Projects" icon={<BriefcaseIcon />}>
                        <div className="space-y-3">
                            {user.assignedProjects.length > 0 ? user.assignedProjects.map(proj => (
                                <div key={proj.id} className="flex justify-between items-center bg-dark-bg p-3 rounded-lg hover:shadow-lg transition-shadow">
                                    <p className="font-semibold">{proj.name}</p>
                                    <p className="text-xs text-light-gray font-mono">{proj.id}</p>
                                </div>
                            )) : (
                                <p className="text-sm text-center text-light-gray py-4">No projects assigned.</p>
                            )}
                        </div>
                    </Card>
                    <Card title="Account Management" icon={<TrashIcon />}>
                        <p className="text-sm text-light-gray mb-4">Manage user account status or remove them from the system.</p>
                        <div className="flex flex-col md:flex-row gap-4">
                             <button className="flex-1 text-center bg-yellow-500/20 text-yellow-300 font-semibold py-3 rounded-lg hover:bg-yellow-500/30 transition-colors">
                                Suspend Account
                            </button>
                             <button className="flex-1 text-center bg-red-500/20 text-red-300 font-semibold py-3 rounded-lg hover:bg-red-500/30 transition-colors">
                                Delete Account
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}