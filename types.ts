
// Fix: Import React to use React.ReactNode type.
import type React from 'react';

export interface TimeTrackingTask {
  name: string;
  time: string;
  // Fix: Replaced JSX.Element with React.ReactNode to avoid namespace errors in .ts files.
  icon: React.ReactNode;
  isActive?: boolean;
}

export interface CalendarTask {
  id: number;
  title: string;
  description: string;
  startTime: number; // Hour from 0-23
  endTime: number; // Hour from 0-23
  day: number; // 0 for Sun, ..., 6 for Sat
  attendees?: string[]; // URLs to avatars
  user?: {
      name: string;
      avatarUrl: string;
  };
}

export interface AppUsage {
  name: string;
  // Fix: Replaced JSX.Element with React.ReactNode to avoid namespace errors in .ts files.
  icon: React.ReactNode;
  time: string;
  percentage: number;
}

export interface KeyMetric {
    id: string;
    label: string;
    value: string;
    change: number;
    // Fix: Replaced JSX.Element with React.ReactNode to avoid namespace errors in .ts files.
    icon: React.ReactNode;
}

export interface TeamMemberPerformance {
    id: number;
    name: string;
    avatarUrl: string;
    role: string;
    performance: number;
}

export interface UpcomingDeadline {
    id: number;
    title: string;
    dueDate: string;
    daysLeft: number;
}

export interface RecentOrder {
    id: string;
    customerName: string;
    avatarUrl: string;
    date: string;
    amount: number;
    status: 'Completed' | 'Pending' | 'Cancelled';
    product?: string;
}

export interface PortfolioAsset {
    id: string;
    name: string;
    symbol: string;
    // Fix: Replaced JSX.Element with React.ReactNode to avoid namespace errors in .ts files.
    icon: React.ReactNode;
    amount: number;
    valueUSD: number;
    change: number;
}

export interface ActiveTrade {
    id: string;
    type: 'Buy' | 'Sell';
    assetSymbol: string;
    // Fix: Replaced JSX.Element with React.ReactNode to avoid namespace errors in .ts files.
    assetIcon: React.ReactNode;
    amount: number;
    price: number;
    user: string;
}

export interface OrderBookEntry {
    price: number;
    amount: number;
    total: number;
}

export interface NewOrder {
    type: 'Buy' | 'Sell';
    amount: number;
    price: number;
}

// --- New Types for Pages ---

export interface User {
    id: string;
    name: string;
    avatarUrl: string;
    email: string;
    role: 'Admin' | 'Developer' | 'Designer' | 'Manager';
    status: 'Active' | 'Inactive';
    lastLogin: string;
    joinDate: string;
    bio: string;
    phone: string;
    assignedProjects: { id: string; name: string }[];
}

export interface AuthUser {
    name: string;
    email: string;
    avatarUrl: string;
}

export interface Milestone {
    name: string;
    completed: boolean;
    date: string; // YYYY-MM-DD
}

export interface ProjectUpcomingDeadline {
    task: string;
    dueDate: string; // YYYY-MM-DD
}

export interface Project {
    id: string;
    name: string;
    client: string;
    deadline: string;
    progress: number;
    status: 'Backlog' | 'In Progress' | 'In Review' | 'Completed';
    isAtRisk?: boolean;
    team: string[];
    statusSummary?: string;
    milestones?: Milestone[];
    upcomingDeadlines?: ProjectUpcomingDeadline[];
}


export interface EcomStat {
    label: string;
    value: string;
    change: number;
    // Fix: Replaced JSX.Element with React.ReactNode to avoid namespace errors in .ts files.
    icon: React.ReactNode;
}

export interface TopProduct {
    id: string;
    name: string;
    imageUrl: string;
    sales: number;
}

export interface TradeHistoryItem {
    id: string;
    type: 'Buy' | 'Sell';
    assetSymbol: string;
    date: string;
    amount: number;
    price: number;
    status: 'Completed' | 'Failed';
}

export interface LoginActivity {
    id: string;
    device: string;
    location: string;
    time: string;
    ip: string;
}

export interface BillingHistoryItem {
    id: string;
    date: string;
    description: string;
    amount: number;
}

export interface Notification {
    id: string;
    type: 'order' | 'project' | 'security' | 'user';
    message: string;
    timestamp: string;
    read: boolean;
}

export interface AuditLogEntry {
    id: string;
    user: {
        name: string;
        avatarUrl: string;
    };
    action: string;
    timestamp: string;
    type: 'login' | 'update' | 'create' | 'delete';
}

export interface Message {
    id: string;
    text: string;
    timestamp: string;
    sender: 'me' | 'other';
    read?: boolean;
}

export type SocialPlatform = 'internal' | 'facebook' | 'whatsapp' | 'telegram' | 'wechat' | 'snapchat';

export interface Conversation {
    id: string;
    userName: string;
    avatarUrl: string;
    platform: SocialPlatform;
    lastMessage: string;
    lastMessageTimestamp: string;
    unreadCount: number;
    messages: Message[];
}

export interface LogEntry {
    id: string;
    timestamp: Date;
    level: 'INFO' | 'WARN' | 'ERROR';
    message: string;
}

export interface FinancialGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    // Fix: Replaced JSX.Element with React.ReactNode to avoid namespace errors in .ts files.
    icon: React.ReactNode;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    clientName: string;
    issueDate: string;
    dueDate: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Overdue';
}
export interface RecurringTransaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}