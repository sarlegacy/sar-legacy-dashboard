import React, { useState } from 'react';
import type { User } from '../types';
import { SearchIcon, PlusIcon, PencilIcon, TrashIcon, ChartBarIcon } from '../components/Icons';

const mockUsers: User[] = [
    { id: 'USR001', name: 'Saiful Alam Rafi', avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', email: 'saiful@sarlegacy.com', role: 'Admin', status: 'Active', lastLogin: '2 min ago', joinDate: '2022-01-15', bio: 'Experienced Founder and Admin with a demonstrated history of working in the computer software industry.', phone: '+1 234 567 890', assignedProjects: [{id: 'PROJ-003', name: 'Data Analytics Dashboard'}] },
    { id: 'USR002', name: 'Jane Doe', avatarUrl: 'https://picsum.photos/seed/user2/64/64', email: 'jane.d@example.com', role: 'Manager', status: 'Active', lastLogin: '1 hour ago', joinDate: '2022-03-20', bio: 'Project Manager with over 5 years of experience in agile methodologies and team leadership.', phone: '+1 345 678 901', assignedProjects: [{id: 'PROJ-001', name: 'E-commerce Platform Relaunch'}, {id: 'PROJ-002', name: 'Mobile App Development'}] },
    { id: 'USR003', name: 'John Smith', avatarUrl: 'https://picsum.photos/seed/user3/64/64', email: 'john.s@example.com', role: 'Developer', status: 'Active', lastLogin: '5 hours ago', joinDate: '2023-05-10', bio: 'Full-stack developer specializing in React and Node.js.', phone: '+1 456 789 012', assignedProjects: [{id: 'PROJ-001', name: 'E-commerce Platform Relaunch'}, {id: 'PROJ-004', name: 'Marketing Website Update'}] },
    { id: 'USR004', name: 'Emily White', avatarUrl: 'https://picsum.photos/seed/user4/64/64', email: 'emily.w@example.com', role: 'Designer', status: 'Inactive', lastLogin: '3 days ago', joinDate: '2022-09-01', bio: 'UI/UX designer with a passion for creating intuitive and beautiful user experiences.', phone: '+1 567 890 123', assignedProjects: [{id: 'PROJ-002', name: 'Mobile App Development'}] },
    { id: 'USR005', name: 'Michael Brown', avatarUrl: 'https://picsum.photos/seed/user5/64/64', email: 'michael.b@example.com', role: 'Developer', status: 'Active', lastLogin: '1 day ago', joinDate: '2023-02-28', bio: 'Backend developer with expertise in database management and API design.', phone: '+1 678 901 234', assignedProjects: [{id: 'PROJ-003', name: 'Data Analytics Dashboard'}] },
];

const getStatusChip = (status: User['status']) => (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-2 ${status === 'Active' ? 'text-green-300 bg-green-500/20' : 'text-gray-400 bg-gray-500/20'}`}>
        <span className={`w-2 h-2 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
        {status}
    </span>
);

const getRoleChip = (role: User['role']) => {
    const colors = {
        'Admin': 'bg-accent-cyan text-black',
        'Manager': 'bg-blue-500/50 text-blue-200',
        'Developer': 'bg-purple-500/50 text-accent-purple',
        'Designer': 'bg-pink-500/50 text-pink-200',
    }
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[role]}`}>{role}</span>;
}

const InviteUserModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-dark-card rounded-3xl p-6 border border-dark-border w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-light-gray hover:text-white text-2xl">&times;</button>
                <h2 className="text-xl font-bold mb-4">Invite New User</h2>
                <p className="text-sm text-light-gray mb-4">Enter the user's email address and assign a role. They will receive an email to set up their account.</p>
                <form onSubmit={(e) => { e.preventDefault(); onClose(); }}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-light-gray">Email Address</label>
                            <input type="email" placeholder="name@example.com" className="w-full bg-dark-bg border border-dark-border rounded-lg h-10 px-3 mt-1" required />
                        </div>
                         <div>
                            <label className="text-xs text-light-gray">Assign Role</label>
                            <select className="w-full bg-dark-bg border border-dark-border rounded-lg h-10 px-3 mt-1" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', appearance: 'none' }}>
                                <option>Developer</option>
                                <option>Designer</option>
                                <option>Manager</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="w-full mt-6 bg-accent-cyan text-black font-bold py-3 rounded-lg hover:bg-accent-cyan-light transition-colors">
                        Send Invitation
                    </button>
                </form>
            </div>
        </div>
    );
};

const UserRolesChart: React.FC<{ users: User[] }> = ({ users }) => {
    const roleCounts = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    // Fix: Using Record<string, number> helps TypeScript correctly infer the value type
    // from Object.entries as 'number' instead of 'unknown', fixing subsequent type errors.
    }, {} as Record<string, number>);
    
    const data = Object.entries(roleCounts).map(([role, count]) => ({ label: role, value: count }));
    const maxValue = Math.max(...data.map(d => d.value));

    const roleColors: Record<User['role'], string> = {
        'Admin': '#71E6E9',
        'Manager': '#60A5FA',
        'Developer': '#c084fc',
        'Designer': '#f472b6',
    };

    return (
        <div className="bg-dark-card rounded-3xl p-6 transition-all duration-300 hover:shadow-glow-cyan hover:-translate-y-1">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><ChartBarIcon /> User Roles Distribution</h2>
            <div className="space-y-3">
                {data.map(item => (
                    <div key={item.label} className="grid grid-cols-4 items-center text-sm">
                        <span className="text-light-gray">{item.label}</span>
                        <div className="col-span-3 bg-dark-bg rounded-full h-5 flex items-center">
                            <div
                                className="h-5 rounded-full flex items-center justify-end pr-2 text-black font-bold text-xs"
                                style={{
                                    width: `${(item.value / maxValue) * 100}%`,
                                    backgroundColor: roleColors[item.label as User['role']],
                                    transition: 'width 0.5s ease-out'
                                }}
                            >{item.value}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export const UsersPage: React.FC<{ onViewUser: (userId: string) => void }> = ({ onViewUser }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div className="mt-6 pb-6">
            {isModalOpen && <InviteUserModal onClose={() => setModalOpen(false)} />}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h1 className="text-2xl font-bold">User Management</h1>
                <div className="flex items-center gap-3">
                     <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="text-light-gray" />
                        </div>
                        <input
                            type="search"
                            placeholder="Search users..."
                            className="w-full bg-dark-card border border-dark-border rounded-lg h-10 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                        />
                    </div>
                    <button onClick={() => setModalOpen(true)} className="bg-white text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 shrink-0">
                        <PlusIcon />
                        <span>Add User</span>
                    </button>
                </div>
            </div>

            <div className="mt-4">
                <UserRolesChart users={mockUsers} />
            </div>

            <div className="bg-dark-card rounded-3xl mt-6 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-dark-border">
                                <th className="p-4 text-sm font-semibold text-light-gray">Name</th>
                                <th className="p-4 text-sm font-semibold text-light-gray">Email</th>
                                <th className="p-4 text-sm font-semibold text-light-gray">Role</th>
                                <th className="p-4 text-sm font-semibold text-light-gray">Status</th>
                                <th className="p-4 text-sm font-semibold text-light-gray hidden lg:table-cell">Last Login</th>
                                <th className="p-4 text-sm font-semibold text-light-gray">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockUsers.map(user => (
                                <tr key={user.id} onClick={() => onViewUser(user.id)} className="border-b border-dark-border/50 hover:bg-dark-bg transition-colors cursor-pointer">
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                                            <span className="font-semibold">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-light-gray">{user.email}</td>
                                    <td className="p-4">{getRoleChip(user.role)}</td>
                                    <td className="p-4">{getStatusChip(user.status)}</td>
                                    <td className="p-4 text-light-gray hidden lg:table-cell">{user.lastLogin}</td>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-2">
                                            <button onClick={(e) => { e.stopPropagation(); /* edit logic */ }} className="p-2 text-light-gray hover:bg-dark-bg hover:text-accent-cyan rounded-md"><PencilIcon/></button>
                                            <button onClick={(e) => { e.stopPropagation(); /* delete logic */ }} className="p-2 text-light-gray hover:bg-dark-bg hover:text-red-500 rounded-md"><TrashIcon/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};