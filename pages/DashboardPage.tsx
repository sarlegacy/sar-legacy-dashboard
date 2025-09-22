import React, { useState } from 'react';
import type { CalendarTask, KeyMetric, TeamMemberPerformance, TimeTrackingTask, AppUsage, UpcomingDeadline } from '../types';
import { 
    PhoneIcon, EnvelopeIcon,
    DollarSignIcon, ChartBarIcon, UsersIcon, BriefcaseIcon, TrendingUpIcon, 
    TrendingDownIcon, PlayIcon, PauseIcon, PencilIcon, CheckCircleIcon,
    GlobeAltIcon, VSCodeIcon, FigmaIcon, SlackIcon
} from '../components/Icons';

// --- HELPER COMPONENTS ---

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-dark-card rounded-3xl transition-all duration-300 hover:shadow-glow-cyan hover:-translate-y-1 ${className}`}>
        {children}
    </div>
);

const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
    if (!data || data.length < 2) return <div className="h-8 w-full"></div>;
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue === 0 ? 1 : maxValue - minValue;
    const points = data.map((value, index) => `${(index / (data.length - 1)) * 100},${100 - ((value - minValue) / range) * 90}`).join(' ');
    
    return (
        <div className="w-full h-8 mt-2">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                <polyline fill="none" stroke={color} strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
};


// --- WIDGET COMPONENTS ---

const UserProfileCard: React.FC = () => (
    <Card className="p-6 text-center">
        <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="Saiful Alam Rafi" className="w-36 h-36 rounded-3xl mx-auto" />
        <h3 className="text-xl font-bold mt-4">Saiful Alam Rafi</h3>
        <p className="text-light-gray text-sm">Founder/Admin</p>
        <div className="flex justify-center space-x-3 mt-4">
            <button className="w-12 h-12 flex items-center justify-center bg-dark-bg rounded-full hover:bg-mid-gray transition-colors">
                <PhoneIcon />
            </button>
            <button className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
                <EnvelopeIcon />
            </button>
        </div>
    </Card>
);

const timeTrackingData: TimeTrackingTask[] = [
    { name: 'Feature: User Authentication', time: '02:30:45', icon: <BriefcaseIcon />, isActive: true },
    { name: 'Bugfix: #582 - UI Glitch', time: '01:15:20', icon: <PencilIcon className="w-5 h-5" /> },
    { name: 'Code Review: PR #122', time: '00:45:10', icon: <CheckCircleIcon /> },
    { name: 'Team Meeting', time: '01:00:00', icon: <UsersIcon /> },
];

const TimeTracking: React.FC = () => {
    const [tasks, setTasks] = useState(timeTrackingData);

    const handleToggle = (taskName: string) => {
        setTasks(currentTasks => 
            currentTasks.map(task => 
                task.name === taskName 
                ? { ...task, isActive: !task.isActive } // Toggle clicked task
                : { ...task, isActive: false } // Deactivate others
            )
        );
    };

    return (
        <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Time Tracking</h3>
            <div className="space-y-3">
                {tasks.map(task => (
                    <div key={task.name} className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${task.isActive ? 'bg-dark-bg shadow-lg ring-1 ring-accent-cyan' : ''}`}>
                        <div className={`p-2 rounded-lg ${task.isActive ? 'text-accent-cyan' : 'text-light-gray'}`}>{task.icon}</div>
                        <div className="flex-grow">
                            <p className="font-semibold">{task.name}</p>
                            <p className="text-sm text-light-gray">{task.time}</p>
                        </div>
                        <button onClick={() => handleToggle(task.name)} className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${task.isActive ? 'bg-accent-cyan text-black' : 'bg-dark-bg text-white hover:bg-mid-gray'}`}>
                            {task.isActive ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const appUsageData: AppUsage[] = [
    { name: 'VS Code', icon: <VSCodeIcon className="w-8 h-8" />, time: '5h 30m', percentage: 55 },
    { name: 'Figma', icon: <FigmaIcon className="w-8 h-8" />, time: '2h 15m', percentage: 22 },
    { name: 'Slack', icon: <SlackIcon className="w-8 h-8" />, time: '1h 45m', percentage: 18 },
    { name: 'Browser', icon: <GlobeAltIcon className="w-8 h-8 text-gray-400" />, time: '0h 30m', percentage: 5 },
];

const AppUsage: React.FC = () => (
    <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">App Usage (Today)</h3>
        <div className="space-y-4">
            {appUsageData.map(app => (
                <div key={app.name} className="flex items-center space-x-4">
                    {app.icon}
                    <div className="flex-grow">
                        <div className="flex justify-between text-sm">
                            <span className="font-semibold">{app.name}</span>
                            <span className="text-light-gray">{app.time}</span>
                        </div>
                        <div className="w-full bg-dark-bg rounded-full h-1.5 mt-1">
                            <div className="bg-accent-purple h-1.5 rounded-full" style={{ width: `${app.percentage}%` }}></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);

const keyMetricsData: (KeyMetric & { trend: number[] })[] = [
    { id: 'revenue', label: 'Revenue', value: '৳405k', change: 12.3, icon: <DollarSignIcon className="w-6 h-6"/>, trend: [280, 310, 350, 320, 380, 390, 405] },
    { id: 'profit', label: 'Profit Margin', value: '25.4%', change: 5.1, icon: <ChartBarIcon className="w-6 h-6"/>, trend: [22.1, 23.5, 23.0, 24.1, 24.8, 25.1, 25.4] },
    { id: 'clients', label: 'New Clients', value: '12', change: -3, icon: <UsersIcon className="w-6 h-6"/>, trend: [15, 18, 14, 16, 13, 14, 12] },
    { id: 'completion', label: 'Project Completion', value: '92%', change: 2.5, icon: <BriefcaseIcon className="w-6 h-6"/>, trend: [85, 88, 87, 90, 89, 91, 92] },
];

const KeyMetrics: React.FC = () => (
    <Card className="p-6 col-span-2">
        <h3 className="font-bold text-lg mb-4">Key Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {keyMetricsData.map(metric => (
                <div key={metric.id} className="bg-dark-bg p-4 rounded-2xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-light-gray">
                            <span>{metric.label}</span>
                            {metric.icon}
                        </div>
                        <p className="text-2xl font-bold mt-2">{metric.value}</p>
                        <div className={`flex items-center text-sm mt-1 ${metric.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {metric.change > 0 ? <TrendingUpIcon className="w-4 h-4 mr-1"/> : <TrendingDownIcon className="w-4 h-4 mr-1"/>}
                            {Math.abs(metric.change)}%
                        </div>
                    </div>
                    <Sparkline data={metric.trend} color={metric.change > 0 ? '#34d399' : '#f87171'} />
                </div>
            ))}
        </div>
    </Card>
);

