

import React, { useState, useEffect, useRef } from 'react';
import { PortfolioAsset, OrderBookEntry, ActiveTrade, TradeHistoryItem, NewOrder } from '../types';
import { BitcoinIcon, EthereumIcon, TrendingUpIcon, TrendingDownIcon, ArrowDownLeftIcon, ArrowUpRightIcon, BinanceIcon, BitgetIcon, BybitIcon, SpinnerIcon, LinkIcon, CheckCircleIcon } from '../components/Icons';
import { binanceService } from '../services/binanceService';
import { LogService } from '../services/LogService';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-dark-card rounded-3xl p-6 transition-all duration-300 hover:shadow-glow-cyan hover:-translate-y-1 ${className}`}>
        {children}
    </div>
);

type Exchange = 'binance' | 'bitget' | 'bybit';

type ExchangeData = {
    name: string;
    price: number;
    change: number;
    priceChartData: number[];
    orderBookAsks: OrderBookEntry[];
    orderBookBids: OrderBookEntry[];
    openOrders: ActiveTrade[];
    tradeHistory: TradeHistoryItem[];
};

// --- STATIC MOCK DATA for Bitget and Bybit ---
const staticExchanges: Record<'bitget' | 'bybit', ExchangeData> = {
    bitget: {
        name: "Bitget", price: 69275.20, change: 2.11,
        priceChartData: [68100, 68200, 68150, 68450, 68350, 68700, 68650, 68850, 69050, 68900, 69250, 69150],
        orderBookAsks: [ { price: 69340, amount: 0.6, total: 41604 }, { price: 69310, amount: 1.1, total: 76241 }, { price: 69290, amount: 2.2, total: 152438 },],
        orderBookBids: [ { price: 69260, amount: 0.7, total: 48482 }, { price: 69220, amount: 1.6, total: 110752 }, { price: 69210, amount: 2.9, total: 200709 },],
        openOrders: [ { id: 'T02G', type: 'Sell', assetSymbol: 'ETH', assetIcon: <EthereumIcon className="w-6 h-6 text-gray-400" />, amount: 2.5, price: 3500, user: 'You' },],
        tradeHistory: [ { id: 'H02G', type: 'Sell', assetSymbol: 'ETH', date: '2024-09-17 11:15', amount: 5, price: 3520, status: 'Completed' },]
    },
    bybit: {
        name: "Bybit", price: 69290.80, change: 2.18,
        priceChartData: [68050, 68300, 68150, 68550, 68350, 68800, 68650, 68950, 69150, 69000, 69350, 69250],
        orderBookAsks: [ { price: 69360, amount: 0.4, total: 27744 }, { price: 69330, amount: 1.3, total: 90129 }, { price: 69310, amount: 1.9, total: 131689 },],
        orderBookBids: [ { price: 69270, amount: 0.9, total: 62343 }, { price: 69230, amount: 1.4, total: 96922 }, { price: 69220, amount: 3.0, total: 207660 },],
        openOrders: [ { id: 'T01Y', type: 'Buy', assetSymbol: 'BTC', assetIcon: <BitcoinIcon className="w-6 h-6 text-yellow-500" />, amount: 0.05, price: 67950, user: 'You' },],
        tradeHistory: [ { id: 'H03Y', type: 'Buy', assetSymbol: 'ETH', date: '2024-09-16 20:00', amount: 2, price: 3480, status: 'Failed' },]
    }
};

const portfolioData: PortfolioAsset[] = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: <BitcoinIcon className="w-10 h-10 text-yellow-500" />, amount: 1.25, valueUSD: 85031.25, change: 2.5 },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: <EthereumIcon className="w-10 h-10 text-gray-400" />, amount: 15.8, valueUSD: 55456.40, change: -1.2 },
];

const LoadingOverlay: React.FC<{ text?: string }> = ({ text = "Loading Data..."}) => (
    <div className="absolute inset-0 bg-dark-card/50 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-3xl">
        <SpinnerIcon className="w-10 h-10 text-accent-cyan" />
        <p className="mt-2 text-sm">{text}</p>
    </div>
);

// --- UI Sub-components ---
const ConnectionModal: React.FC<{ 
    exchangeName: string; 
    onClose: () => void;
    onConnect: (apiKey: string, apiSecret: string) => void;
    isConnecting: boolean;
    connectionSuccess: boolean;
}> = ({ exchangeName, onClose, onConnect, isConnecting, connectionSuccess }) => {
    const [apiKey, setApiKey] = useState('');
    const [apiSecret, setApiSecret] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConnect(apiKey, apiSecret);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-dark-card rounded-3xl p-6 border border-dark-border w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-light-gray hover:text-white">&times;</button>
                <h2 className="text-xl font-bold mb-4">Connect to {exchangeName}</h2>
                {connectionSuccess ? (
                    <div className="text-center py-8">
                        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
                        <p className="mt-4 font-semibold">Connection Successful!</p>
                        <p className="text-sm text-light-gray">You can now trade on {exchangeName}.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <p className="text-sm text-light-gray mb-4">Enter your API credentials to enable trading. This is a simulation, any non-empty value will work.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-light-gray">API Key</label>
                                <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-lg h-10 px-3 mt-1" />
                            </div>
                             <div>
                                <label className="text-xs text-light-gray">API Secret</label>
                                <input type="password" value={apiSecret} onChange={e => setApiSecret(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-lg h-10 px-3 mt-1" />
                            </div>
                        </div>
                        <button type="submit" className="w-full mt-6 bg-accent-cyan text-black font-bold py-3 rounded-lg hover:bg-accent-cyan-light transition-colors disabled:bg-mid-gray flex items-center justify-center" disabled={isConnecting || !apiKey || !apiSecret}>
                            {isConnecting ? <SpinnerIcon className="w-5 h-5"/> : `Connect ${exchangeName}`}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};


const ExchangeSelector: React.FC<{ 
    selected: Exchange; 
    onSelect: (exchange: Exchange) => void;
    connections: Record<Exchange, boolean>;
    onConnectClick: (exchange: Exchange) => void;
    onDisconnect: (exchange: Exchange) => void;
}> = ({ selected, onSelect, connections, onConnectClick, onDisconnect }) => {
    // Fix: Replaced JSX.Element with React.ReactNode to avoid namespace errors.
    const exchangeOptions: { id: Exchange; name: string; icon: React.ReactNode }[] = [
        { id: 'binance', name: 'Binance', icon: <BinanceIcon className="w-6 h-6 text-yellow-400" /> },
        { id: 'bitget', name: 'Bitget', icon: <BitgetIcon className="w-6 h-6 text-blue-400" /> },
        { id: 'bybit', name: 'Bybit', icon: <BybitIcon className="w-6 h-6 text-green-400" /> },
    ];

    return (
        <Card className="mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h2 className="font-bold text-lg">Select Exchange</h2>
                <div className="flex items-center space-x-2 p-1 bg-dark-bg rounded-xl">
                    {exchangeOptions.map(ex => (
                        <button key={ex.id} onClick={() => onSelect(ex.id)} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${selected === ex.id ? 'bg-dark-card shadow-md' : 'text-light-gray hover:text-white'}`}>
                            {ex.icon} <span className="font-semibold">{ex.name}</span>
                        </button>
                    ))}
                </div>
                <div className="w-48 text-center">
                    {connections[selected] ? (
                         <div className="flex items-center gap-2">
                             <span className="text-green-400 text-sm font-semibold flex-grow text-left flex items-center gap-2"><CheckCircleIcon className="w-5 h-5"/> Connected</span>
                            <button onClick={() => onDisconnect(selected)} className="text-xs text-red-500 hover:underline">Disconnect</button>
                         </div>
                    ) : (
                         <button onClick={() => onConnectClick(selected)} className="text-sm font-semibold bg-dark-border px-4 py-2 rounded-lg hover:bg-mid-gray transition-colors flex items-center justify-center gap-2 w-full">
                            <LinkIcon /> Connect
                        </button>
                    )}
                </div>
            </div>
        </Card>
    );
};

