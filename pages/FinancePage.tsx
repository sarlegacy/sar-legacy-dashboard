import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    DollarSignIcon, TrendingUpIcon, TrendingDownIcon, BriefcaseIcon, BuildingIcon, PlusIcon, GiftIcon,
    DownloadIcon, XMarkIcon, PencilIcon, TrashIcon, ShareIcon, MailIcon, DocumentTextIcon, CalendarDaysIcon, 
    ShoppingCartIcon, CubeIcon, HomeIcon, UsersIcon, ChartBarIcon, TagIcon
} from '../components/Icons';
import { FinancialGoal, Invoice, RecurringTransaction } from '../types';

// --- Types ---
interface FinanceMetric {
    label: string;
    value: string;
    change?: number;
    // Fix: Replaced JSX.Element with React.ReactNode to avoid namespace errors.
    icon: React.ReactNode;
}

interface Transaction {
    id: string;
    description: string;
    date: string;
    amount: number;
    status: 'Completed' | 'Pending';
    category?: string;
}

interface Bill {
    id: string;
    name: string;
    dueDate: string;
    amount: number;
}

interface SpendingCategory {
    label: string;
    value: number;
    color: string;
    // Fix: Replaced JSX.Element with React.ReactNode to avoid namespace errors.
    icon: React.ReactNode;
}

type FinanceMode = 'personal' | 'business';

// --- MOCK DATA ---

const personalMetricsData: FinanceMetric[] = [
    { label: 'Net Worth', value: '৳258,430', change: 3.2, icon: <DollarSignIcon className="w-7 h-7" /> },
    { label: 'Savings', value: '৳55,120', change: 5.1, icon: <TrendingUpIcon className="w-7 h-7 text-green-400" /> },
    { label: 'Monthly Expenses', value: '৳4,350', change: -1.5, icon: <TrendingDownIcon className="w-7 h-7 text-red-400" /> },
    { label: 'Investments', value: '৳112,910', change: 8.7, icon: <BriefcaseIcon className="w-7 h-7" /> },
];

const initialPersonalTransactionsData: Transaction[] = [
    { id: 'PT001', description: 'Salary Deposit', date: '2024-09-15', amount: 6250.00, status: 'Completed', category: 'Income' },
    { id: 'PT002', description: 'Groceries - Walmart', date: '2024-09-18', amount: -180.75, status: 'Completed', category: 'Groceries' },
    { id: 'PT003', description: 'Netflix Subscription', date: '2024-09-20', amount: -19.99, status: 'Completed', category: 'Entertainment' },
    { id: 'PT004', description: 'Stock Purchase - AAPL', date: '2024-09-14', amount: -1000.00, status: 'Pending', category: 'Investments' },
    { id: 'PT005', description: 'Dinner with Friends', date: '2024-09-17', amount: -85.50, status: 'Completed', category: 'Entertainment' },
];

const personalBillsData: Bill[] = [
    { id: 'PB01', name: 'Rent', dueDate: '2024-10-01', amount: 2200.00 },
    { id: 'PB02', name: 'Car Loan', dueDate: '2024-10-05', amount: 450.00 },
    { id: 'PB03', name: 'Phone Bill', dueDate: '2024-09-28', amount: 75.00 },
];

const initialPersonalSpendingCategories: SpendingCategory[] = [
    { label: 'Housing', value: 0, color: '#71E6E9', icon: <HomeIcon className="w-5 h-5"/> }, 
    { label: 'Groceries', value: 0, color: '#A1F0F2', icon: <ShoppingCartIcon className="w-5 h-5"/> },
    { label: 'Transport', value: 0, color: '#4B5563', icon: <BriefcaseIcon className="w-5 h-5"/> }, 
    { label: 'Entertainment', value: 0, color: '#363636', icon: <GiftIcon className="w-5 h-5"/> },
    { label: 'Investments', value: 0, color: '#8b5cf6', icon: <TrendingUpIcon className="w-5 h-5"/> }, 
    { label: 'Savings', value: 0, color: '#10b981', icon: <DollarSignIcon className="w-5 h-5"/> },
    { label: 'Other', value: 0, color: '#9CA3AF', icon: <CubeIcon className="w-5 h-5"/> }, 
    { label: 'Income', value: 0, color: '#22c55e', icon: <TrendingUpIcon className="w-5 h-5"/> }
];

const mockPersonalGoalsData: FinancialGoal[] = [
    { id: 'PG01', name: 'Dream Vacation', targetAmount: 5000, currentAmount: 1250, icon: <BriefcaseIcon/> },
    { id: 'PG02', name: 'New Laptop', targetAmount: 2500, currentAmount: 2100, icon: <BriefcaseIcon/> },
    { id: 'PG03', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 8500, icon: <DollarSignIcon/> },
];

const personalRecurringData: RecurringTransaction[] = [
    { id: 'PR01', description: 'Rent Payment', amount: 2200.00, type: 'expense', category: 'Housing', frequency: 'monthly', startDate: '2024-01-01' },
    { id: 'PR02', description: 'Salary', amount: 6250.00, type: 'income', category: 'Income', frequency: 'monthly', startDate: '2024-01-15' },
    { id: 'PR03', description: 'Gym Membership', amount: 50.00, type: 'expense', category: 'Other', frequency: 'monthly', startDate: '2024-03-10', endDate: '2025-03-09' },
];

const businessMetricsData: FinanceMetric[] = [
    { label: 'Total Revenue', value: '৳405k', change: 12.3, icon: <DollarSignIcon className="w-7 h-7" /> },
    { label: 'Operating Profit', value: '৳95k', change: 8.1, icon: <TrendingUpIcon className="w-7 h-7 text-green-400" /> },
    { label: 'Client Invoices (Pending)', value: '৳32k', icon: <BriefcaseIcon className="w-7 h-7 text-yellow-400" /> },
    { label: 'Business Assets', value: '৳1.2M', change: 2.5, icon: <BuildingIcon className="w-7 h-7" /> },
];

