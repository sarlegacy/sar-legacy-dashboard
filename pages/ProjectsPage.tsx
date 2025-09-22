
import React, { useState } from 'react';
import type { Project } from '../types';
import { PlusIcon, ThreeDotsIcon, ViewGridIcon, ViewColumnsIcon, CheckCircleIcon, CalendarIcon } from '../components/Icons';

const mockProjectsData: Project[] = [
    {
        id: 'PROJ-001', name: 'E-commerce Platform Relaunch', client: 'Client A', deadline: '2024-10-15', progress: 75, status: 'In Progress', team: ['https://picsum.photos/seed/p1/32/32', 'https://picsum.photos/seed/p2/32/32', 'https://picsum.photos/seed/p3/32/32'],
        statusSummary: 'Frontend development is on track. Awaiting final payment gateway integration details from the client.',
        milestones: [
            { name: 'UI/UX Design Complete', completed: true, date: '2024-08-20' },
            { name: 'Frontend Scaffolding', completed: true, date: '2024-09-05' },
            { name: 'Backend API Development', completed: true, date: '2024-09-25' },
            { name: 'Payment Gateway Integration', completed: false, date: '2024-10-05' },
            { name: 'Final UAT', completed: false, date: '2024-10-12' },
        ],
        upcomingDeadlines: [
            { task: 'Submit integration proposal', dueDate: '2024-09-30' },
            { task: 'Deploy to staging', dueDate: '2024-10-08' },
        ]
    },
    {
        id: 'PROJ-002', name: 'Mobile App Development', client: 'Client B', deadline: '2024-09-30', progress: 40, status: 'In Progress', isAtRisk: true, team: ['https://picsum.photos/seed/p4/32/32', 'https://picsum.photos/seed/p5/32/32'],
        statusSummary: 'Team is facing unexpected issues with a third-party library, causing a delay. Awaiting a patch.',
        milestones: [
            { name: 'Wireframes Approved', completed: true, date: '2024-08-15' },
            { name: 'Core Features Implemented', completed: false, date: '2024-09-10' },
            { name: 'Alpha Testing', completed: false, date: '2024-09-20' },
        ],
        upcomingDeadlines: [
             { task: 'Resolve library conflict', dueDate: '2024-09-28' },
        ]
    },
    {
        id: 'PROJ-003', name: 'Data Analytics Dashboard', client: 'Internal', deadline: '2024-08-25', progress: 100, status: 'Completed', team: ['https://picsum.photos/seed/p6/32/32', 'https://picsum.photos/seed/p7/32/32', 'https://picsum.photos/seed/p8/32/32'],
        statusSummary: 'Project successfully deployed. Monitoring performance and gathering user feedback.',
        milestones: [
            { name: 'Data Source Connection', completed: true, date: '2024-07-20' },
            { name: 'Visualization Component Dev', completed: true, date: '2024-08-10' },
            { name: 'Deployment', completed: true, date: '2024-08-22' },
        ],
    },
    {
        id: 'PROJ-004', name: 'Marketing Website Update', client: 'Client C', deadline: '2024-11-01', progress: 15, status: 'Backlog', team: ['https://picsum.photos/seed/p9/32/32'],
        statusSummary: 'Project is on hold pending new marketing copy from the client.',
    },
    {
        id: 'PROJ-005', name: 'API Integration', client: 'Client A', deadline: '2024-10-20', progress: 60, status: 'In Review', team: ['https://picsum.photos/seed/p10/32/32', 'https://picsum.photos/seed/p11/32/32'],
        statusSummary: 'Core integration logic is complete and submitted for review by the client\'s technical team.',
        milestones: [
            { name: 'Authentication Layer', completed: true, date: '2024-09-10' },
            { name: 'Data Sync Logic', completed: true, date: '2024-09-22' },
            { name: 'Client Review', completed: false, date: '2024-10-01' },
        ],
    },
    {
        id: 'PROJ-006', name: 'Initial Design Mockups', client: 'Client D', deadline: '2024-11-15', progress: 0, status: 'Backlog', team: ['https://picsum.photos/seed/p12/32/32'],
        statusSummary: 'Scheduled to start after the current sprint ends.',
        upcomingDeadlines: [
            { task: 'Kick-off meeting', dueDate: '2024-10-25' },
        ]
    },
];

type ProjectStatus = Project['status'];

const getStatusColor = (status: ProjectStatus) => {
    switch(status) {
        case 'Backlog': return 'text-gray-400 bg-gray-500/20';
        case 'In Progress': return 'text-blue-400 bg-blue-500/20';
        case 'In Review': return 'text-purple-400 bg-purple-500/20';
        case 'Completed': return 'text-green-400 bg-green-500/20';
        default: return 'text-gray-400 bg-gray-500/20';
    }
};

const getProgressColor = (progress: number, isAtRisk?: boolean) => {
    if (isAtRisk) return 'bg-red-500';
    if (progress < 50) return 'bg-yellow-500';
    if (progress < 99) return 'bg-accent-cyan';
    return 'bg-green-500';
}

