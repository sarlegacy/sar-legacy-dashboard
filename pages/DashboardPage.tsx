import React from 'react';
import type { CalendarTask, KeyMetric, RecentOrder, PortfolioAsset, ActiveTrade, TeamMemberPerformance } from '../types';
import { 
    PhoneIcon, EnvelopeIcon, ThreeDotsIcon,
    DollarSignIcon, ChartBarIcon, UsersIcon, BriefcaseIcon, TrendingUpIcon, 
    TrendingDownIcon, BitcoinIcon, EthereumIcon, ArrowUpRightIcon, ArrowDownLeftIcon
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

const recentOrdersData: RecentOrder[] = [
    { id: 'ORD001', customerName: 'John Doe', avatarUrl: 'https://picsum.photos/seed/jd/32/32', date: '2 min ago', amount: 149.99, status: 'Completed' },
    { id: 'ORD002', customerName: 'Jane Smith', avatarUrl: 'https://picsum.photos/seed/js/32/32', date: '15 min ago', amount: 49.50, status: 'Pending' },
    { id: 'ORD003', customerName: 'Mike Johnson', avatarUrl: 'https://picsum.photos/seed/mj/32/32', date: '1 hour ago', amount: 305.00, status: 'Completed' },
    { id: 'ORD004', customerName: 'Emily Davis', avatarUrl: 'https://picsum.photos/seed/ed/32/32', date: '3 hours ago', amount: 75.20, status: 'Cancelled' },
];

const RecentOrders: React.FC = () => {
    const getStatusColor = (status: RecentOrder['status']) => {
        switch (status) {
            case 'Completed': return 'bg-green-500';
            case 'Pending': return 'bg-yellow-500';
            case 'Cancelled': return 'bg-red-500';
        }
    };

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Recent Orders</h3>
                <button><ThreeDotsIcon className="text-light-gray" /></button>
            </div>
            <div className="space-y-4 mt-4">
                {recentOrdersData.map(order => (
                    <div key={order.id} className="flex items-center space-x-4 p-2 rounded-lg -m-2 hover:bg-dark-bg/50 transition-colors">
                        <img src={order.avatarUrl} alt={order.customerName} className="w-10 h-10 rounded-full" />
                        <div className="flex-grow">
                            <p className="font-semibold">{order.customerName} <span className="text-light-gray font-normal">({order.id})</span></p>
                            <p className="text-sm text-light-gray">{order.date}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold">৳{order.amount.toFixed(2)}</p>
                            <div className="flex items-center justify-end space-x-2">
                                <span className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></span>
                                <p className="text-xs text-light-gray">{order.status}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const p2pPortfolioData: PortfolioAsset[] = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: <BitcoinIcon className="w-8 h-8 text-yellow-500" />, amount: 1.25, valueUSD: 85031.25, change: 2.5 },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: <EthereumIcon className="w-8 h-8 text-gray-400" />, amount: 15.8, valueUSD: 55456.40, change: -1.2 },
];

const P2PPortfolio: React.FC = () => (
    <Card className="p-6">
        <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">P2P Portfolio</h3>
            <span className="text-sm font-semibold bg-dark-bg px-3 py-1 rounded-full">৳140,487.65</span>
        </div>
        <div className="space-y-4 mt-4">
            {p2pPortfolioData.map(asset => (
                <div key={asset.id} className="flex items-center space-x-4">
                    {asset.icon}
                    <div className="flex-grow">
                        <p className="font-bold">{asset.name}</p>
                        <p className="text-sm text-light-gray">{asset.amount} {asset.symbol}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">৳{asset.valueUSD.toLocaleString()}</p>
                        <div className={`flex items-center justify-end text-xs ${asset.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                           {asset.change > 0 ? <TrendingUpIcon className="w-3 h-3 mr-1"/> : <TrendingDownIcon className="w-3 h-3 mr-1"/>}
                           {Math.abs(asset.change)}%
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);

const activeTradesData: ActiveTrade[] = [
    { id: 'T01', type: 'Buy', assetSymbol: 'BTC', assetIcon: <BitcoinIcon className="w-6 h-6 text-yellow-500" />, amount: 0.1, price: 68000, user: 'CryptoKing' },
    { id: 'T02', type: 'Sell', assetSymbol: 'ETH', assetIcon: <EthereumIcon className="w-6 h-6 text-gray-400" />, amount: 2.5, price: 3500, user: 'EtherTrader' },
    { id: 'T03', type: 'Buy', assetSymbol: 'BTC', assetIcon: <BitcoinIcon className="w-6 h-6 text-yellow-500" />, amount: 0.05, price: 68150, user: 'NewUser123' },
];

const ActiveTrades: React.FC = () => (
    <Card className="p-6">
        <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Active P2P Trades</h3>
            <button><ThreeDotsIcon className="text-light-gray" /></button>
        </div>
        <div className="space-y-3 mt-4">
            {activeTradesData.map(trade => (
                <div key={trade.id} className="flex items-center space-x-3 bg-dark-bg p-3 rounded-xl">
                     <div className={`p-2 rounded-full ${trade.type === 'Buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {trade.type === 'Buy' ? <ArrowDownLeftIcon className="w-5 h-5" /> : <ArrowUpRightIcon className="w-5 h-5" />}
                    </div>
                    {trade.assetIcon}
                    <div className="flex-grow">
                        <p className="font-semibold">{trade.type} {trade.amount} {trade.assetSymbol}</p>
                        <p className="text-sm text-light-gray">@ ৳{trade.price.toLocaleString()} with {trade.user}</p>
                    </div>
                    <button className="text-sm bg-accent-cyan text-black font-semibold px-4 py-2 rounded-lg hover:bg-accent-cyan-light transition-colors">
                        View
                    </button>
                </div>
            ))}
        </div>
    </Card>
);

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
                <P2PPortfolio />
            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-9 grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-max">
                <KeyMetrics />
                <div className="lg:col-span-1"><RecentOrders /></div>
                <div className="lg:col-span-1"><ActiveTrades /></div>
                <div className="lg:col-span-2"><TeamPerformance /></div>
                <div className="lg:col-span-2"><TasksOverview /></div>
            </div>
        </div>
    );
};