const initialBusinessTransactionsData: Transaction[] = [
    { id: 'BT001', description: 'Client Payment - Project X', date: '2024-09-19', amount: 25000.00, status: 'Completed', category: 'Income' },
    { id: 'BT002', description: 'Figma Subscription', date: '2024-09-20', amount: -75.00, status: 'Completed', category: 'Software' },
    { id: 'BT003', description: 'Amazon Web Services', date: '2024-09-18', amount: -280.50, status: 'Completed', category: 'Infrastructure' },
    { id: 'BT004', description: 'Employee Payroll', date: '2024-09-15', amount: -15000.00, status: 'Completed', category: 'Payroll' },
    { id: 'BT005', description: 'Office Supplies', date: '2024-09-12', amount: -450.00, status: 'Completed', category: 'Supplies' },
];

const businessBillsData: Bill[] = [
    { id: 'BB01', name: 'Office Rent', dueDate: '2024-10-01', amount: 3500.00 },
    { id: 'BB02', name: 'Software Licenses', dueDate: '2024-10-10', amount: 800.00 },
    { id: 'BB03', name: 'Business Insurance', dueDate: '2024-10-15', amount: 300.00 },
];

const initialBusinessSpendingCategories: SpendingCategory[] = [
    { label: 'Payroll', value: 0, color: '#71E6E9', icon: <UsersIcon className="w-5 h-5"/> }, 
    { label: 'Software', value: 0, color: '#A1F0F2', icon: <CubeIcon className="w-5 h-5"/> },
    { label: 'Marketing', value: 0, color: '#4B5563', icon: <ChartBarIcon className="w-5 h-5"/> }, 
    { label: 'Supplies', value: 0, color: '#363636', icon: <ShoppingCartIcon className="w-5 h-5"/> },
    { label: 'Infrastructure', value: 0, color: '#8b5cf6', icon: <BuildingIcon className="w-5 h-5"/> }, 
    { label: 'Other', value: 0, color: '#9CA3AF', icon: <CubeIcon className="w-5 h-5"/> },
    { label: 'Income', value: 0, color: '#22c55e', icon: <TrendingUpIcon className="w-5 h-5"/> }
];

const businessInvoicesData: Invoice[] = [
    { id: 'INV001', invoiceNumber: '2024-001', clientName: 'Innovate Corp', issueDate: '2024-09-10', dueDate: '2024-10-10', amount: 15000, status: 'Pending' },
    { id: 'INV002', invoiceNumber: '2024-002', clientName: 'Tech Solutions Ltd', issueDate: '2024-08-25', dueDate: '2024-09-25', amount: 8500, status: 'Paid' },
    { id: 'INV003', invoiceNumber: '2024-003', clientName: 'Digital Creations', issueDate: '2024-08-15', dueDate: '2024-09-15', amount: 22000, status: 'Overdue' },
];

const businessRecurringData: RecurringTransaction[] = [
    { id: 'BR01', description: 'Office Rent', amount: 3500.00, type: 'expense', category: 'Other', frequency: 'monthly', startDate: '2024-01-01' },
    { id: 'BR02', description: 'SaaS Subscription - Figma', amount: 75.00, type: 'expense', category: 'Software', frequency: 'monthly', startDate: '2024-02-20' },
];


