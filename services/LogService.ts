import type { LogEntry } from '../types';

class LoggingService {
    private logs: LogEntry[] = [];
    private listeners: Array<() => void> = [];

    constructor() {
        this.log('Log service initialized.', 'INFO');
    }

    public log(message: string, level: 'INFO' | 'WARN' | 'ERROR') {
        const newLog: LogEntry = {
            id: Date.now().toString() + Math.random().toString(),
            timestamp: new Date(),
            level,
            message,
        };
        this.logs.unshift(newLog);
        if (this.logs.length > 200) { // Limit log history
            this.logs.pop();
        }
        this.notifyListeners();
    }

    public getLogs(): LogEntry[] {
        return [...this.logs];
    }

    public clearLogs() {
        this.logs = [];
        this.log('Logs cleared.', 'INFO');
        this.notifyListeners();
    }
    
    public subscribe(listener: () => void) {
        this.listeners.push(listener);
    }

    public unsubscribe(listener: () => void) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    private notifyListeners() {
        for (const listener of this.listeners) {
            listener();
        }
    }
}

export const LogService = new LoggingService();
