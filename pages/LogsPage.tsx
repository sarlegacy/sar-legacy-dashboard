
import React, { useState, useEffect } from 'react';
import type { LogEntry } from '../types';
import { LogService } from '../services/LogService';
import { DocumentTextIcon, TrashIcon } from '../components/Icons';

const LogLevelChip: React.FC<{ level: LogEntry['level'] }> = ({ level }) => {
    const levelStyles = {
        INFO: 'bg-blue-500/20 text-blue-300',
        WARN: 'bg-yellow-500/20 text-yellow-300',
        ERROR: 'bg-red-500/20 text-red-300',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${levelStyles[level]}`}>
            {level}
        </span>
    );
};

export const LogsPage: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>(LogService.getLogs());
    const [filter, setFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');

    useEffect(() => {
        const handleUpdate = () => {
            setLogs(LogService.getLogs());
        };
        LogService.subscribe(handleUpdate);
        return () => LogService.unsubscribe(handleUpdate);
    }, []);

    const filteredLogs = logs.filter(log => filter === 'ALL' || log.level === filter);

    const formatTimestamp = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    };

    return (
        <div className="mt-6 pb-6">
            <h1 className="text-2xl font-bold flex items-center gap-3">
                <DocumentTextIcon className="w-8 h-8"/>
                Client-Side Log
            </h1>
            <p className="text-light-gray mt-1">Real-time log of application events for debugging.</p>
            
            <div className="bg-dark-card rounded-3xl mt-4 p-6 transition-all duration-300 hover:shadow-glow-cyan hover:-translate-y-1">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 border-b border-dark-border pb-4">
                     <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">Filter by level:</span>
                        {(['ALL', 'INFO', 'WARN', 'ERROR'] as const).map(level => (
                            <button
                                key={level}
                                onClick={() => setFilter(level)}
                                className={`px-3 py-1 text-sm rounded-lg font-semibold ${filter === level ? 'bg-accent-cyan text-black' : 'bg-dark-bg hover:bg-mid-gray'}`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => LogService.clearLogs()}
                        className="flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-lg font-semibold hover:bg-red-500/30 transition-colors"
                    >
                        <TrashIcon className="w-4 h-4" />
                        Clear Logs
                    </button>
                </div>
                
                <div className="font-mono text-sm h-[calc(100vh-24rem)] overflow-y-auto pr-2">
                    {filteredLogs.map(log => (
                        <div key={log.id} className="flex items-start gap-4 p-2 rounded hover:bg-dark-bg">
                            <span className="text-light-gray">{formatTimestamp(log.timestamp)}</span>
                            <LogLevelChip level={log.level} />
                            <p className="flex-1 whitespace-pre-wrap break-words">{log.message}</p>
                        </div>
                    ))}
                     {filteredLogs.length === 0 && (
                        <div className="text-center py-16 text-light-gray">No logs to display for this filter.</div>
                    )}
                </div>
            </div>
        </div>
    );
};