// --- Helper & UI Components ---

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-dark-card rounded-3xl p-6 transition-all duration-300 hover:shadow-glow-cyan hover:-translate-y-1 ${className}`}>{children}</div>
);

const DonutChart: React.FC<{ data: SpendingCategory[], centerLabel: string }> = ({ data, centerLabel }) => {
    const [animate, setAnimate] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulative = 0;

    useEffect(() => {
        setAnimate(false);
        const timer = setTimeout(() => setAnimate(true), 100);
        return () => clearTimeout(timer);
    }, [data]);

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
            <div className="relative w-48 h-48">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    {data.map((item, index) => {
                        const dasharray = (item.value / total) * 100 || 0;
                        const dashoffset = cumulative;
                        cumulative += dasharray;
                        const isHovered = hoveredCategory === item.label;
                        return (
                            <circle 
                                key={item.label} 
                                cx="18" cy="18" r="15.9" 
                                fill="transparent" 
                                stroke={item.color} 
                                strokeWidth="4" 
                                strokeDasharray={animate ? `${dasharray} 100` : `0 100`} 
                                strokeDashoffset={-dashoffset} 
                                className="transition-all duration-300"
                                style={{ 
                                    transformOrigin: 'center', 
                                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                    transition: `stroke-dasharray 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.3s ease-out`, 
                                    transitionDelay: `${index * 50}ms, 0s`
                                }} 
                            />
                        );
                    })}
                </svg>
                 <div className="absolute inset-0 flex items-center justify-center flex-col"><span className="text-sm text-light-gray">{centerLabel}</span><span className="text-3xl font-bold">৳{total.toLocaleString()}</span></div>
            </div>
            <div className="space-y-2 text-sm">
                {data.filter(i => i.value > 0).map(item => {
                    // Fix: Use React.isValidElement to prevent errors when icon is not a valid React element for cloning.
                    const iconElement = React.isValidElement(item.icon) ? React.cloneElement(item.icon, { className: 'w-4 h-4 text-light-gray' }) : item.icon;
                    return (
                        <div 
                            key={item.label} 
                            className="flex items-center gap-3 p-1 rounded-md -m-1 transition-colors hover:bg-dark-bg"
                            onMouseEnter={() => setHoveredCategory(item.label)}
                            onMouseLeave={() => setHoveredCategory(null)}
                        >
                            {iconElement}
                            <span className="w-24">{item.label}</span>
                            <span className="font-semibold">৳{item.value.toLocaleString()}</span>
                            <span className="text-light-gray">({total > 0 ? ((item.value/total)*100).toFixed(0) : 0}%)</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const MetricCard: React.FC<{ metric: FinanceMetric }> = ({ metric }) => (
    <div className="bg-dark-bg p-5 rounded-2xl transition-all duration-300 hover:shadow-glow-purple hover:-translate-y-1">
        <div className="flex items-start justify-between"><p className="text-light-gray">{metric.label}</p><div className="text-accent-cyan-light">{metric.icon}</div></div>
        <p className="text-3xl font-bold mt-2">{metric.value}</p>
        {metric.change !== undefined && <div className={`flex items-center text-sm mt-1 ${metric.change > 0 ? 'text-green-400' : 'text-red-400'}`}>{metric.change > 0 ? <TrendingUpIcon className="w-4 h-4 mr-1"/> : <TrendingDownIcon className="w-4 h-4 mr-1"/>}{Math.abs(metric.change)}% this month</div>}
    </div>
);

const getTransactionStatusChip = (status: Transaction['status']) => (status === 'Completed' ? <span className="px-2 py-1 text-xs font-semibold text-green-300 bg-green-500/20 rounded-full">Completed</span> : <span className="px-2 py-1 text-xs font-semibold text-yellow-300 bg-yellow-500/20 rounded-full">Pending</span>);
const getInvoiceStatusChip = (status: Invoice['status']) => {
    const styles = { 'Paid': 'text-green-300 bg-green-500/20', 'Pending': 'text-yellow-300 bg-yellow-500/20', 'Overdue': 'text-red-300 bg-red-500/20' };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
}

const Modal: React.FC<{onClose: () => void; children: React.ReactNode; title: string;}> = ({ onClose, children, title }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
        <div className="bg-dark-card rounded-3xl p-6 border border-dark-border w-full max-w-md relative" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-light-gray hover:text-white" aria-label="Close modal"><XMarkIcon className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            {children}
        </div>
    </div>
);

const Input = React.forwardRef<HTMLInputElement, any>(({ label, ...props }, ref) => (
    <div>
        <label htmlFor={props.id} className="text-xs text-light-gray">{label}</label>
        <input ref={ref} {...props} className="w-full bg-dark-bg border border-dark-border rounded-lg h-10 px-3 mt-1 read-only:bg-dark-border" />
    </div>
));

const Select: React.FC<any> = ({ label, children, ...props }) => (
    <div>
        <label htmlFor={props.id} className="text-xs text-light-gray">{label}</label>
        <select {...props} className="w-full bg-dark-bg border border-dark-border rounded-lg h-10 px-3 mt-1 appearance-none disabled:bg-dark-border" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}>
            {children}
        </select>
    </div>
);

const getNextOccurrence = (item: RecurringTransaction): string | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(item.startDate + 'T00:00:00');
    const endDate = item.endDate ? new Date(item.endDate + 'T00:00:00') : null;

    if (endDate && today > endDate) return null;
    if (today < startDate) return item.startDate;

    let nextDate = new Date(startDate);

    while (nextDate < today) {
        switch (item.frequency) {
            case 'daily': nextDate.setDate(nextDate.getDate() + 1); break;
            case 'weekly': nextDate.setDate(nextDate.getDate() + 7); break;
            case 'monthly': nextDate.setMonth(nextDate.getMonth() + 1); break;
            case 'yearly': nextDate.setFullYear(nextDate.getFullYear() + 1); break;
        }
    }

    if (endDate && nextDate > endDate) return null;

    return nextDate.toISOString().split('T')[0];
};

const CategoryManagementModal: React.FC<{
    onClose: () => void;
    categories: SpendingCategory[];
    onAddCategory: (name: string) => void;
    onUpdateCategory: (oldLabel: string, newLabel: string) => void;
    onDeleteCategory: (label: string) => void;
}> = ({ onClose, categories, onAddCategory, onUpdateCategory, onDeleteCategory }) => {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<{ label: string; newName: string } | null>(null);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        onAddCategory(newCategoryName);
        setNewCategoryName('');
    };
    
    const handleUpdate = (oldLabel: string) => {
        if(editingCategory && editingCategory.newName) {
            onUpdateCategory(oldLabel, editingCategory.newName);
        }
        setEditingCategory(null);
    }

    return (
        <Modal onClose={onClose} title="Manage Spending Categories">
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {categories.filter(c => c.label !== 'Income').map(cat => {
                    // Fix: Use React.isValidElement to prevent errors when icon is not a valid React element for cloning.
                    const iconElement = React.isValidElement(cat.icon) ? React.cloneElement(cat.icon, { className: 'w-5 h-5' }) : cat.icon;
                    return (
                        <div key={cat.label} className="flex items-center justify-between bg-dark-bg p-3 rounded-lg">
                            {editingCategory?.label === cat.label ? (
                                <input 
                                    type="text" 
                                    value={editingCategory.newName}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, newName: e.target.value })}
                                    onBlur={() => handleUpdate(cat.label)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate(cat.label)}
                                    className="bg-dark-border px-2 py-1 rounded-md flex-grow"
                                    autoFocus
                                />
                            ) : (
                                <div className="flex items-center gap-2">
                                    {iconElement}
                                    <span>{cat.label}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <button onClick={() => setEditingCategory({ label: cat.label, newName: cat.label })} className="p-1 text-light-gray hover:text-accent-cyan"><PencilIcon className="w-4 h-4"/></button>
                                <button onClick={() => onDeleteCategory(cat.label)} className="p-1 text-light-gray hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <form onSubmit={handleAdd} className="mt-4 flex gap-2 border-t border-dark-border pt-4">
                <Input id="newCategory" placeholder="New category name" value={newCategoryName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategoryName(e.target.value)} required className="flex-grow"/>
                <button type="submit" className="bg-accent-cyan text-black font-semibold px-4 rounded-lg hover:bg-accent-cyan-light"><PlusIcon/></button>
            </form>
        </Modal>
    );
};

// --- MAIN PAGE COMPONENT ---
export const FinancePage: React.FC = () => {
    const [financeMode, setFinanceMode] = useState<FinanceMode>('personal');
    
    const [personalTransactions, setPersonalTransactions] = useState<Transaction[]>(initialPersonalTransactionsData);
    const [businessTransactions, setBusinessTransactions] = useState<Transaction[]>(initialBusinessTransactionsData);
    
    const [personalCategories, setPersonalCategories] = useState<SpendingCategory[]>(initialPersonalSpendingCategories);
    const [businessCategories, setBusinessCategories] = useState<SpendingCategory[]>(initialBusinessSpendingCategories);

    const [personalGoals, setPersonalGoals] = useState<FinancialGoal[]>(mockPersonalGoalsData);
    const [invoices, setInvoices] = useState<Invoice[]>(businessInvoicesData);
    const [personalRecurring, setPersonalRecurring] = useState<RecurringTransaction[]>(personalRecurringData);
    const [businessRecurring, setBusinessRecurring] = useState<RecurringTransaction[]>(businessRecurringData);

    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [isContributeModalOpen, setIsContributeModalOpen] = useState<FinancialGoal | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<Transaction | null>(null);
    const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    
    const [activeTab, setActiveTab] = useState<'transactions' | 'recurring'>('transactions');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

    const today = new Date().toISOString().split('T')[0];

    const transactions = useMemo(() => (financeMode === 'personal' ? personalTransactions : businessTransactions), [financeMode, personalTransactions, businessTransactions]);
    const setTransactions = useMemo(() => (financeMode === 'personal' ? setPersonalTransactions : setBusinessTransactions), [financeMode]);

    const baseSpendingCategories = useMemo(() => financeMode === 'personal' ? personalCategories : businessCategories, [financeMode, personalCategories, businessCategories]);

    const calculatedSpendingCategories = useMemo(() => {
        const categoryMap = new Map<string, SpendingCategory>();
        baseSpendingCategories.forEach(cat => categoryMap.set(cat.label, { ...cat, value: 0 }));

        transactions.forEach(t => {
            const categoryLabel = t.amount > 0 ? 'Income' : t.category;
            if (categoryLabel) {
                 const category = categoryMap.get(categoryLabel);
                 if (category) {
                     category.value += Math.abs(t.amount);
                 } else { // Handle transactions with a deleted/old category
                     const otherCategory = categoryMap.get('Other');
                     if(otherCategory) otherCategory.value += Math.abs(t.amount);
                 }
            }
        });

        return Array.from(categoryMap.values());
    }, [transactions, baseSpendingCategories]);

    useEffect(() => {
      setActiveTab('transactions');
    }, [financeMode]);


    // Effect to automatically post due recurring transactions
    useEffect(() => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const currentRecurringList = financeMode === 'personal' ? personalRecurring : businessRecurring;
        const currentSetter = financeMode === 'personal' ? setPersonalTransactions : setBusinessTransactions;
        
        currentSetter(prevTransactions => {
            const newTransactionsToCreate: Transaction[] = [];
            
            currentRecurringList.forEach(item => {
                let occurrenceDate = new Date(item.startDate + 'T00:00:00');
                const endDate = item.endDate ? new Date(item.endDate + 'T00:00:00') : null;

                while (occurrenceDate <= today) {
                    if (endDate && occurrenceDate > endDate) break;

                    const dateString = occurrenceDate.toISOString().split('T')[0];
                    const transactionId = `T-recurring-${item.id}-${dateString}`;
                    const transactionExists = [...prevTransactions, ...newTransactionsToCreate].some(t => t.id === transactionId);

                    if (!transactionExists) {
                        newTransactionsToCreate.push({
                            id: transactionId,
                            description: `${item.description} (Recurring)`,
                            date: dateString,
                            amount: item.type === 'income' ? item.amount : -item.amount,
                            status: 'Completed',
                            category: item.category,
                        });
                    }

                    switch (item.frequency) {
                        case 'daily': occurrenceDate.setDate(occurrenceDate.getDate() + 1); break;
                        case 'weekly': occurrenceDate.setDate(occurrenceDate.getDate() + 7); break;
                        case 'monthly': occurrenceDate.setMonth(occurrenceDate.getMonth() + 1); break;
                        case 'yearly': occurrenceDate.setFullYear(occurrenceDate.getFullYear() + 1); break;
                    }
                }
            });
            
            if (newTransactionsToCreate.length > 0) {
                return [...prevTransactions, ...newTransactionsToCreate].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            }
            return prevTransactions;
        });
    }, [financeMode, personalRecurring, businessRecurring]);


    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
            const matchesType = typeFilter === 'all' || (typeFilter === 'income' && t.amount > 0) || (typeFilter === 'expense' && t.amount < 0);
            const matchesDate = (!dateFilter.start || t.date >= dateFilter.start) && (!dateFilter.end || t.date <= dateFilter.end);
            return matchesCategory && matchesType && matchesDate;
        });
    }, [transactions, categoryFilter, typeFilter, dateFilter]);

    const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const newExpense: Transaction = {
            id: `T${Date.now()}`,
            description: form.description.value,
            date: form.date.value,
            amount: -Math.abs(parseFloat(form.amount.value)),
            status: 'Completed',
            category: form.category.value,
        };
        setTransactions(prev => [newExpense, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setIsExpenseModalOpen(false);
    };

    const handleContributeToGoal = (e: React.FormEvent<HTMLFormElement>, goalId: string) => {
        e.preventDefault();
        const amount = parseFloat(e.currentTarget.amount.value);
        const goal = personalGoals.find(g => g.id === goalId);
        if (!goal || !amount || amount <= 0) return;
    
        setPersonalGoals(prev => prev.map(g => g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g));
    
        const newTransaction: Transaction = {
            id: `G${Date.now()}`,
            description: `Contribution to ${goal.name}`,
            date: new Date().toISOString().split('T')[0],
            amount: -amount,
            status: 'Completed',
            category: 'Savings',
        };
        setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    
        setIsContributeModalOpen(null);
    };

    const handleUpdateTransaction = (updatedTransaction: Transaction) => {
        setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
        setIsDetailModalOpen(null);
        setIsEditMode(false);
    };

    const handleDeleteTransaction = (id: string) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            setTransactions(prev => prev.filter(t => t.id !== id));
            setIsDetailModalOpen(null);
        }
    };
    
    const handleSaveRecurringTransaction = (item: RecurringTransaction) => {
        const setter = financeMode === 'personal' ? setPersonalRecurring : setBusinessRecurring;
        if (editingRecurring) {
            setter(prev => prev.map(r => r.id === item.id ? item : r));
        } else {
            setter(prev => [{ ...item, id: `R${Date.now()}` }, ...prev]);
        }
        setIsRecurringModalOpen(false);
        setEditingRecurring(null);
    };

    const handleDeleteRecurringTransaction = (id: string) => {
        if(window.confirm("Are you sure you want to delete this recurring transaction?")) {
            const setter = financeMode === 'personal' ? setPersonalRecurring : setBusinessRecurring;
            setter(prev => prev.filter(r => r.id !== id));
        }
    }

    const exportToCSV = () => {
        const headers = ["ID", "Description", "Date", "Amount", "Status", "Category"];
        const csvContent = [ headers.join(','), ...filteredTransactions.map(t => [t.id, `"${t.description.replace(/"/g, '""')}"`, t.date, t.amount, t.status, t.category || ''].join(',')) ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = (transaction: Transaction, method: 'email' | 'copy') => {
        const details = `Transaction Details:\n- Description: ${transaction.description}\n- Amount: ৳${transaction.amount.toFixed(2)}\n- Date: ${transaction.date}\n- Status: ${transaction.status}`;
        if (method === 'email') {
            window.location.href = `mailto:?subject=Transaction Details&body=${encodeURIComponent(details)}`;
        } else {
            navigator.clipboard.writeText(details).then(() => alert('Details copied to clipboard!'));
        }
    };

    // --- Category Management Handlers ---
    const handleAddCategory = (name: string) => {
        if (!name.trim()) return;
        const currentCategories = financeMode === 'personal' ? personalCategories : businessCategories;
        if (currentCategories.some(c => c.label.toLowerCase() === name.trim().toLowerCase())) {
            alert("A category with this name already exists.");
            return;
        }

        const availableIcons = [<UsersIcon />, <CubeIcon />, <ChartBarIcon />, <ShoppingCartIcon />, <BuildingIcon />, <GiftIcon />, <HomeIcon />, <BriefcaseIcon />];
        const availableColors = ['#f472b6', '#38bdf8', '#fb923c', '#a78bfa', '#facc15'];

        const newCategory: SpendingCategory = {
            label: name.trim(),
            value: 0,
            color: availableColors[currentCategories.length % availableColors.length],
            icon: availableIcons[currentCategories.length % availableIcons.length],
        };

        const setter = financeMode === 'personal' ? setPersonalCategories : setBusinessCategories;
        setter(prev => [...prev, newCategory]);
    };

    const handleUpdateCategory = (oldLabel: string, newLabel: string) => {
        if (!newLabel.trim() || oldLabel.toLowerCase() === newLabel.trim().toLowerCase()) return;
        
        const currentCategories = financeMode === 'personal' ? personalCategories : businessCategories;
        if (currentCategories.some(c => c.label.toLowerCase() === newLabel.trim().toLowerCase())) {
            alert("A category with this name already exists.");
            return;
        }

        const setTransactions = financeMode === 'personal' ? setPersonalTransactions : setBusinessTransactions;
        setTransactions(prev => prev.map(t => t.category === oldLabel ? { ...t, category: newLabel.trim() } : t));
        
        const setRecurring = financeMode === 'personal' ? setPersonalRecurring : setBusinessRecurring;
        setRecurring(prev => prev.map(r => r.category === oldLabel ? { ...r, category: newLabel.trim() } : r));
        
        const setCategories = financeMode === 'personal' ? setPersonalCategories : setBusinessCategories;
        setCategories(prev => prev.map(c => c.label === oldLabel ? { ...c, label: newLabel.trim() } : c));
    };

    const handleDeleteCategory = (categoryLabel: string) => {
        if (categoryLabel === 'Other' || categoryLabel === 'Income') {
            alert("This is a default category and cannot be deleted.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete the category "${categoryLabel}"? All associated transactions will be moved to "Other".`)) {
            const setTransactions = financeMode === 'personal' ? setPersonalTransactions : setBusinessTransactions;
            setTransactions(prev => prev.map(t => t.category === categoryLabel ? { ...t, category: 'Other' } : t));
            
            const setRecurring = financeMode === 'personal' ? setPersonalRecurring : setBusinessRecurring;
            setRecurring(prev => prev.map(r => r.category === categoryLabel ? { ...r, category: 'Other' } : r));

            const setCategories = financeMode === 'personal' ? setPersonalCategories : setBusinessCategories;
            setCategories(prev => prev.filter(c => c.label !== categoryLabel));
        }
    };
    
    const recurringList = financeMode === 'personal' ? personalRecurring : businessRecurring;

    // --- RENDER ---
    return (
        <div className="mt-6 pb-6">
            {/* --- Modals --- */}
            {isExpenseModalOpen && (
                <Modal onClose={() => setIsExpenseModalOpen(false)} title="Add New Expense">
                    <form onSubmit={handleAddExpense} className="space-y-4">
                        <Input id="description" label="Description" type="text" required />
                        <Input id="amount" label="Amount (৳)" type="number" min="0.01" step="0.01" required />
                        <Input id="date" label="Date" type="date" defaultValue={today} required />
                        <Select id="category" label="Category" defaultValue={baseSpendingCategories.find(c => c.label !== 'Income')?.label}>
                            {baseSpendingCategories.filter(c => c.label !== 'Income').map(c => <option key={c.label}>{c.label}</option>)}
                        </Select>
                        <button type="submit" className="w-full mt-2 bg-accent-cyan text-black font-bold py-3 rounded-lg hover:bg-accent-cyan-light">Add Expense</button>
                    </form>
                </Modal>
            )}
            {isContributeModalOpen && (
                <Modal onClose={() => setIsContributeModalOpen(null)} title={`Add Funds to "${isContributeModalOpen.name}"`}>
                    <form onSubmit={(e) => handleContributeToGoal(e, isContributeModalOpen.id)} className="space-y-4">
                        <p className="text-sm text-light-gray">Current: ৳{isContributeModalOpen.currentAmount.toLocaleString()} / ৳{isContributeModalOpen.targetAmount.toLocaleString()}</p>
                        <Input id="amount" label="Contribution Amount (৳)" type="number" min="0.01" step="0.01" required autoFocus />
                        <button type="submit" className="w-full mt-2 bg-accent-cyan text-black font-bold py-3 rounded-lg hover:bg-accent-cyan-light">Contribute</button>
                    </form>
                </Modal>
            )}
            {isInvoiceModalOpen && (
                 <Modal onClose={() => setIsInvoiceModalOpen(false)} title="Create New Invoice">
                    <form onSubmit={(e) => { e.preventDefault(); /* Logic here */ setIsInvoiceModalOpen(false); }} className="space-y-4">
                        <Input id="clientName" label="Client Name" type="text" required />
                        <Input id="invoiceAmount" label="Amount (৳)" type="number" min="1" step="any" required />
                        <Input id="dueDate" label="Due Date" type="date" defaultValue={today} required />
                        <button type="submit" className="w-full mt-2 bg-accent-cyan text-black font-bold py-3 rounded-lg hover:bg-accent-cyan-light">Create Invoice</button>
                    </form>
                </Modal>
            )}
            {isDetailModalOpen && (
                <Modal onClose={() => { setIsDetailModalOpen(null); setIsEditMode(false); }} title={isEditMode ? "Edit Transaction" : "Transaction Details"}>
                    <form className="space-y-4" onSubmit={e => { e.preventDefault(); if (!isDetailModalOpen) return; const form = e.currentTarget; handleUpdateTransaction({ ...isDetailModalOpen, description: form.description.value, amount: parseFloat(form.amount.value), date: form.date.value, category: form.category.value, status: form.status.value as Transaction['status'] }); }}>
                        <Input id="description" label="Description" type="text" defaultValue={isDetailModalOpen.description} readOnly={!isEditMode} required />
                        <Input id="amount" label="Amount (৳)" type="number" step="0.01" defaultValue={isDetailModalOpen.amount} readOnly={!isEditMode} required />
                        <Input id="date" label="Date" type="date" defaultValue={isDetailModalOpen.date} readOnly={!isEditMode} required />
                        <Select id="category" label="Category" defaultValue={isDetailModalOpen.category} disabled={!isEditMode}>
                            {baseSpendingCategories.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                        </Select>
                         <Select id="status" label="Status" defaultValue={isDetailModalOpen.status} disabled={!isEditMode}>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                        </Select>

                        <div className="flex items-center gap-2 pt-4">
                            {isEditMode ? (
                                <>
                                    <button type="submit" className="flex-1 bg-accent-cyan text-black font-bold py-2 rounded-lg hover:bg-accent-cyan-light">Save Changes</button>
                                    <button type="button" onClick={() => setIsEditMode(false)} className="flex-1 bg-dark-bg font-semibold py-2 rounded-lg hover:bg-dark-border">Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button type="button" onClick={() => setIsEditMode(true)} className="flex-1 flex items-center justify-center gap-2 bg-dark-bg font-semibold py-2 rounded-lg hover:bg-dark-border"><PencilIcon/> Edit</button>
                                    <button type="button" onClick={() => handleShare(isDetailModalOpen, 'email')} className="p-2 bg-dark-bg rounded-lg hover:bg-dark-border"><MailIcon className="w-5 h-5"/></button>
                                    <button type="button" onClick={() => handleShare(isDetailModalOpen, 'copy')} className="p-2 bg-dark-bg rounded-lg hover:bg-dark-border"><ShareIcon/></button>
                                    <button type="button" onClick={() => handleDeleteTransaction(isDetailModalOpen.id)} className="flex-1 flex items-center justify-center gap-2 text-red-400 bg-dark-bg font-semibold py-2 rounded-lg hover:bg-dark-border"><TrashIcon/> Delete</button>
                                </>
                            )}
                        </div>
                    </form>
                </Modal>
            )}
            {isRecurringModalOpen && (
                <Modal onClose={() => { setIsRecurringModalOpen(false); setEditingRecurring(null); }} title={editingRecurring ? "Edit Recurring Transaction" : "New Recurring Transaction"}>
                    <form onSubmit={(e) => { 
                        e.preventDefault(); 
                        const form = e.currentTarget;
                        const newRecurringItem: RecurringTransaction = {
                            id: editingRecurring?.id || '',
                            description: form.description.value,
                            amount: Math.abs(parseFloat(form.amount.value)),
                            type: form.type.value,
                            category: form.category.value,
                            frequency: form.frequency.value,
                            startDate: form.startDate.value,
                            endDate: form.endDate.value || undefined,
                        };
                        handleSaveRecurringTransaction(newRecurringItem);
                    }} className="space-y-4">
                        <Input id="description" label="Description" type="text" defaultValue={editingRecurring?.description} required />
                        <div className="grid grid-cols-2 gap-4">
                            <Input id="amount" label="Amount (৳)" type="number" min="0.01" step="0.01" defaultValue={editingRecurring?.amount} required />
                            <Select id="type" label="Type" defaultValue={editingRecurring?.type || 'expense'}>
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </Select>
                        </div>
                        <Select id="category" label="Category" defaultValue={editingRecurring?.category || baseSpendingCategories[0]?.label}>
                            {baseSpendingCategories.map(c => <option key={c.label}>{c.label}</option>)}
                        </Select>
                        <Select id="frequency" label="Frequency" defaultValue={editingRecurring?.frequency || 'monthly'}>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </Select>
                         <div className="grid grid-cols-2 gap-4">
                            <Input id="startDate" label="Start Date" type="date" defaultValue={editingRecurring?.startDate || today} required />
                            <Input id="endDate" label="End Date (Optional)" type="date" defaultValue={editingRecurring?.endDate} />
                        </div>
                        <button type="submit" className="w-full mt-2 bg-accent-cyan text-black font-bold py-3 rounded-lg hover:bg-accent-cyan-light">{editingRecurring ? 'Save Changes' : 'Add Transaction'}</button>
                    </form>
                </Modal>
            )}
            {isCategoryModalOpen && (
                <CategoryManagementModal 
                    onClose={() => setIsCategoryModalOpen(false)}
                    categories={baseSpendingCategories}
                    onAddCategory={handleAddCategory}
                    onUpdateCategory={handleUpdateCategory}
                    onDeleteCategory={handleDeleteCategory}
                />
            )}
            
            {/* --- Header --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold">Finance Dashboard</h1>
                <div className="flex items-center gap-2 p-1 bg-dark-card rounded-xl">
                    <button onClick={() => setFinanceMode('personal')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${financeMode === 'personal' ? 'bg-white text-black' : 'hover:bg-dark-bg'}`}>Personal</button>
                    <button onClick={() => setFinanceMode('business')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${financeMode === 'business' ? 'bg-white text-black' : 'hover:bg-dark-bg'}`}>Business</button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-4">
                {(financeMode === 'personal' ? personalMetricsData : businessMetricsData).map(metric => <MetricCard key={metric.label} metric={metric} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex justify-between items-start mb-4">
                             <div className="flex border-b border-dark-border">
                                <button onClick={() => setActiveTab('transactions')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'transactions' ? 'border-b-2 border-accent-cyan text-white' : 'text-light-gray'}`}>Recent Transactions</button>
                                <button onClick={() => setActiveTab('recurring')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'recurring' ? 'border-b-2 border-accent-cyan text-white' : 'text-light-gray'}`}>Recurring</button>
                            </div>
                        </div>

                        {activeTab === 'transactions' ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 p-3 bg-dark-bg rounded-xl items-end">
                                    <Select id="categoryFilter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                                        <option value="all">All Categories</option>
                                        {baseSpendingCategories.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                                    </Select>
                                    <Select id="typeFilter" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                                        <option value="all">All Types</option><option value="income">Income</option><option value="expense">Expense</option>
                                    </Select>
                                    <div className="flex items-center gap-2 text-xs">
                                        <Input type="date" value={dateFilter.start} onChange={e => setDateFilter(p => ({...p, start: e.target.value}))}/>
                                        <span>to</span>
                                        <Input type="date" value={dateFilter.end} onChange={e => setDateFilter(p => ({...p, end: e.target.value}))}/>
                                    </div>
                                    <div className="md:col-span-3 flex justify-end gap-3 mt-2">
                                        {financeMode === 'personal' && <button onClick={() => setIsExpenseModalOpen(true)} className="flex items-center gap-2 bg-accent-cyan text-black font-semibold px-3 py-1.5 rounded-lg text-sm hover:bg-accent-cyan-light"><PlusIcon/> New Expense</button>}
                                        {financeMode === 'business' && <button onClick={() => setIsInvoiceModalOpen(true)} className="flex items-center gap-2 bg-accent-cyan text-black font-semibold px-3 py-1.5 rounded-lg text-sm hover:bg-accent-cyan-light"><PlusIcon/> New Invoice</button>}
                                        <button onClick={exportToCSV} className="flex items-center gap-2 bg-dark-border font-semibold px-3 py-1.5 rounded-lg text-sm hover:bg-mid-gray"><DownloadIcon/> Export CSV</button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead><tr className="border-b border-dark-border"><th className="p-3 text-sm font-semibold text-light-gray">Description</th><th className="p-3 text-sm font-semibold text-light-gray">Date</th><th className="p-3 text-sm font-semibold text-light-gray">Amount</th><th className="p-3 text-sm font-semibold text-light-gray">Status</th></tr></thead>
                                        <tbody>
                                            {filteredTransactions.map(t => (
                                                <tr key={t.id} onClick={() => setIsDetailModalOpen(t)} className="border-b border-dark-border/50 hover:bg-dark-bg transition-colors cursor-pointer">
                                                    <td className="p-3 font-semibold">{t.description}</td><td className="p-3 text-light-gray">{t.date}</td>
                                                    <td className={`p-3 font-semibold ${t.amount > 0 ? 'text-green-400' : 'text-gray-200'}`}>{t.amount > 0 ? '+' : ''}৳{Math.abs(t.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                                    <td className="p-3">{getTransactionStatusChip(t.status)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                             <>
                                <div className="flex justify-end mb-4">
                                    <button onClick={() => { setEditingRecurring(null); setIsRecurringModalOpen(true); }} className="flex items-center gap-2 bg-accent-cyan text-black font-semibold px-3 py-1.5 rounded-lg text-sm hover:bg-accent-cyan-light"><PlusIcon/> New Recurring Transaction</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead><tr className="border-b border-dark-border"><th className="p-3 text-sm font-semibold text-light-gray">Description</th><th className="p-3 text-sm font-semibold text-light-gray">Amount</th><th className="p-3 text-sm font-semibold text-light-gray">Frequency</th><th className="p-3 text-sm font-semibold text-light-gray">Next Date</th><th className="p-3 text-sm font-semibold text-light-gray">Actions</th></tr></thead>
                                        <tbody>
                                            {recurringList.map(r => {
                                                const nextDate = getNextOccurrence(r);
                                                if (!nextDate && !r.endDate) return null; // Only hide if it's truly expired with an end date
                                                return (
                                                    <tr key={r.id} className="border-b border-dark-border/50 hover:bg-dark-bg transition-colors">
                                                        <td className="p-3 font-semibold">{r.description}</td>
                                                        <td className={`p-3 font-semibold ${r.type === 'income' ? 'text-green-400' : 'text-gray-200'}`}>{r.type === 'income' ? '+' : '-'}৳{r.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                        <td className="p-3 text-light-gray capitalize">{r.frequency}</td>
                                                        <td className="p-3 text-light-gray">{nextDate || 'Ended'}</td>
                                                        <td className="p-3">
                                                            <div className="flex items-center space-x-2">
                                                                <button onClick={() => { setEditingRecurring(r); setIsRecurringModalOpen(true); }} className="p-2 text-light-gray hover:text-accent-cyan rounded-md"><PencilIcon/></button>
                                                                <button onClick={() => handleDeleteRecurringTransaction(r.id)} className="p-2 text-light-gray hover:text-red-500 rounded-md"><TrashIcon/></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                             </>
                        )}
                    </Card>
                </div>

                 <div className="flex flex-col gap-6">
                    <Card><h2 className="font-bold text-lg mb-4">Upcoming Bills</h2><div className="space-y-3">
                        {(financeMode === 'personal' ? personalBillsData : businessBillsData).map(bill => (<div key={bill.id} className="flex justify-between items-center bg-dark-bg p-3 rounded-xl"><div><p className="font-semibold">{bill.name}</p><p className="text-xs text-light-gray">Due: {bill.dueDate}</p></div><p className="font-bold text-lg">৳{bill.amount.toLocaleString()}</p></div>))}
                    </div></Card>
                     {financeMode === 'personal' ? (
                        <Card><div className="flex justify-between items-center mb-4"><h2 className="font-bold text-lg">Financial Goals</h2><button onClick={() => setIsGoalModalOpen(true)} className="flex items-center gap-2 bg-dark-bg text-accent-cyan font-semibold px-3 py-1.5 rounded-lg text-sm hover:bg-dark-border"><PlusIcon className="w-4 h-4" /> New Goal</button></div><div className="space-y-4">
                            {personalGoals.map(goal => {
                                // Fix: Use React.isValidElement to prevent errors when icon is not a valid React element for cloning.
                                const iconElement = React.isValidElement(goal.icon) ? React.cloneElement(goal.icon, { className: 'w-5 h-5' }) : goal.icon;
                                return (<div key={goal.id}><div className="flex justify-between items-center text-sm mb-1"><div className="flex items-center gap-2 font-semibold">{iconElement}<span>{goal.name}</span></div><span className="text-light-gray">৳{goal.currentAmount.toLocaleString()} / ৳{goal.targetAmount.toLocaleString()}</span></div><div className="w-full bg-dark-bg rounded-full h-2"><div className="bg-accent-cyan h-2 rounded-full" style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}></div></div><button onClick={() => setIsContributeModalOpen(goal)} className="text-xs font-semibold text-accent-cyan hover:underline mt-2 w-full text-right">Add Funds</button></div>);
                            })}
                        </div></Card>
                    ) : (
                        <Card><h2 className="font-bold text-lg mb-4">Invoices</h2><div className="space-y-2 text-sm">{invoices.map(inv => (<div key={inv.id} className="flex justify-between items-center bg-dark-bg p-3 rounded-lg"><div><p className="font-semibold">{inv.clientName}</p><p className="text-xs text-light-gray">#{inv.invoiceNumber} - Due: {inv.dueDate}</p></div><div>{getInvoiceStatusChip(inv.status)}<p className="font-semibold text-right mt-1">৳{inv.amount.toLocaleString()}</p></div></div>))}</div></Card>
                    )}
                </div>

                <div className="lg:col-span-3">
                    <Card>
                        <div className="flex justify-between items-center mb-2">
                           <h2 className="font-bold text-lg">Spending by Category</h2>
                           <button onClick={() => setIsCategoryModalOpen(true)} className="flex items-center gap-2 bg-dark-bg text-accent-cyan font-semibold px-3 py-1.5 rounded-lg text-sm hover:bg-dark-border">
                               <TagIcon className="w-4 h-4" /> Manage Categories
                           </button>
                        </div>
                        <DonutChart data={calculatedSpendingCategories} centerLabel={financeMode === 'personal' ? 'Total Spent' : 'Total Expenses'} />
                    </Card>
                </div>
            </div>
        </div>
    );
};
