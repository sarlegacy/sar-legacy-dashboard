import React, { useState, useEffect, useRef } from 'react';
import { TrendingUpIcon, UsersIcon, CubeIcon, MapPinIcon, FaceSmileIcon } from '../components/Icons';

// Fix: Replaced JSX.Element with React.ReactNode to avoid namespace errors.
const Card: React.FC<{ children: React.ReactNode; className?: string; title: string; icon: React.ReactNode; }> = ({ children, className = '', title, icon }) => (
    <div className={`bg-dark-card rounded-3xl p-6 transition-all duration-300 hover:shadow-glow-cyan hover:-translate-y-1 ${className}`}>
        <h2 className="text-lg font-bold mb-4 flex items-center">
            <span className="mr-3 text-accent-cyan">{icon}</span>
            {title}
        </h2>
        {children}
    </div>
);

// --- Chart Components ---

const BarChart: React.FC<{ data: { label: string; value: number }[]; color: string }> = ({ data, color }) => {
    const [animate, setAnimate] = useState(false);
    const maxValue = Math.max(...data.map(d => d.value));

    useEffect(() => {
        const timer = setTimeout(() => setAnimate(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full h-64 flex items-end justify-around space-x-2 p-4">
            {data.map((item, index) => (
                <div key={item.label} className="flex-1 flex flex-col items-center">
                    <div 
                        className="w-full rounded-t-md" 
                        style={{ 
                            height: animate ? `${(item.value / maxValue) * 100}%` : '0%',
                            backgroundColor: color,
                            transition: `height 0.5s ease-out ${index * 50}ms`
                        }}
                    ></div>
                    <span className="text-xs text-light-gray mt-2">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

const LineChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
    const [animate, setAnimate] = useState(false);
    const pathRef = useRef<SVGPolylineElement>(null);
    const [pathLength, setPathLength] = useState(0);

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
        const timer = setTimeout(() => setAnimate(true), 100);
        return () => clearTimeout(timer);
    }, [data]);

    const maxValue = Math.max(...data);
    const points = data.map((value, index) => `${(index / (data.length - 1)) * 100},${100 - (value / maxValue) * 90}`).join(' ');

    return (
         <div className="w-full h-64 p-4">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                <polyline
                    ref={pathRef}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                    strokeDasharray={pathLength}
                    strokeDashoffset={animate ? 0 : pathLength}
                    style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
                />
            </svg>
        </div>
    );
};

const DonutChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    const [animate, setAnimate] = useState(false);
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulative = 0;

    useEffect(() => {
        const timer = setTimeout(() => setAnimate(true), 100);
        return () => clearTimeout(timer);
    }, []);


    return (
        <div className="flex items-center justify-center gap-8">
            <div className="relative w-48 h-48">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    {data.map((item, index) => {
                        const dasharray = (item.value / total) * 100;
                        const dashoffset = cumulative;
                        cumulative += dasharray;
                        return (
                            <circle
                                key={item.label}
                                cx="18" cy="18" r="15.9"
                                fill="transparent"
                                stroke={item.color}
                                strokeWidth="4"
                                strokeDasharray={animate ? `${dasharray} 100` : `0 100`}
                                strokeDashoffset={-dashoffset}
                                style={{
                                    transition: `stroke-dasharray 0.8s cubic-bezier(0.25, 1, 0.5, 1)`,
                                    transitionDelay: `${index * 100}ms`
                                }}
                            />
                        );
                    })}
                </svg>
                 <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold">{total.toLocaleString()}</span>
                    <span className="text-sm text-light-gray">Total Sales</span>
                </div>
            </div>
            <div className="space-y-2 text-sm">
                {data.map(item => (
                     <div key={item.label} className="flex items-center gap-2">
                         <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                         <span>{item.label} ({((item.value/total)*100).toFixed(0)}%)</span>
                     </div>
                ))}
            </div>
        </div>
    );
};

const HorizontalBarChart: React.FC<{ data: { label: string; value: number }[]; color: string }> = ({ data, color }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
        <div className="w-full h-64 p-4 space-y-3">
            {data.map(item => (
                <div key={item.label} className="flex items-center">
                    <span className="w-24 text-sm text-light-gray">{item.label}</span>
                    <div className="flex-1 bg-dark-bg rounded-full h-4">
                        <div
                            className="h-4 rounded-full"
                            style={{
                                width: `${(item.value / maxValue) * 100}%`,
                                backgroundColor: color,
                                transition: 'width 0.5s ease-out'
                            }}
                        ></div>
                    </div>
                    <span className="w-16 text-right font-semibold text-sm ml-2">{item.value.toLocaleString()}</span>
                </div>
            ))}
        </div>
    );
};

const GaugeChart: React.FC<{ value: number; maxValue: number; color: string }> = ({ value, maxValue, color }) => {
    const percentage = value / maxValue;
    const rotation = percentage * 180; // 180 degrees for a semi-circle
    return (
        <div className="w-full h-64 flex items-center justify-center relative">
            <div className="relative w-64 h-32 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[200%] border-8 border-dark-border rounded-full transform -translate-y-1/2"></div>
                <div className="absolute top-0 left-0 w-full h-[200%] border-8 border-transparent rounded-full transform -translate-y-1/2" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'}}>
                     <div 
                        className="absolute top-0 left-0 w-full h-full border-8 rounded-full"
                        style={{ 
                            borderColor: color,
                            transform: `rotate(${rotation}deg)`,
                            transition: 'transform 1s ease-out'
                         }}
                     ></div>
                </div>
            </div>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{value}%</span>
                <span className="text-sm text-light-gray">Satisfied</span>
            </div>
        </div>
    );
};

// --- Page Data ---

const revenueData = [
    { label: 'Apr', value: 18000 }, { label: 'May', value: 25000 }, { label: 'Jun', value: 42000 },
    { label: 'Jul', value: 35000 }, { label: 'Aug', value: 55000 }, { label: 'Sep', value: 48000 },
];

const userGrowthData = [120, 150, 145, 180, 210, 250, 230, 280, 310];

const salesByCategoryData = [
    { label: 'Electronics', value: 45000, color: '#71E6E9' },
    { label: 'Apparel', value: 28000, color: '#A1F0F2' },
    { label: 'Accessories', value: 15000, color: '#4B5563' },
];

const salesByRegionData = [
    { label: 'Americas', value: 125000 },
    { label: 'Europe', value: 98000 },
    { label: 'Asia', value: 76000 },
    { label: 'Oceania', value: 42000 },
];

const customerSatisfactionData = 89;

export const StatisticsPage: React.FC = () => {
    return (
        <div className="mt-6 pb-6">
            <h1 className="text-2xl font-bold">Business Statistics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <Card title="Monthly Revenue" icon={<TrendingUpIcon />}>
                    <BarChart data={revenueData} color="#71E6E9" />
                </Card>
                <Card title="User Growth" icon={<UsersIcon />}>
                    <LineChart data={userGrowthData} color="#A1F0F2" />
                </Card>
                <Card title="Sales by Region" icon={<MapPinIcon />}>
                    <HorizontalBarChart data={salesByRegionData} color="#c084fc" />
                </Card>
                <Card title="Customer Satisfaction" icon={<FaceSmileIcon />}>
                    <GaugeChart value={customerSatisfactionData} maxValue={100} color="#71E6E9" />
                </Card>
                 <div className="lg:col-span-2">
                    <Card title="Sales by Category" icon={<CubeIcon />}>
                       <DonutChart data={salesByCategoryData} />
                    </Card>
                </div>
            </div>
        </div>
    );
};