const upcomingDeadlinesData: UpcomingDeadline[] = [
    { id: 1, title: 'Deploy Staging - E-commerce', dueDate: '2024-09-28', daysLeft: 2 },
    { id: 2, title: 'Finalize Mobile UI Kit', dueDate: '2024-10-01', daysLeft: 5 },
    { id: 3, title: 'Client Demo - Analytics', dueDate: '2024-10-05', daysLeft: 9 },
];

const UpcomingDeadlines: React.FC = () => {
    const getUrgencyClasses = (daysLeft: number) => {
        if (daysLeft <= 3) return { bg: 'bg-red-500', text: 'text-red-400' };
        if (daysLeft <= 7) return { bg: 'bg-yellow-500', text: 'text-yellow-400' };
        return { bg: 'bg-mid-gray', text: 'text-light-gray' };
    };

    return (
        <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
                {upcomingDeadlinesData.map(deadline => {
                    const urgency = getUrgencyClasses(deadline.daysLeft);
                    return (
                        <div key={deadline.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-bg/50 transition-colors">
                            <span className={`w-2 h-2 rounded-full ${urgency.bg}`}></span>
                            <div className="flex-grow">
                                <p className="font-semibold">{deadline.title}</p>
                            </div>
                            <div className="text-right">
                                 <p className="text-sm text-light-gray">{deadline.dueDate}</p>
                                 <p className={`text-xs font-bold ${urgency.text}`}>{deadline.daysLeft} days left</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

const teamPerformanceData: TeamMemberPerformance[] = [
    { id: 1, name: 'John Smith', avatarUrl: 'https://picsum.photos/seed/user3/32/32', role: 'Developer', performance: 92 },
    { id: 2, name: 'Jane Doe', avatarUrl: 'https://picsum.photos/seed/user2/32/32', role: 'Manager', performance: 88 },
    { id: 3, name: 'Michael Brown', avatarUrl: 'https://picsum.photos/seed/user5/32/32', role: 'Developer', performance: 85 },
    { id: 4, name: 'Emily White', avatarUrl: 'https://picsum.photos/seed/user4/32/32', role: 'Designer', performance: 78 },
];

const TeamPerformance: React.FC = () => (
    <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Team Performance</h3>
        <div className="space-y-4">
            {teamPerformanceData.map(member => (
                <div key={member.id} className="flex items-center space-x-3">
                    <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full" />
                    <div className="flex-grow">
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-sm text-light-gray">{member.role}</p>
                    </div>
                    <div className="w-24 text-right">
                        <p className="font-bold text-sm">{member.performance}%</p>
                        <div className="w-full bg-dark-bg rounded-full h-1.5 mt-1">
                            <div className="bg-accent-cyan h-1.5 rounded-full" style={{ width: `${member.performance}%` }}></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);

const TasksOverview: React.FC = () => {
     const tasks: CalendarTask[] = [
        { id: 1, title: 'Team Sync', description: 'Check-in with team', startTime: 13, endTime: 14, day: 2, attendees: ['https://picsum.photos/seed/a/24/24', 'https://picsum.photos/seed/b/24/24', 'https://picsum.photos/seed/c/24/24'] },
        { id: 2, title: 'Component Review', description: 'Refactor shared components', startTime: 15, endTime: 16.5, day: 3, user: { name: 'M', avatarUrl: 'https://picsum.photos/seed/d/24/24' }},
        { id: 3, title: 'Bug Reproduction', description: 'Find and log UI bugs', startTime: 16, endTime: 17, day: 4, user: { name: 'P', avatarUrl: 'https://picsum.photos/seed/e/24/24' }},
    ];

    const days = ['Sun 15', 'Mon 16', 'Tue 17', 'Wed 18', 'Thu 19', 'Fri 20', 'Sat 21'];
    const hours = [12, 13, 14, 15, 16, 17, 18];

    return (
        <Card className="p-6 col-span-2 row-span-1 h-full flex flex-col">
            <h3 className="font-bold text-lg">Tasks overview</h3>
            <div className="grid grid-cols-7 text-center text-sm mt-4">
                {days.map((day, i) => (
                    <div key={day} className={`p-2 rounded-xl ${i === 3 ? 'bg-white text-black font-semibold' : 'text-light-gray'}`}>{day}</div>
                ))}
            </div>
            <div className="flex-grow flex mt-4">
                <div className="text-xs text-light-gray space-y-8 pr-4 text-right">
                    {hours.map(h => <div key={h}>{h}:00</div>)}
                </div>
                <div className="flex-grow grid grid-cols-7 relative border-l border-dark-border">
                    {Array.from({length: 7*7}).map((_, i) => (
                        <div key={i} className="h-12 border-b border-r border-dark-border"></div>
                    ))}
                    {/* Tasks */}
                    {tasks.map(task => {
                        const top = `${(task.startTime - 12) * 3}rem`;
                        const height = `${(task.endTime - task.startTime) * 3}rem`;
                        const left = `${(task.day / 7) * 100}%`;
                        const width = `${(1/7) * 100}%`;
                        return (
                            <div key={task.id} className="absolute p-2" style={{ top, height, left, width }}>
                                <div className="bg-dark-bg h-full rounded-xl p-2 text-xs flex flex-col justify-between hover:bg-dark-border transition-colors">
                                    <div>
                                        <p className="font-bold text-white">{task.title}</p>
                                        <p className="text-light-gray">{task.description}</p>
                                    </div>
                                    <div className="flex items-center justify-end -space-x-2">
                                        {task.attendees?.map(url => <img key={url} src={url} className="w-6 h-6 rounded-full border-2 border-dark-bg" />)}
                                        {task.user && <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold border-2 border-dark-bg">{task.user.name}</div> }
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Card>
    );
};

// --- MAIN DASHBOARD LAYOUT ---

export const DashboardPage: React.FC = () => {
    return (
        <div className="grid grid-cols-12 gap-6 mt-6 pb-6">
            {/* Left Column */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                <UserProfileCard />
                <TimeTracking />
                <AppUsage />
            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-9 grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-max">
                <KeyMetrics />
                <div className="lg:col-span-1"><UpcomingDeadlines /></div>
                <div className="lg:col-span-1"><TeamPerformance /></div>
                <div className="lg:col-span-2"><TasksOverview /></div>
            </div>
        </div>
    );
};