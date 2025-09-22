import React from 'react';
import { EcomStat, RecentOrder, TopProduct } from '../types';
import { DollarSignIcon, ShoppingCartIcon, UsersIcon, TrendingUpIcon, TrendingDownIcon, CubeIcon } from '../components/Icons';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-dark-card rounded-3xl p-6 transition-all duration-300 hover:shadow-glow-cyan hover:-translate-y-1 ${className}`}>
        {children}
    </div>
);

const SalesChart: React.FC<{ data: { day: string; sales: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.sales));
    const points = data.map((item, index) => `${(index / (data.length - 1)) * 100},${100 - (item.sales / maxValue) * 90}`).join(' ');

    return (
        <div className="w-full h-72 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="salesGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#71E6E9" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#71E6E9" stopOpacity="0"/>
                    </linearGradient>
                </defs>
                <polyline fill="url(#salesGradient)" points={`0,100 ${points} 100,100`} stroke="none" />
                <polyline fill="none" stroke="#71E6E9" strokeWidth="2" points={points} />
            </svg>
            <div className="absolute bottom-0 w-full flex justify-around text-xs text-light-gray">
                {data.map(item => <span key={item.day}>{item.day}</span>)}
            </div>
        </div>
    );
};

const salesOverTimeData = [
    { day: 'Mon', sales: 12500 },
    { day: 'Tue', sales: 15200 },
    { day: 'Wed', sales: 13800 },
    { day: 'Thu', sales: 19400 },
    { day: 'Fri', sales: 22100 },
    { day: 'Sat', sales: 25600 },
    { day: 'Sun', sales: 23900 },
];

const statsData: EcomStat[] = [
    { label: 'Total Sales', value: '৳128,495', change: 15.2, icon: <DollarSignIcon className="w-7 h-7" /> },
    { label: 'Total Orders', value: '8,321', change: 8.5, icon: <ShoppingCartIcon className="w-7 h-7" /> },
    { label: 'New Customers', value: '432', change: -2.1, icon: <UsersIcon className="w-7 h-7" /> },
];

const topProductsData: TopProduct[] = [
    { id: 'P001', name: 'Quantum Laptop X', imageUrl: 'https://picsum.photos/seed/laptop/64/64', sales: 1245 },
    { id: 'P002', name: 'Nova Smartwatch', imageUrl: 'https://picsum.photos/seed/watch/64/64', sales: 982 },
    { id: 'P003', name: 'Aura Headphones', imageUrl: 'https://picsum.photos/seed/headphones/64/64', sales: 765 },
];

const recentOrdersData: RecentOrder[] = [
    { id: 'ORD551', customerName: 'Liam Johnson', avatarUrl: 'https://picsum.photos/seed/liam/32/32', date: '5 min ago', amount: 250.00, status: 'Pending', product: 'Quantum Laptop X' },
    { id: 'ORD550', customerName: 'Olivia Smith', avatarUrl: 'https://picsum.photos/seed/olivia/32/32', date: '25 min ago', amount: 120.50, status: 'Completed', product: 'Aura Headphones' },
    { id: 'ORD549', customerName: 'Noah Brown', avatarUrl: 'https://picsum.photos/seed/noah/32/32', date: '1 hour ago', amount: 89.99, status: 'Completed', product: 'Nova Smartwatch' },
    { id: 'ORD548', customerName: 'Emma Wilson', avatarUrl: 'https://picsum.photos/seed/emma/32/32', date: '3 hours ago', amount: 35.00, status: 'Cancelled', product: 'USB-C Cable' },
    { id: 'ORD547', customerName: 'James Taylor', avatarUrl: 'https://picsum.photos/seed/james/32/32', date: '5 hours ago', amount: 499.00, status: 'Completed', product: 'Quantum Laptop X' },
];

const StatCard: React.FC<{ stat: EcomStat }> = ({ stat }) => (
    <div className="bg-dark-bg p-5 rounded-2xl flex items-start justify-between transition-all duration-300 hover:shadow-glow-purple hover:-translate-y-1">
        <div>
            <p className="text-light-gray">{stat.label}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
            <div className={`flex items-center text-sm mt-1 ${stat.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change > 0 ? <TrendingUpIcon className="w-4 h-4 mr-1"/> : <TrendingDownIcon className="w-4 h-4 mr-1"/>}
                {Math.abs(stat.change)}% vs last month
            </div>
        </div>
        <div className="text-accent-cyan-light">{stat.icon}</div>
    </div>
);

const getStatusChip = (status: RecentOrder['status']) => {
    switch (status) {
        case 'Completed': return <span className="px-2 py-1 text-xs font-semibold text-green-300 bg-green-500/20 rounded-full">Completed</span>;
        case 'Pending': return <span className="px-2 py-1 text-xs font-semibold text-yellow-300 bg-yellow-500/20 rounded-full">Pending</span>;
        case 'Cancelled': return <span className="px-2 py-1 text-xs font-semibold text-red-300 bg-red-500/20 rounded-full">Cancelled</span>;
    }
};

export const EcommercePage: React.FC = () => {
    return (
        <div className="mt-6 pb-6">
            <h1 className="text-2xl font-bold">E-commerce Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {statsData.map(stat => <StatCard key={stat.label} stat={stat} />)}
            </div>

            <Card className="mt-6">
                <h2 className="font-bold text-lg mb-2">Sales Over Time</h2>
                <SalesChart data={salesOverTimeData} />
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                    <Card>
                        <h2 className="font-bold text-lg mb-4">Recent Orders</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-dark-border">
                                        <th className="p-3 text-sm font-semibold text-light-gray">Order ID</th>
                                        <th className="p-3 text-sm font-semibold text-light-gray">Customer</th>
                                        <th className="p-3 text-sm font-semibold text-light-gray">Product</th>
                                        <th className="p-3 text-sm font-semibold text-light-gray">Amount</th>
                                        <th className="p-3 text-sm font-semibold text-light-gray">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrdersData.map(order => (
                                        <tr key={order.id} className="border-b border-dark-border/50 hover:bg-dark-bg transition-colors">
                                            <td className="p-3 font-mono text-sm">{order.id}</td>
                                            <td className="p-3">
                                                <div className="flex items-center space-x-3">
                                                    <img src={order.avatarUrl} alt={order.customerName} className="w-8 h-8 rounded-full" />
                                                    <span>{order.customerName}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-sm">{order.product}</td>
                                            <td className="p-3 font-semibold">৳{order.amount.toFixed(2)}</td>
                                            <td className="p-3">{getStatusChip(order.status)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                <Card>
                    <h2 className="font-bold text-lg mb-4">Top Products</h2>
                    <div className="space-y-4">
                        {topProductsData.map(product => (
                            <div key={product.id} className="flex items-center space-x-4 p-2 rounded-lg -m-2 hover:bg-dark-bg/50 transition-colors">
                                <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg bg-dark-bg p-1" />
                                <div className="flex-grow">
                                    <p className="font-semibold">{product.name}</p>
                                    <p className="text-sm text-light-gray">{product.sales.toLocaleString()} units sold</p>
                                </div>
                                <div className="p-2 bg-dark-bg rounded-full text-accent-cyan">
                                    <CubeIcon className="w-5 h-5" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};