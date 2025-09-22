
import type { OrderBookEntry, ActiveTrade, NewOrder } from '../types';
import { BitcoinIcon } from '../components/Icons';
import React from 'react';

// --- State Simulation ---
// This service simulates a simple in-memory database for our orders and market data.

let myOpenOrders: ActiveTrade[] = [
    { id: 'T01B-initial', type: 'Buy', assetSymbol: 'BTC', assetIcon: React.createElement(BitcoinIcon, { className: "w-6 h-6 text-yellow-500" }), amount: 0.1, price: 68000, user: 'You' },
];
let priceHistory = [68000, 68250, 68100, 68500, 68300, 68750, 68600, 68900, 69100, 68950, 69300, 69200];
let currentPrice = 69284.50;

// --- Helper Functions ---

const simulatePriceChange = () => {
    const change = (Math.random() - 0.49) * 500; // Fluctuate price, slightly biased upwards
    currentPrice += change;
    priceHistory.push(parseFloat(currentPrice.toFixed(2)));
    if (priceHistory.length > 30) {
        priceHistory.shift(); // Keep the history array from growing indefinitely
    }
};

const generateOrderBookEntries = (centerPrice: number, count: number, isAsks: boolean): OrderBookEntry[] => {
    return Array.from({ length: count }, (_, i) => {
        const price = centerPrice + (isAsks ? 1 : -1) * (i + 1) * (Math.random() * 20 + 5);
        const amount = parseFloat((Math.random() * 2).toFixed(4));
        return {
            price: parseFloat(price.toFixed(2)),
            amount,
            total: parseFloat((price * amount).toFixed(2)),
        };
    }).sort((a, b) => isAsks ? a.price - b.price : b.price - a.price);
};


// --- "API" Methods ---

export const binanceService = {
    // --- Fetch initial data ---
    getInitialData: async () => {
        simulatePriceChange();
        return new Promise<{
            price: number;
            change: number;
            priceChartData: number[];
            orderBook: { asks: OrderBookEntry[]; bids: OrderBookEntry[] };
            openOrders: ActiveTrade[];
        }>(resolve => {
            setTimeout(() => { // Simulate network delay
                resolve({
                    price: currentPrice,
                    change: parseFloat(((currentPrice - priceHistory[priceHistory.length - 2]) / priceHistory[priceHistory.length - 2] * 100).toFixed(2)),
                    priceChartData: [...priceHistory],
                    orderBook: {
                        asks: generateOrderBookEntries(currentPrice, 8, true),
                        bids: generateOrderBookEntries(currentPrice, 8, false),
                    },
                    openOrders: [...myOpenOrders],
                });
            }, 800);
        });
    },

    // --- Fetch periodic updates ---
    getMarketUpdate: async () => {
        simulatePriceChange();
        return new Promise<{
            price: number;
            change: number;
            priceChartData: number[];
            orderBook: { asks: OrderBookEntry[]; bids: OrderBookEntry[] };
        }>(resolve => {
            setTimeout(() => { // Shorter delay for updates
                resolve({
                    price: currentPrice,
                    change: parseFloat(((currentPrice - priceHistory[priceHistory.length - 2]) / priceHistory[priceHistory.length - 2] * 100).toFixed(2)),
                    priceChartData: [...priceHistory],
                    orderBook: {
                        asks: generateOrderBookEntries(currentPrice, 8, true),
                        bids: generateOrderBookEntries(currentPrice, 8, false),
                    },
                });
            }, 200);
        });
    },

    // --- Place an order ---
    placeOrder: async (order: NewOrder) => {
        return new Promise<ActiveTrade>(resolve => {
            setTimeout(() => {
                const newTrade: ActiveTrade = {
                    ...order,
                    id: `T-${Date.now()}`,
                    user: 'You',
                    assetSymbol: 'BTC',
                    assetIcon: React.createElement(BitcoinIcon, { className: "w-6 h-6 text-yellow-500" }),
                };
                myOpenOrders.unshift(newTrade);
                resolve(newTrade);
            }, 500);
        });
    },

    // --- Cancel an order ---
    cancelOrder: async (orderId: string) => {
        return new Promise<string>(resolve => {
            setTimeout(() => {
                myOpenOrders = myOpenOrders.filter(o => o.id !== orderId);
                resolve(orderId);
            }, 300);
        });
    },
};