const ProjectStatusChart: React.FC<{ projects: Project[] }> = ({ projects }) => {
    const statusCounts = projects.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
    }, {} as Record<ProjectStatus, number>);

    const data = [
        { label: 'Backlog', value: statusCounts['Backlog'] || 0, color: '#9CA3AF' },
        { label: 'In Progress', value: statusCounts['In Progress'] || 0, color: '#60A5FA' },
        { label: 'In Review', value: statusCounts['In Review'] || 0, color: '#c084fc' },
        { label: 'Completed', value: statusCounts['Completed'] || 0, color: '#4ADE80' },
    ];

    const total = projects.length;
    let cumulative = 0;

    return (
        <div className="bg-dark-card rounded-2xl p-3 flex items-center gap-4">
            <div className="relative w-20 h-20">
                 <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    {data.map((item) => {
                        const dasharray = total > 0 ? (item.value / total) * 100 : 0;
                        const dashoffset = cumulative;
                        cumulative += dasharray;
                        return (
                            <circle key={item.label} cx="18" cy="18" r="15.9" fill="transparent" stroke={item.color} strokeWidth="3" strokeDasharray={`${dasharray} 100`} strokeDashoffset={-dashoffset} />
                        );
                    })}
                </svg>
                 <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xl font-bold">{total}</span>
                    <span className="text-xs text-light-gray">Total</span>
                </div>
            </div>
             <div className="space-y-1 text-xs">
                {data.map(item => (
                     <div key={item.label} className="flex items-center gap-2">
                         <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                         <span>{item.label} ({item.value})</span>
                     </div>
                ))}
            </div>
        </div>
    );
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <div className="bg-dark-card rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-glow-cyan hover:-translate-y-1">
        <div>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-light-gray">{project.client} / {project.id}</p>
                    <h3 className="text-lg font-bold mt-1">{project.name}</h3>
                </div>
                <button className="text-light-gray hover:text-white"><ThreeDotsIcon /></button>
            </div>

            {project.statusSummary && (
                <p className="text-sm text-light-gray mt-4 border-l-2 border-accent-cyan pl-3">{project.statusSummary}</p>
            )}

            {project.milestones && project.milestones.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-xs font-bold uppercase text-light-gray mb-2">Milestones</h4>
                    <div className="space-y-2 text-sm">
                        {project.milestones.map((milestone, index) => (
                            <div key={index} className={`flex items-center gap-3 p-2 -m-2 rounded-lg ${milestone.completed ? 'text-light-gray line-through' : 'text-gray-200'}`}>
                                {milestone.completed ? <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" /> : <div className="w-5 h-5 border-2 border-mid-gray rounded-full shrink-0"></div>}
                                <span className="flex-grow">{milestone.name}</span>
                                <span className="text-xs ml-auto shrink-0">{milestone.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-4">
                <div className="flex justify-between items-center text-sm">
                    <p>Progress</p>
                    <p className="font-semibold">{project.progress}%</p>
                </div>
                <div className="w-full bg-dark-bg rounded-full h-2 mt-2">
                    <div className={`${getProgressColor(project.progress, project.isAtRisk)} h-2 rounded-full`} style={{ width: `${project.progress}%` }}></div>
                </div>
            </div>
        </div>
        <div className="flex justify-between items-end mt-6">
            <div>
                <p className={`text-xs px-2 py-1 rounded-full font-semibold inline-block ${getStatusColor(project.status)}`}>{project.status}</p>
                 <div className="flex -space-x-3 mt-3">
                    {project.team.map((src, index) => (
                        <img key={index} src={src} alt={`Team member ${index + 1}`} className="w-8 h-8 rounded-full border-2 border-dark-card" />
                    ))}
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm text-light-gray">Deadline</p>
                <p className="font-semibold">{project.deadline}</p>
            </div>
        </div>
    </div>
);


// --- Kanban Board Components ---
const KanbanCard: React.FC<{ project: Project }> = ({ project }) => {
    const completedMilestones = project.milestones?.filter(m => m.completed).length || 0;
    const totalMilestones = project.milestones?.length || 0;
    const nextDeadline = project.upcomingDeadlines?.[0];

    return (
        <div 
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData("projectId", project.id);
                e.currentTarget.classList.add('opacity-50');
            }}
            onDragEnd={(e) => e.currentTarget.classList.remove('opacity-50')}
            className="bg-dark-bg rounded-2xl p-4 mb-4 cursor-grab active:cursor-grabbing"
        >
            <h4 className="font-bold">{project.name}</h4>
            <p className="text-xs text-light-gray mt-1">{project.client} / {project.id}</p>

            {project.statusSummary && (
                <p className="text-xs text-light-gray mt-2 leading-relaxed">{project.statusSummary}</p>
            )}

            <div className="w-full bg-dark-card rounded-full h-1.5 mt-3">
                <div className={`${getProgressColor(project.progress, project.isAtRisk)} h-1.5 rounded-full`} style={{ width: `${project.progress}%` }}></div>
            </div>
            <div className="flex justify-between items-center mt-3">
                <div className="flex -space-x-2">
                    {project.team.map((src, index) => (
                        <img key={index} src={src} alt={`Team member ${index + 1}`} className="w-6 h-6 rounded-full border border-dark-bg" />
                    ))}
                </div>
                <div className="flex items-center gap-3 text-xs text-light-gray">
                    {totalMilestones > 0 && (
                        <div className="flex items-center gap-1" title={`${completedMilestones}/${totalMilestones} milestones completed`}>
                            <CheckCircleIcon className="w-4 h-4 text-green-500"/>
                            <span>{completedMilestones}/{totalMilestones}</span>
                        </div>
                    )}
                    {nextDeadline && (
                        <div className="flex items-center gap-1" title={`Next deadline: ${nextDeadline.task}`}>
                            <CalendarIcon className="w-4 h-4 text-yellow-500"/>
                            <span>{nextDeadline.dueDate}</span>
                        </div>
                    )}
                </div>
            </div>
            {project.isAtRisk && <div className="mt-2 text-xs font-semibold text-red-400 bg-red-500/10 px-2 py-1 rounded inline-block">At Risk</div>}
        </div>
    );
};

const KanbanColumn: React.FC<{ 
    status: ProjectStatus; 
    projects: Project[]; 
    onDrop: (projectId: string, status: ProjectStatus) => void 
}> = ({ status, projects, onDrop }) => {
    const [isOver, setIsOver] = useState(false);
    
    const getStatusIndicatorColor = (status: ProjectStatus) => {
        const colors: Record<ProjectStatus, string> = {
            'Backlog': 'bg-gray-400',
            'In Progress': 'bg-blue-400',
            'In Review': 'bg-accent-purple',
            'Completed': 'bg-green-400',
        };
        return colors[status];
    };

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
            onDragEnter={() => setIsOver(true)}
            onDragLeave={() => setIsOver(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsOver(false);
                const projectId = e.dataTransfer.getData("projectId");
                if (projectId) {
                    onDrop(projectId, status);
                }
            }}
            className={`w-80 shrink-0 bg-dark-card rounded-2xl p-4 transition-colors duration-300 ${isOver ? 'bg-dark-border' : ''}`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${getStatusIndicatorColor(status)}`}></span>
                    <h3 className="font-bold">{status}</h3>
                </div>
                <span className="text-sm font-semibold text-light-gray bg-dark-bg px-2 py-0.5 rounded-md">{projects.length}</span>
            </div>
            <div className={`space-y-4 h-[calc(100vh-20rem)] overflow-y-auto pr-1 border-2 border-dashed rounded-lg transition-colors ${isOver ? 'border-accent-cyan' : 'border-transparent'}`}>
                {projects.map(project => <KanbanCard key={project.id} project={project} />)}
            </div>
        </div>
    );
};

// --- Main Page ---
export const ProjectsPage: React.FC = () => {
    const [view, setView] = useState<'card' | 'kanban'>('card');
    const [projects, setProjects] = useState<Project[]>(mockProjectsData);

    const handleDrop = (projectId: string, newStatus: ProjectStatus) => {
        const projectToMove = projects.find(p => p.id === projectId);
        if (projectToMove && projectToMove.status !== newStatus) {
            setProjects(prevProjects => 
                prevProjects.map(p => p.id === projectId ? { ...p, status: newStatus } : p)
            );
        }
    };

    const columns: ProjectStatus[] = ['Backlog', 'In Progress', 'In Review', 'Completed'];

    return (
        <div className="mt-6 pb-6">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <h1 className="text-2xl font-bold">Projects Overview</h1>
                <div className="flex items-center gap-4 w-full xl:w-auto">
                    {view === 'card' && <ProjectStatusChart projects={projects} />}
                    <div className="flex items-center gap-2 p-1 bg-dark-card rounded-xl w-full md:w-auto">
                        <button onClick={() => setView('card')} className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors flex-1 md:flex-initial ${view === 'card' ? 'bg-white text-black' : 'hover:bg-dark-bg'}`}>
                            <ViewGridIcon /> Card View
                        </button>
                        <button onClick={() => setView('kanban')} className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors flex-1 md:flex-initial ${view === 'kanban' ? 'bg-white text-black' : 'hover:bg-dark-bg'}`}>
                            <ViewColumnsIcon /> Kanban View
                        </button>
                    </div>
                    <button className="bg-white text-black font-semibold px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors flex items-center space-x-2 shrink-0">
                        <PlusIcon />
                        <span>New Project</span>
                    </button>
                </div>
            </div>

            {view === 'card' ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
                    {projects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <div className="mt-4 flex gap-6 overflow-x-auto pb-4">
                    {columns.map(status => (
                        <KanbanColumn 
                            key={status}
                            status={status}
                            projects={projects.filter(p => p.status === status)}
                            onDrop={handleDrop}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