const PriceChart: React.FC<{ data: Omit<ExchangeData, 'openOrders' | 'tradeHistory'> }> = ({ data }) => {
    const { name, price, change, priceChartData } = data;
    const [priceFlash, setPriceFlash] = useState<'up' | 'down' | 'none'>('none');
    const prevPriceRef = useRef(price);

    useEffect(() => {
        if (price > prevPriceRef.current) {
            setPriceFlash('up');
        } else if (price < prevPriceRef.current) {
            setPriceFlash('down');
        }
        prevPriceRef.current = price;
        const timer = setTimeout(() => setPriceFlash('none'), 300);
        return () => clearTimeout(timer);
    }, [price]);

    const priceColor = change >= 0 ? 'text-green-400' : 'text-red-400';
    const flashColor = priceFlash === 'up' ? 'text-green-400' : priceFlash === 'down' ? 'text-red-400' : priceColor;
    
    const maxValue = Math.max(...priceChartData);
    const minValue = Math.min(...priceChartData);
    const points = priceChartData.map((value, index) => `${(index / (priceChartData.length - 1)) * 100},${100 - ((value - minValue) / (maxValue - minValue)) * 90}`).join(' ');

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-bold">BTC/BDT on <span className="text-accent-cyan">{name}</span></h3>
                    <p className={`text-2xl font-bold transition-colors duration-200 ${flashColor}`}>{`৳${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} <span className={`text-sm font-normal ${priceColor}`}>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</span></p>
                </div>
                <div className="flex space-x-2 text-sm">
                    {['1H', '4H', '1D', '1W'].map((t, i) => <button key={t} className={`px-3 py-1 rounded-lg ${i === 2 ? 'bg-accent-cyan text-black' : 'bg-dark-bg hover:bg-dark-border'}`}>{t}</button>)}
                </div>
            </div>
            <div className="w-full h-64">
                <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                    <polyline fill="none" stroke="#71E6E9" strokeWidth="1" points={points} />
                </svg>
            </div>
        </div>
    );
};

const OrderBook: React.FC<{ asks: OrderBookEntry[], bids: OrderBookEntry[] }> = ({ asks, bids }) => (
    <div className="text-xs h-full flex flex-col">
        <div className="grid grid-cols-3 text-light-gray mb-2 px-2">
            <span>Price (BDT)</span><span className="text-right">Amount (BTC)</span><span className="text-right">Total (BDT)</span>
        </div>
        <div className="flex-grow overflow-y-auto">
            <h4 className="text-sm font-semibold text-red-400 my-2">Asks</h4>
            {asks.map(order => (
                <div key={order.price} className="grid grid-cols-3 items-center p-1 rounded hover:bg-dark-bg relative">
                    <div className="absolute top-0 right-0 h-full bg-red-500/10 transition-width duration-300" style={{ width: `${Math.min((order.total / 150000) * 100, 100)}%` }}></div>
                    <span className="text-red-400">{order.price.toFixed(2)}</span><span className="text-right">{order.amount.toFixed(4)}</span><span className="text-right">{order.total.toLocaleString()}</span>
                </div>
            ))}
            <h4 className="text-sm font-semibold text-green-400 my-2 pt-2">Bids</h4>
            {bids.map(order => (
                <div key={order.price} className="grid grid-cols-3 items-center p-1 rounded hover:bg-dark-bg relative">
                    <div className="absolute top-0 right-0 h-full bg-green-500/10 transition-width duration-300" style={{ width: `${Math.min((order.total / 150000) * 100, 100)}%` }}></div>
                    <span className="text-green-400">{order.price.toFixed(2)}</span><span className="text-right">{order.amount.toFixed(4)}</span><span className="text-right">{order.total.toLocaleString()}</span>
                </div>
            ))}
        </div>
    </div>
);

const CreateOrderForm: React.FC<{ exchangeName: string; marketPrice: number; onPlaceOrder: (order: NewOrder) => void; isDisabled: boolean; }> = ({ exchangeName, marketPrice, onPlaceOrder, isDisabled }) => {
    const [orderType, setOrderType] = useState<'Buy' | 'Sell'>('Buy');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => { setPrice(marketPrice > 0 ? marketPrice.toFixed(2) : ''); }, [marketPrice]);
    const total = parseFloat(price) * parseFloat(amount) || 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isDisabled && parseFloat(price) > 0 && parseFloat(amount) > 0) {
            onPlaceOrder({ type: orderType, price: parseFloat(price), amount: parseFloat(amount) });
            setAmount('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex border-b border-dark-border mb-4"><button type="button" onClick={() => setOrderType('Buy')} className={`px-4 py-2 text-sm font-semibold ${orderType === 'Buy' ? 'border-b-2 border-accent-cyan text-white' : 'text-light-gray'}`}>Buy</button><button type="button" onClick={() => setOrderType('Sell')} className={`px-4 py-2 text-sm font-semibold ${orderType === 'Sell' ? 'border-b-2 border-accent-cyan text-white' : 'text-light-gray'}`}>Sell</button></div>
            <div className="space-y-3">
                <div><label className="text-xs text-light-gray">Price</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-lg h-10 px-3 mt-1" disabled={isDisabled} /></div>
                <div><label className="text-xs text-light-gray">Amount</label><input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-lg h-10 px-3 mt-1" disabled={isDisabled} /></div>
                <p className="text-xs text-light-gray">Total: <span className="text-white font-semibold">{total.toFixed(2)} BDT</span></p>
                <button type="submit" className={`w-full font-bold py-3 rounded-lg text-black transition-colors ${orderType === 'Buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} disabled:bg-mid-gray disabled:cursor-not-allowed`} disabled={isDisabled || !total} > {isDisabled ? `Connect to ${exchangeName}` : `${orderType} BTC`} </button>
            </div>
        </form>
    );
};

const OrdersAndHistoryTabs: React.FC<{ data: { openOrders: ActiveTrade[], tradeHistory: TradeHistoryItem[] }, onCancelOrder: (orderId: string) => void, isLive: boolean }> = ({ data, onCancelOrder, isLive }) => {
    const [activeTab, setActiveTab] = useState('open');
    const getTradeTypeChip = (type: 'Buy' | 'Sell') => (type === 'Buy' ? <span className="text-xs font-semibold text-green-300 flex items-center gap-1"><ArrowDownLeftIcon className="w-3 h-3"/> Buy</span> : <span className="text-xs font-semibold text-red-300 flex items-center gap-1"><ArrowUpRightIcon className="w-3 h-3"/> Sell</span>);
    return (
        <div>
            <div className="flex border-b border-dark-border mb-2"><button onClick={() => setActiveTab('open')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'open' ? 'border-b-2 border-accent-cyan text-white' : 'text-light-gray'}`}>My Open Orders ({data.openOrders.length})</button><button onClick={() => setActiveTab('history')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'history' ? 'border-b-2 border-accent-cyan text-white' : 'text-light-gray'}`}>Trade History</button></div>
            <div className="text-xs overflow-y-auto h-48">
                {activeTab === 'open' && (
                    <table className="w-full text-left"><thead><tr className="text-light-gray"><th className="p-2">Type</th><th className="p-2">Amount</th><th className="p-2">Price</th><th className="p-2"></th></tr></thead><tbody>
                    {data.openOrders.map(o => <tr key={o.id} className="hover:bg-dark-bg">
                        <td className="p-2">{getTradeTypeChip(o.type)}</td><td className="p-2">{o.amount} {o.assetSymbol}</td><td className="p-2">৳{o.price.toLocaleString()}</td>
                        <td className="p-2 text-right">{isLive && <button onClick={() => onCancelOrder(o.id)} className="text-red-500 hover:underline">Cancel</button>}</td>
                    </tr>)}
                    </tbody></table>
                )}
                {activeTab === 'history' && (<table className="w-full text-left"><thead><tr className="text-light-gray"><th className="p-2">Type</th><th className="p-2">Amount</th><th className="p-2">Price</th><th className="p-2">Date</th></tr></thead><tbody>
                {data.tradeHistory.map(h => <tr key={h.id} className="hover:bg-dark-bg"><td className="p-2">{getTradeTypeChip(h.type)}</td><td className="p-2">{h.amount} {h.assetSymbol}</td><td className="p-2">৳{h.price.toLocaleString()}</td><td className="p-2 text-light-gray">{h.date.split(' ')[1]}</td></tr>)}
                </tbody></table>)}
            </div>
        </div>
    );
};

export const P2PTradingPage: React.FC = () => {
    const [selectedExchange, setSelectedExchange] = useState<Exchange>('binance');
    const [connections, setConnections] = useState<Record<Exchange, boolean>>({ binance: false, bitget: false, bybit: false });
    const [isModalOpen, setModalOpen] = useState(false);
    const [connectingExchange, setConnectingExchange] = useState<Exchange | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionSuccess, setConnectionSuccess] = useState(false);
    
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [binanceData, setBinanceData] = useState<Omit<ExchangeData, 'name' | 'tradeHistory' | 'openOrders'> | null>(null);
    const [myBinanceOrders, setMyBinanceOrders] = useState<ActiveTrade[]>([]);

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;
        if (selectedExchange === 'binance' && connections.binance) {
            setLoading(true); setError(null);
            const fetchInitial = async () => {
                try {
                    const data = await binanceService.getInitialData();
                    setBinanceData({ price: data.price, change: data.change, priceChartData: data.priceChartData, orderBookAsks: data.orderBook.asks, orderBookBids: data.orderBook.bids });
                    setMyBinanceOrders(data.openOrders);
                } catch { setError("Failed to load Binance data."); LogService.log('Failed to load initial Binance market data.', 'ERROR'); } finally { setLoading(false); }
            };
            fetchInitial();
            intervalId = setInterval(async () => {
                try {
                    const update = await binanceService.getMarketUpdate();
                    setBinanceData(prev => prev ? { ...prev, price: update.price, change: update.change, priceChartData: update.priceChartData, orderBookAsks: update.orderBook.asks, orderBookBids: update.orderBook.bids } : null);
                } catch { console.error("Failed to update market data."); }
            }, 5000);
        } else {
            setBinanceData(null);
        }
        return () => { if (intervalId) clearInterval(intervalId); };
    }, [selectedExchange, connections.binance]);

    const handlePlaceOrder = async (order: NewOrder) => { LogService.log(`Placing ${order.type} order for ${order.amount} BTC at ৳${order.price}.`, 'INFO'); const newOrder = await binanceService.placeOrder(order); setMyBinanceOrders(prev => [newOrder, ...prev]); LogService.log(`Order ${newOrder.id} placed successfully.`, 'INFO'); };
    const handleCancelOrder = async (orderId: string) => { LogService.log(`Cancelling order ${orderId}.`, 'INFO'); await binanceService.cancelOrder(orderId); setMyBinanceOrders(prev => prev.filter(o => o.id !== orderId)); LogService.log(`Order ${orderId} cancelled.`, 'INFO'); };

    const handleConnectClick = (exchange: Exchange) => { setConnectingExchange(exchange); setModalOpen(true); };
    const handleDisconnect = (exchange: Exchange) => { setConnections(prev => ({ ...prev, [exchange]: false })); LogService.log(`Disconnected from ${exchange} exchange.`, 'INFO');};
    const handleConnect = (apiKey: string, apiSecret: string) => {
        if (!connectingExchange) return;
        setIsConnecting(true);
        LogService.log(`Attempting to connect to ${connectingExchange} exchange.`, 'INFO');
        setTimeout(() => {
            setIsConnecting(false);
            if (apiKey && apiSecret) {
                setConnectionSuccess(true);
                setConnections(prev => ({ ...prev, [connectingExchange]: true }));
                LogService.log(`Successfully connected to ${connectingExchange}.`, 'INFO');
                setTimeout(() => {
                    setModalOpen(false); setConnectionSuccess(false); setConnectingExchange(null);
                }, 1500);
            } else {
                 LogService.log(`Connection to ${connectingExchange} failed. API key or secret missing.`, 'WARN');
            }
        }, 1000);
    };
    const closeModal = () => { setModalOpen(false); setConnectionSuccess(false); setConnectingExchange(null); };

    const isCurrentExchangeConnected = connections[selectedExchange];
    const currentExchangeData: ExchangeData | null = selectedExchange === 'binance' 
        ? (binanceData ? { ...binanceData, name: 'Binance', openOrders: myBinanceOrders, tradeHistory: [] } : null) 
        : staticExchanges[selectedExchange];

    return (
        <div className="mt-6 pb-6">
            {isModalOpen && connectingExchange && <ConnectionModal exchangeName={connectingExchange} onClose={closeModal} onConnect={handleConnect} isConnecting={isConnecting} connectionSuccess={connectionSuccess} />}
            <h1 className="text-2xl font-bold">P2P Trading Desk</h1>
            <div className="mt-4"><ExchangeSelector selected={selectedExchange} onSelect={setSelectedExchange} connections={connections} onConnectClick={handleConnectClick} onDisconnect={handleDisconnect} /></div>
            <div className="grid grid-cols-12 gap-6 relative">
                {selectedExchange === 'binance' && loading && isCurrentExchangeConnected && <div className="col-span-12"><LoadingOverlay/></div>}
                {!isCurrentExchangeConnected && <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-md z-20 flex items-center justify-center rounded-3xl text-center p-4"><p>Please connect to <span className="font-bold capitalize">{selectedExchange}</span> to view market data and start trading.</p></div>}

                {error && <p className="col-span-12 text-red-500 text-center">{error}</p>}
                {currentExchangeData && <>
                    <div className="col-span-12 lg:col-span-9 flex flex-col gap-6"><Card><PriceChart data={currentExchangeData} /></Card>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                            <div className="md:col-span-3"><Card className="h-full"><OrdersAndHistoryTabs data={currentExchangeData} onCancelOrder={handleCancelOrder} isLive={selectedExchange === 'binance' && isCurrentExchangeConnected} /></Card></div>
                            <div className="md:col-span-2"><Card className="h-full"><CreateOrderForm exchangeName={currentExchangeData.name} marketPrice={currentExchangeData.price} onPlaceOrder={handlePlaceOrder} isDisabled={!isCurrentExchangeConnected} /></Card></div>
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                        <Card className="flex-grow h-96"><h2 className="font-bold text-lg mb-4">Order Book <span className="text-sm text-light-gray font-normal">({currentExchangeData.name})</span></h2><OrderBook asks={currentExchangeData.orderBookAsks} bids={currentExchangeData.orderBookBids} /></Card>
                        <Card><h2 className="font-bold text-lg mb-4">Portfolio</h2><div className="space-y-4">
                            {portfolioData.map(asset => (<div key={asset.id} className="flex items-center space-x-4">{asset.icon}
                                <div className="flex-grow"><p className="font-bold">{asset.name}</p><p className="text-sm text-light-gray">{asset.amount} {asset.symbol}</p></div>
                                <div className="text-right"><p className="font-semibold">৳{asset.valueUSD.toLocaleString()}</p><div className={`flex items-center justify-end text-xs ${asset.change > 0 ? 'text-green-400' : 'text-red-400'}`}>{asset.change > 0 ? <TrendingUpIcon className="w-3 h-3 mr-1"/> : <TrendingDownIcon className="w-3 h-3 mr-1"/>}{Math.abs(asset.change)}%</div></div>
                            </div>))}
                        </div></Card>
                    </div>
                </>}
            </div>
        </div>
    );
};