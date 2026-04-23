import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ApiService } from './services/apiService';
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  History, 
  Settings, 
  Search, 
  Bell, 
  ArrowUpRight, 
  ArrowDownRight,
  Menu,
  X,
  Plus,
  ArrowRight,
  Activity,
  BarChart3,
  Globe,
  Clock,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  CreditCard,
  Banknote,
  ShieldCheck,
  Zap,
  ArrowUpDown,
  User,
  Minus,
  Shuffle,
  Anchor,
  TrendingDown,
  Hexagon,
  Sun,
  Moon,
  Camera,
  MessageSquare,
  Send,
  MessageCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart
} from 'recharts';
import { cn } from './lib/utils';
import { MOCK_ASSETS, MOCK_USER, MOCK_PLATFORM_USERS, MOCK_PLATFORM_STATS, Asset, Trade } from './mockData';

// Custom Candlestick Component for professional clear rendering
const CandleStick = (props: any) => {
  const { x, y, width, height, payload } = props;
  if (!payload || height === undefined) return null;
  
  const isUp = payload.close >= payload.open;
  const color = isUp ? '#22c55e' : '#ef4444'; // High-contrast Emerald/Rose
  
  // High/Low wick calculation based on body height and price range
  const priceRange = Math.abs(payload.close - payload.open);
  const candleHeight = Math.max(2, height);
  const ratio = candleHeight / Math.max(0.00001, priceRange);
  
  const openCloseMax = Math.max(payload.open, payload.close);
  const openCloseMin = Math.min(payload.open, payload.close);
  
  const highPixel = y - (payload.high - openCloseMax) * ratio;
  const lowPixel = y + height + (openCloseMin - payload.low) * ratio;

  return (
    <g>
      {/* Wick line */}
      <line 
        x1={x + width / 2} 
        y1={highPixel} 
        x2={x + width / 2} 
        y2={lowPixel} 
        stroke={color} 
        strokeWidth={1.5} 
      />
      {/* Real-time Body */}
      <rect 
        x={x} 
        y={y} 
        width={width} 
        height={candleHeight} 
        fill={color} 
        rx={0.5}
      />
    </g>
  );
};
import AuthPage from './components/AuthPage';

// --- Shared Components ---

const ThemeToggle = ({ theme, setTheme }: { theme: 'dark' | 'light', setTheme: (t: 'dark' | 'light') => void }) => {
  return (
    <button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-xl bg-[var(--panel-bg)] border border-[var(--panel-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

const Sidebar = ({ activeTab, setActiveTab, user, onLogout, theme, setTheme }: { activeTab: string, setActiveTab: (t: string) => void, user: typeof MOCK_USER, onLogout: () => void, theme: 'dark' | 'light', setTheme: (t: 'dark' | 'light') => void }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'markets', label: 'Trading', icon: TrendingUp },
    { id: 'news', label: 'News', icon: Globe },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Account', icon: Settings },
    { id: 'admin', label: 'Terminal Admin', icon: ShieldCheck, adminOnly: true },
  ].filter(tab => !tab.adminOnly || user.isAdmin);

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-[var(--panel-border)] bg-[var(--background)] fixed left-0 top-0 z-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Hexagon className="text-white w-5 h-5 fill-white/10" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Apex Financial</span>
          </div>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>

        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                activeTab === tab.id 
                  ? "bg-indigo-600/10 text-indigo-500" 
                  : "text-[var(--text-secondary)] hover:bg-[var(--panel-bg)] hover:text-[var(--text-primary)]"
              )}
            >
              <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-indigo-500" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]")} />
              <span className="text-sm font-semibold">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="sidebar-indicator"
                  className="ml-auto w-1 h-5 bg-indigo-600 rounded-full"
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-[var(--panel-border)] space-y-4">
        <div className="flex items-center gap-3">
          <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-[var(--panel-border)]" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[var(--text-primary)]">{user.name}</span>
            <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold tracking-wider">{user.isAdmin ? 'Terminal Admin' : 'Professional'}</span>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-rose-500/10 hover:text-rose-500 transition-all font-bold text-xs uppercase tracking-widest"
        >
          <X className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

const Header = ({ title, showSearch = true }: { title: string, showSearch?: boolean }) => (
  <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl md:text-3xl font-black md:font-bold tracking-tight text-[var(--text-primary)] uppercase md:capitalize">{title}</h1>
        <p className="text-[var(--text-secondary)] text-[10px] md:text-sm mt-1 uppercase md:normal-case tracking-widest md:tracking-normal">Markets: <span className="text-emerald-400 font-black">Open</span></p>
      </div>
      <div className="flex md:hidden items-center gap-2">
         <button className="p-2 rounded-xl bg-[var(--panel-bg)] border border-[var(--panel-border)] relative">
            <Bell className="w-4 h-4 text-[var(--text-secondary)]" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
         </button>
      </div>
    </div>
    <div className="flex items-center gap-3">
      {showSearch && (
        <div className="relative flex-1 md:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-2xl md:rounded-full pl-10 pr-4 py-2.5 md:py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600 w-full md:w-64 transition-all font-medium text-[var(--text-primary)]"
          />
        </div>
      )}
      <button className="hidden md:block p-2.5 rounded-full bg-[var(--panel-bg)] border border-[var(--panel-border)] relative hover:bg-[var(--panel-bg)]/80 transition-colors">
        <Bell className="w-4 h-4 text-[var(--text-secondary)]" />
        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
      </button>
      <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-xl transition-colors">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">Equity</span>
          <span className="text-sm font-bold text-[var(--text-primary)]">${MOCK_USER.equity.toLocaleString()}</span>
        </div>
        <div className="w-px h-6 bg-[var(--panel-border)]" />
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">Profit</span>
          <span className="text-sm font-bold text-emerald-400">+$1,515.90</span>
        </div>
      </div>
    </div>
  </header>
);

// --- View: Dashboard ---

const DashboardView = ({ setActiveTab, user, assets, onCloseTrade, onUpdateAvatar }: { 
  setActiveTab: (t: string) => void, 
  user: typeof MOCK_USER, 
  assets: Asset[], 
  onCloseTrade: (id: string) => void,
  onUpdateAvatar: (url: string) => void 
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-20">
      <Header title="Mission Control" />
      
      {/* User Profile & Balance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl flex flex-col items-center text-center">
          <div className="relative mb-4 group cursor-pointer" onClick={handleAvatarClick}>
            <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-indigo-600/20 shadow-2xl shadow-indigo-600/10 group-hover:opacity-60 transition-all duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
               <div className="bg-indigo-600 p-2.5 rounded-full shadow-xl">
                  <Camera className="w-5 h-5 text-white" />
               </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-[var(--background)] rounded-full shadow-lg shadow-emerald-500/20" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">{user.name}</h2>
          <button 
            onClick={handleAvatarClick}
            className="text-[9px] text-indigo-400 uppercase font-black tracking-widest mt-1 hover:text-indigo-300 transition-colors"
          >
            Update Identity File
          </button>
          <span className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest mt-4">Tier 3 Terminal Operator</span>
          <div className="grid grid-cols-2 gap-4 w-full mt-8">
            <div className="flex flex-col p-3 rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)]">
              <span className="text-[9px] text-[var(--text-secondary)] uppercase font-bold">Leverage</span>
              <span className="text-sm font-bold text-indigo-400">1:500</span>
            </div>
            <div className="flex flex-col p-3 rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)]">
               <span className="text-[9px] text-[var(--text-secondary)] uppercase font-bold">Region</span>
               <span className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-tighter">GB / LON</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-transparent border-indigo-600/20 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 hidden md:block">
            <Activity className="w-32 h-32 text-white opacity-[0.03] -rotate-12" />
          </div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Operational Liquidity</span>
              <div className="flex gap-2">
                 <button onClick={() => setActiveTab('settings')} className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
                    <Plus className="w-3 h-3" /> Deposit
                 </button>
                 <button onClick={() => setActiveTab('settings')} className="flex-1 sm:flex-none px-4 py-2.5 bg-[var(--panel-bg)] text-[var(--text-primary)] border border-[var(--panel-border)] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--panel-border)] transition-all flex items-center justify-center gap-2">
                    <ArrowDownRight className="w-3 h-3" /> Withdraw
                 </button>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tighter tabular-nums">${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <div className="px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20 text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Live</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4 mt-8">
            <div className="flex flex-col min-w-[100px]">
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest mb-1">Equity</span>
              <span className="text-xl font-black text-[var(--text-primary)] tabular-nums">${user.equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex flex-col min-w-[100px]">
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest mb-1">Free Margin</span>
              <span className="text-xl font-black text-[var(--text-primary)] tabular-nums">${user.freeMargin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex flex-col min-w-[100px]">
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest mb-1">Profit / Loss</span>
              <span className={cn("text-xl font-black tabular-nums", (user.equity - user.balance) >= 0 ? "text-emerald-500" : "text-rose-500")}>
                {(user.equity - user.balance) >= 0 ? '+' : ''}${(user.equity - user.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Trades Section */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl mt-6">
        <div className="p-4 md:p-6 border-b border-[var(--panel-border)] bg-[var(--panel-bg)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center shrink-0">
               <Activity className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-black text-[var(--text-primary)] uppercase tracking-[.15em]">Live Operations</h3>
              <p className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-tighter">Real-time terminal execution status</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 self-start sm:self-auto">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">Linked</span>
          </div>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest border-b border-[var(--panel-border)] bg-[var(--panel-bg)]">
              <tr>
                <th className="px-6 py-5">Instrument</th>
                <th className="px-4 py-5">Signal</th>
                <th className="px-4 py-5">Lot</th>
                <th className="px-4 py-5">Entry</th>
                <th className="px-4 py-5 text-right font-black">Net P/L</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--panel-border)]/30">
              {user.trades.filter(t => t.status === 'OPEN').map((trade) => (
                <tr key={trade.id} className="hover:bg-indigo-600/5 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-[var(--text-primary)] tracking-widest">{trade.symbol}</span>
                      <span className="text-[9px] text-[var(--text-secondary)] uppercase font-bold tracking-tighter">{trade.time}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase border", trade.type === 'BUY' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20")}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-4 py-5 font-mono font-black text-[var(--text-primary)]">{trade.lot.toFixed(2)}</td>
                  <td className="px-4 py-5 font-mono text-[var(--text-secondary)]">{trade.openPrice.toFixed(4)}</td>
                  <td className={cn("px-4 py-5 text-right font-black font-mono text-lg tracking-tighter tabular-nums", trade.profit >= 0 ? "text-emerald-500" : "text-rose-500")}>
                    {trade.profit >= 0 ? '+' : ''}{trade.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => onCloseTrade(trade.id)}
                      className="p-2.5 rounded-xl bg-[var(--background)] hover:bg-rose-500/20 text-[var(--text-secondary)] hover:text-rose-500 transition-all border border-[var(--panel-border)] active:scale-95"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col divide-y divide-zinc-900/50">
          {user.trades.filter(t => t.status === 'OPEN').map((trade) => (
             <div key={trade.id} className="p-4 flex flex-col gap-4 bg-zinc-950/20">
                <div className="flex justify-between items-start">
                   <div className="flex flex-col">
                      <span className="text-sm font-black text-white tracking-widest">{trade.symbol}</span>
                      <span className="text-[9px] text-zinc-600 uppercase font-bold">{trade.time}</span>
                   </div>
                   <div className="flex items-center gap-2">
                       <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase border", trade.type === 'BUY' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20")}>
                          {trade.type}
                       </span>
                       <button onClick={() => onCloseTrade(trade.id)} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-rose-500">
                          <X className="w-3 h-3" />
                       </button>
                   </div>
                </div>
                <div className="flex justify-between items-end">
                   <div className="flex gap-4">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-600 font-black uppercase tracking-tighter mb-0.5" >Lot</span>
                        <span className="text-xs font-black text-white tabular-nums">{trade.lot.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-600 font-black uppercase tracking-tighter mb-0.5">Entry</span>
                        <span className="text-xs font-black text-zinc-400 font-mono tracking-tighter italic">{trade.openPrice.toFixed(4)}</span>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-tighter mb-0.5">Net P/L</span>
                      <span className={cn("text-xl font-black font-mono tracking-tighter tabular-nums", trade.profit >= 0 ? "text-emerald-400" : "text-rose-400")}>
                        {trade.profit >= 0 ? '+' : ''}{trade.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                   </div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- View: Markets (Trading Terminal) ---

// --- View: Markets (Trading Terminal) ---

const MarketsView = ({ selectedAsset, setSelectedAsset, assets, onPlaceTrade }: { selectedAsset: Asset, setSelectedAsset: (a: Asset) => void, assets: Asset[], onPlaceTrade: (type: 'BUY' | 'SELL', lot: number) => void }) => {
  const [lot, setLot] = useState('100');
  const [time, setTime] = useState('01:00');
  const [isAssetMenuOpen, setIsAssetMenuOpen] = useState(false);
  const [chartType, setChartType] = useState<'AREA' | 'CANDLE'>('CANDLE');
  const [timeframe, setTimeframe] = useState('1m');
  const [zoomLevel, setZoomLevel] = useState(1); // 1 is default, higher is more zoomed in
  const [panOffset, setPanOffset] = useState(0); // number of data points shifted
  
  // Slice data based on zoom and pan
  const dataSize = selectedAsset.sparkline.length;
  const visibleCount = Math.max(10, Math.floor(dataSize / zoomLevel));
  const maxOffset = dataSize - visibleCount;
  const clampedOffset = Math.min(Math.max(0, panOffset), maxOffset);
  
  const visibleData = selectedAsset.sparkline.slice(
    dataSize - visibleCount - clampedOffset,
    dataSize - clampedOffset
  ).map(d => ({
    ...d,
    ohlc: [d.open, d.close]
  }));

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      setZoomLevel(prev => Math.min(prev + 0.5, 10));
    } else {
      setZoomLevel(prev => Math.max(prev - 0.5, 1));
    }
  };

  const [isPanning, setIsPanning] = useState(false);
  const [lastX, setLastX] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setLastX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const deltaX = e.clientX - lastX;
    if (Math.abs(deltaX) > 5) {
      const shift = Math.floor(deltaX / 10);
      setPanOffset(prev => Math.min(Math.max(0, prev + shift), maxOffset));
      setLastX(e.clientX);
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  // Direction calculation (from start of visible window to end)
  const firstVisible = visibleData[0];
  const lastVisible = visibleData[visibleData.length - 1];
  const isBullish = lastVisible && firstVisible ? lastVisible.close >= firstVisible.open : true;
  
  // Trend identification for UI display
  const currentTrend = selectedAsset.trend || 'NEUTRAL';

  return (
    <div className="flex-1 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-0 bg-[var(--background)]">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[var(--panel-bg)] border border-[var(--panel-border)] p-4 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsAssetMenuOpen(!isAssetMenuOpen)}
              className="flex items-center gap-4 px-6 py-3 bg-[var(--background)] border border-[var(--panel-border)] rounded-2xl hover:border-indigo-500/50 transition-all shadow-sm group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-sm font-black text-[var(--text-primary)] tracking-[0.1em]">{selectedAsset.symbol}</span>
                <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase opacity-60">Currency Pair</span>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-[var(--text-secondary)] transition-transform duration-300", isAssetMenuOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isAssetMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-3 w-[400px] bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-[2.5rem] shadow-2xl z-[100] overflow-hidden backdrop-blur-2xl"
                >
                  <div className="p-6 border-b border-[var(--panel-border)] bg-[var(--background)]/50 flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">Global Markets</span>
                       <span className="text-[8px] text-emerald-500 font-bold uppercase italic">88% Payout Guaranteed</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                       <span className="text-[8px] font-black text-emerald-500 uppercase">Live Transmission</span>
                    </div>
                  </div>
                  <div className="overflow-y-auto max-h-[400px] p-4 space-y-2 custom-scrollbar">
                    {assets.map((asset) => (
                      <div 
                        key={asset.id}
                        onClick={() => {
                          setSelectedAsset(asset);
                          setIsAssetMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border",
                          selectedAsset.id === asset.id 
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-600/20" 
                            : "bg-transparent border-transparent hover:bg-[var(--background)] hover:border-[var(--panel-border)]"
                        )}
                      >
                        <div className="flex items-center gap-4">
                           <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs", selectedAsset.id === asset.id ? "bg-white/20 text-white" : "bg-[var(--background)] text-indigo-500")}>
                              {asset.symbol.substring(0, 1)}
                           </div>
                           <div className="flex flex-col">
                             <span className={cn("text-sm font-black tracking-tight", selectedAsset.id === asset.id ? "text-white" : "text-[var(--text-primary)]")}>{asset.symbol}</span>
                             <span className={cn("text-[8px] font-bold uppercase", selectedAsset.id === asset.id ? "text-indigo-100/60" : "text-[var(--text-secondary)]")}>{asset.name}</span>
                           </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={cn("text-sm font-mono font-bold", selectedAsset.id === asset.id ? "text-white" : "text-[var(--text-primary)]")}>{(asset.price || 0).toFixed(4)}</span>
                          <span className={cn("text-[9px] font-black", asset.change24h >= 0 ? (selectedAsset.id === asset.id ? "text-emerald-300" : "text-emerald-500") : (selectedAsset.id === asset.id ? "text-rose-300" : "text-rose-500"))}>
                             {asset.change24h >= 0 ? '+' : ''}{(asset.change24h || 0).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 h-12">
             <div className="h-full w-px bg-[var(--panel-border)]" />
             <div className="flex flex-col">
                <span className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-widest">Payout</span>
                <span className="text-xl font-black text-emerald-500">+88%</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden lg:flex items-center gap-1 bg-[var(--background)] rounded-2xl p-1 border border-[var(--panel-border)]">
             {['1s', '5s', '1m', '5m', '1h'].map(t => (
               <button 
                key={t} 
                onClick={() => setTimeframe(t)}
                className={cn(
                  "px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all", 
                  t === timeframe ? "bg-indigo-600 text-white shadow-lg" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
               >
                 {t}
               </button>
             ))}
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-widest leading-none mb-1">Server Clock</span>
              <span className="text-xs font-mono font-bold text-[var(--text-primary)]">13:38:53 UTC</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col xl:flex-row gap-6 min-h-0">
        {/* Trading Canvas (Pocket Option Style) */}
        <div className="flex-1 min-h-[500px] flex flex-col glass-panel rounded-[3rem] overflow-hidden relative shadow-2xl bg-[#0d1117] border border-[var(--panel-border)] shadow-indigo-500/5">
          {/* Real-time Indicator Overlays */}
          <div className="absolute top-10 left-10 z-10 space-y-2 pointer-events-none">
             <h2 className="text-4xl font-black text-white italic tracking-tighter opacity-40 uppercase tracking-widest">{selectedAsset.symbol}</h2>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                   <div className={cn("w-2.5 h-2.5 rounded-full animate-ping", isBullish ? "bg-emerald-500" : "bg-rose-500")} />
                   <span className={cn("text-2xl font-mono font-bold tabular-nums drop-shadow-2xl", isBullish ? "text-emerald-400" : "text-rose-400")}>
                     {(selectedAsset.price || 0).toFixed(4)}
                   </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/40 border border-white/5 backdrop-blur-md">
                   {isBullish ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-500" />}
                   <span className={cn("text-[10px] font-black uppercase tracking-widest", isBullish ? "text-emerald-500" : "text-rose-500")}>
                      {isBullish ? 'Bullish' : 'Bearish'}
                   </span>
                </div>
                {selectedAsset.trend && selectedAsset.trend !== 'RANDOM' && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-600/20 border border-indigo-600/30 backdrop-blur-md">
                    <Zap className="w-3 h-3 text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                      Trend: {selectedAsset.trend}
                    </span>
                  </div>
                )}
             </div>
          </div>

          <div 
            className="w-full h-[450px] relative mt-16 px-4 cursor-crosshair select-none"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {chartType === 'AREA' ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visibleData}>
                  <defs>
                    <linearGradient id="tradingGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00b97a" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="#00b97a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#161b22] border border-zinc-800 p-4 rounded-2xl shadow-3xl">
                            <span className="text-[10px] font-black text-zinc-500 block uppercase tracking-widest mb-1 font-mono">Index Value</span>
                            <span className="text-xl font-mono font-bold text-white">{(parseFloat(payload[0].value as string) || 0).toFixed(4)}</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                    cursor={{ stroke: '#00b97a', strokeWidth: 2, strokeDasharray: '4 4' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00b97a" 
                    fill="url(#tradingGrad)" 
                    strokeWidth={4} 
                    isAnimationActive={true}
                    animationDuration={1000}
                    activeDot={{ r: 8, fill: '#fff', stroke: '#00b97a', strokeWidth: 3 }}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={visibleData}>
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#161b22] border border-zinc-800 p-5 rounded-2xl shadow-3xl">
                            <span className="text-[10px] font-black text-zinc-500 block uppercase tracking-widest mb-3 font-mono">Market Intel</span>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                               <div className="flex flex-col">
                                  <span className="text-[8px] text-zinc-500 uppercase font-black">Open</span>
                                  <span className="text-sm font-mono font-bold text-white">{(data.open || 0).toFixed(4)}</span>
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[8px] text-zinc-500 uppercase font-black">Close</span>
                                  <span className="text-sm font-mono font-bold text-white">{(data.close || 0).toFixed(4)}</span>
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[8px] text-zinc-500 uppercase font-black">High</span>
                                  <span className="text-sm font-mono font-bold text-emerald-500">{(data.high || 0).toFixed(4)}</span>
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[8px] text-zinc-500 uppercase font-black">Low</span>
                                  <span className="text-sm font-mono font-bold text-rose-500">{(data.low || 0).toFixed(4)}</span>
                               </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                    cursor={{ stroke: '#ffffff10', strokeWidth: 1 }}
                  />
                  <Bar 
                    dataKey="ohlc" 
                    shape={<CandleStick />} 
                    isAnimationActive={true}
                    animationDuration={800}
                  />
                  {/* SMA (Simple Moving Average) Trend Line */}
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#6366f1" 
                    strokeWidth={2} 
                    dot={false} 
                    strokeDasharray="5 5"
                    opacity={0.3}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
            
          </div>
        </div>

        {/* Execution Terminal (Focused & Urgent) */}
        <div className="w-full xl:w-96 flex flex-col gap-4">
          <div className="glass-panel p-8 rounded-[3rem] bg-[var(--panel-bg)] shadow-2xl border border-[var(--panel-border)] flex flex-col gap-10 flex-1 overflow-y-auto custom-scrollbar">
            
            <div className="space-y-8">
              {/* Timing Node */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Expiration</label>
                   <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <div className="flex items-center gap-4 bg-[var(--background)] p-2 rounded-[2rem] border border-[var(--panel-border)] shadow-inner">
                  <button onClick={() => setTime('00:30')} className="w-12 h-12 bg-[var(--panel-border)] rounded-2xl flex items-center justify-center hover:bg-rose-500/10 hover:text-rose-500 transition-all font-black">-</button>
                  <div className="flex-1 flex flex-col items-center">
                    <span className="text-2xl font-black text-[var(--text-primary)] font-mono tracking-tighter">{time}</span>
                    <span className="text-[8px] font-black text-indigo-500/60 uppercase">Duration Profile</span>
                  </div>
                  <button onClick={() => setTime('02:00')} className="w-12 h-12 bg-[var(--panel-border)] rounded-2xl flex items-center justify-center hover:bg-emerald-500/10 hover:text-emerald-500 transition-all font-black">+</button>
                </div>
              </div>

              {/* Amount Node */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Investment Size</label>
                   <Wallet className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <div className="flex items-center gap-4 bg-[var(--background)] p-2 rounded-[2rem] border border-[var(--panel-border)] shadow-inner">
                  <button onClick={() => setLot((prev) => Math.max(10, parseInt(prev) - 50).toString())} className="w-12 h-12 bg-[var(--panel-border)] rounded-2xl flex items-center justify-center hover:bg-[var(--panel-border)] transition-all font-black">-</button>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-black text-[var(--text-secondary)]">$</span>
                      <input 
                        type="text" 
                        value={lot}
                        onChange={(e) => setLot(e.target.value)}
                        className="w-20 bg-transparent border-none text-center font-black text-[var(--text-primary)] font-mono text-2xl focus:ring-0 p-0"
                      />
                    </div>
                    <span className="text-[8px] font-black text-emerald-500 uppercase">Capital Locked</span>
                  </div>
                  <button onClick={() => setLot((prev) => (parseInt(prev) + 50).toString())} className="w-12 h-12 bg-[var(--panel-border)] rounded-2xl flex items-center justify-center hover:bg-[var(--panel-border)] transition-all font-black">+</button>
                </div>
              </div>
            </div>

            {/* EXECUTION BUTTONS */}
            <div className="space-y-5">
              <button 
                onClick={() => onPlaceTrade('BUY', parseFloat(lot))}
                className="w-full group relative h-28 bg-[#00b97a] hover:bg-[#00c582] rounded-[2.5rem] shadow-2xl shadow-emerald-500/20 active:scale-[0.97] transition-all overflow-hidden"
              >
                <div className="relative z-10 flex flex-col items-center">
                   <ChevronUp className="w-10 h-10 text-white drop-shadow-lg group-hover:-translate-y-1 transition-transform" />
                   <span className="text-3xl font-black text-white uppercase tracking-tighter italic">Higher</span>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                   <TrendingUp className="w-20 h-20 text-white" />
                </div>
              </button>

              <button 
                onClick={() => onPlaceTrade('SELL', parseFloat(lot))}
                className="w-full group relative h-28 bg-[#fe3355] hover:bg-[#ff4466] rounded-[2.5rem] shadow-2xl shadow-rose-500/20 active:scale-[0.97] transition-all overflow-hidden"
              >
                <div className="relative z-10 flex flex-col items-center">
                   <span className="text-3xl font-black text-white uppercase tracking-tighter italic">Lower</span>
                   <ChevronDown className="w-10 h-10 text-white drop-shadow-lg group-hover:translate-y-1 transition-transform" />
                </div>
                <div className="absolute top-0 left-0 p-8 opacity-10 -rotate-12">
                   <TrendingDown className="w-20 h-20 text-white" />
                </div>
              </button>
            </div>

            <div className="mt-auto space-y-4">
               <div className="flex justify-between items-center bg-[var(--background)] p-4 rounded-3xl border border-[var(--panel-border)]">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Expected Profit</span>
                     <span className="text-xs font-black text-emerald-500">Fixed +88% Return</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-500 tabular-nums">${(parseFloat(lot) * 1.88).toFixed(2)}</span>
               </div>
               
               <div className="p-5 rounded-3xl bg-indigo-600/5 border border-indigo-600/10">
                  <div className="flex items-center gap-2 mb-2">
                     <Activity className="w-3.5 h-3.5 text-indigo-500" />
                     <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Signal Strength</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--panel-border)] rounded-full overflow-hidden">
                     <div className="w-[78%] h-full bg-indigo-500 animate-pulse" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- View: Support Chat Overlay ---

const SupportChat = ({ isOpen, onClose, messages, onSendMessage }: { isOpen: boolean, onClose: () => void, messages: any[], onSendMessage: (txt: string) => void }) => {
  const [input, setInput] = useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 50, x: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50, x: 50 }}
          className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] glass-panel rounded-[2.5rem] shadow-2xl z-[100] flex flex-col overflow-hidden border-2 border-indigo-600/20 bg-[var(--background)]/90 backdrop-blur-2xl"
        >
          <div className="bg-indigo-600 p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
               </div>
               <div className="flex flex-col">
                  <span className="text-sm font-black text-white uppercase tracking-widest">Apex Support</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-indigo-100/60 uppercase">Operational</span>
                  </div>
               </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex flex-col max-w-[80%]", msg.sender === 'user' ? "ml-auto items-end" : "mr-auto items-start")}>
                <div className={cn(
                  "p-4 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm",
                  msg.sender === 'user' ? "bg-indigo-600 text-white rounded-tr-none" : "bg-[var(--panel-bg)] text-[var(--text-primary)] border border-[var(--panel-border)] rounded-tl-none"
                )}>
                  {msg.text}
                </div>
                <span className="text-[8px] font-bold text-[var(--text-secondary)] uppercase mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[var(--panel-bg)] border-t border-[var(--panel-border)]">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Secure message..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { onSendMessage(input); setInput(''); } }}
                className="flex-1 bg-[var(--background)] border border-[var(--panel-border)] rounded-xl px-4 py-3 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
              <button 
                onClick={() => { onSendMessage(input); setInput(''); }}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- View: Portfolio (Forex Terminal) ---

// --- View: News ---

const NewsView = () => {
    const news = [
        { id: 1, title: "Federal Reserve hints at interest rate cuts in upcoming Q3 meeting", source: "Market Watch", time: "12m ago", impact: "High" },
        { id: 2, title: "EUR/USD breaks key resistance level at 1.0850 amid dollar weakness", source: "FX Street", time: "45m ago", impact: "Medium" },
        { id: 3, title: "Gold prices hit all-time high as safe-haven demand surges globally", source: "Bloomberg", time: "2h ago", impact: "High" },
        { id: 4, title: "BoE Governor Bailey speaks on inflation targets and monetary policy", source: "Reuters", time: "3h ago", impact: "High" },
        { id: 5, title: "Nikkei 225 slides as Yen intervention fears grow in Tokyo", source: "Nikkei Asia", time: "5h ago", impact: "Medium" }
    ];

    return (
        <div className="h-full flex flex-col gap-6 animate-in slide-in-from-right duration-500">
            <Header title="Market Intelligence" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {news.map((item) => (
                        <div key={item.id} className="glass-panel p-6 rounded-3xl hover:bg-indigo-600/5 transition-all border group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border",
                                        item.impact === 'High' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                                    )}>
                                        {item.impact} Impact
                                    </div>
                                    <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">{item.source} • {item.time}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-indigo-600 transition-colors leading-tight">{item.title}</h3>
                        </div>
                    ))}
                </div>
                <div className="space-y-6 text-sm text-zinc-500">
                    <div className="glass-panel p-6 rounded-3xl bg-indigo-600/10 border-indigo-600/20">
                         <h4 className="text-indigo-400 font-black uppercase tracking-widest text-[10px] mb-4">Economic Calendar</h4>
                         <div className="space-y-4">
                            {[
                                { event: "USD CPI m/m", time: "Today 15:30", forecast: "0.4%", prev: "0.3%" },
                                { event: "GBP GDP q/q", time: "Tomorrow 09:00", forecast: "0.1%", prev: "0.0%" },
                                { event: "EUR ECB Press Conf", time: "Thu 14:45", forecast: "--", prev: "--" },
                            ].map((cal, i) => (
                                <div key={i} className="flex flex-col gap-1 pb-3 border-b border-white/5">
                                    <div className="flex justify-between font-bold text-zinc-300">
                                        <span>{cal.event}</span>
                                        <span className="text-white font-mono">{cal.time}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] uppercase font-black tracking-tighter">
                                        <span>F: {cal.forecast}</span>
                                        <span>P: {cal.prev}</span>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- View: History ---

const HistoryView = ({ user }: { user: typeof MOCK_USER }) => {
    const closedTrades = user.trades.filter(t => t.status === 'CLOSED');
    const totalPL = closedTrades.reduce((sum, t) => sum + t.profit, 0);

    return (
      <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
        <Header title="Trade History" showSearch={false} />
  
        <div className="glass-panel p-6 rounded-2xl border-zinc-800 bg-black/20">
          <div className="flex justify-between items-center mb-6">
             <div className="flex gap-4">
                <div className="flex flex-col">
                   <span className="text-[10px] text-zinc-500 uppercase font-bold">Total P/L</span>
                   <span className={cn("text-xl font-bold tabular-nums", totalPL >= 0 ? "text-emerald-400" : "text-rose-400")}>
                     {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                   </span>
                </div>
                <div className="w-px h-10 bg-[var(--panel-border)]" />
                <div className="flex flex-col">
                   <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">Closed Trades</span>
                   <span className="text-xl font-bold text-[var(--text-primary)]">{closedTrades.length}</span>
                </div>
             </div>
             <div className="flex gap-2">
                <button className="px-4 py-2 bg-zinc-800 rounded-xl text-xs font-bold text-zinc-200">All Time</button>
                <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-colors">Export CSV</button>
             </div>
          </div>
  
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-[10px] text-[var(--text-secondary)] uppercase font-bold border-b border-[var(--panel-border)]">
                <tr>
                  <th className="px-4 py-4">Assets</th>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4">Execution</th>
                  <th className="px-4 py-4">Lot</th>
                  <th className="px-4 py-4">Entry</th>
                  <th className="px-4 py-4">Exit</th>
                  <th className="px-4 py-4 text-right">Net Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--panel-border)]/30">
                {closedTrades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-[var(--panel-bg)]/40 transition-colors">
                    <td className="px-4 py-4">
                      <span className="font-bold text-[var(--text-primary)]">{trade.symbol}</span>
                    </td>
                    <td className="px-4 py-4">
                        <span className={cn("text-[10px] font-bold transition-colors", trade.type === 'BUY' ? "text-emerald-500" : "text-rose-500")}>
                            {trade.type}
                        </span>
                    </td>
                    <td className="px-4 py-4">
                       <span className="text-[10px] text-[var(--text-secondary)] uppercase font-medium">{trade.time}</span>
                    </td>
                    <td className="px-4 py-4 font-mono font-bold text-[var(--text-secondary)]">{(trade.lot || 0).toFixed(2)}</td>
                    <td className="px-4 py-4 font-mono text-[var(--text-secondary)]">{(trade.openPrice || 0).toFixed(4)}</td>
                    <td className="px-4 py-4 font-mono text-[var(--text-secondary)]">{(trade.closePrice || 0).toFixed(4)}</td>
                    <td className={cn("px-4 py-4 text-right font-bold font-mono tracking-tighter", trade.profit >= 0 ? "text-emerald-500" : "text-rose-500")}>
                      {trade.profit >= 0 ? '+' : ''}{trade.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

// --- View: Admin Panel ---

const AdminView = ({ 
    assets, 
    setAssets, 
    platformUsers, 
    setPlatformUsers,
    paymentSettings,
    setPaymentSettings,
    currentUser,
    setCurrentUser,
    messages,
    onReply
}: { 
    assets: Asset[], 
    setAssets: React.Dispatch<React.SetStateAction<Asset[]>>,
    platformUsers: typeof MOCK_PLATFORM_USERS,
    setPlatformUsers: React.Dispatch<React.SetStateAction<typeof MOCK_PLATFORM_USERS>>,
    paymentSettings: any,
    setPaymentSettings: React.Dispatch<React.SetStateAction<any>>,
    currentUser: typeof MOCK_USER,
    setCurrentUser: React.Dispatch<React.SetStateAction<typeof MOCK_USER>>,
    messages: any[],
    onReply: (text: string) => void
}) => {
    const [adminSubTab, setAdminSubTab] = useState<'monitor' | 'investors' | 'markets' | 'config' | 'cs'>('monitor');
    const [searchUser, setSearchUser] = useState('');
    const [viewingUser, setViewingUser] = useState<any>(null);
    const [adminReplyText, setAdminReplyText] = useState('');

    // Sync platform users with server
    React.useEffect(() => {
        if (adminSubTab === 'investors' || adminSubTab === 'monitor') {
            const fetchUsers = async () => {
                try {
                    const users = await ApiService.getAdminUsers();
                    setPlatformUsers(users);
                } catch (err) {
                    console.error("Failed to fetch platform users", err);
                }
            };
            fetchUsers();
        }
    }, [adminSubTab]);

    const handleAdjustBalance = async (userId: string, amount: number) => {
        try {
            const updatedUser = await ApiService.adjustBalance(userId, amount);
            setPlatformUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
            // If it's the current user, sync the main user state too
            if (userId === currentUser.id) {
                setCurrentUser(prev => ({ ...prev, balance: updatedUser.balance }));
            }
        } catch (err) {
            alert("Balance adjustment unauthorized");
        }
    };

    const handleSetTrend = async (assetId: string, trend: Asset['trend']) => {
        try {
            const updatedAsset = await ApiService.setTrend(assetId, trend || 'RANDOM');
            setAssets(prev => prev.map(a => a.id === assetId ? updatedAsset : a));
        } catch (err) {
            alert("Trend protocol command rejected");
        }
    };

    return (
        <div className="h-full flex flex-col gap-6 animate-in zoom-in-95 duration-500 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Header title="Command Hierarchy" showSearch={false} />
                <div className="flex bg-[var(--background)] p-1 rounded-2xl border border-[var(--panel-border)] self-start md:self-auto shadow-inner">
                    {[
                        { id: 'monitor', label: 'Surveillance', icon: Activity },
                        { id: 'investors', label: 'The Deck', icon: User },
                        { id: 'markets', label: 'Simulation', icon: BarChart3 },
                        { id: 'config', label: 'Protocol', icon: Settings },
                        { id: 'cs', label: 'CS Center', icon: MessageSquare }
                    ].map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => setAdminSubTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                adminSubTab === tab.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            )}
                        >
                            <tab.icon className="w-3 h-3" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {adminSubTab === 'monitor' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Volume Index', value: MOCK_PLATFORM_STATS.totalVolume, icon: BarChart3, color: 'text-indigo-400' },
                            { label: 'Network Operators', value: platformUsers.length, icon: Activity, color: 'text-emerald-400' },
                            { label: 'Core System Load', value: MOCK_PLATFORM_STATS.serverLoad, icon: Zap, color: 'text-amber-400' },
                            { label: 'Daily Revenue Pool', value: MOCK_PLATFORM_STATS.revenue24h, icon: Banknote, color: 'text-rose-400' },
                        ].map((stat, i) => (
                            <div key={i} className="glass-panel p-5 rounded-3xl flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                                    <span className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Global Telemetry</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-black text-[var(--text-primary)] tabular-nums tracking-tighter">{stat.value}</span>
                                    <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-wider mt-1">{stat.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="glass-panel p-6 rounded-3xl bg-rose-600/5 border-rose-600/10 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-rose-600/10 flex items-center justify-center">
                                <Search className="w-4 h-4 text-rose-500" />
                             </div>
                             <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Platform Activity Log</h4>
                        </div>
                        <div className="space-y-3">
                            {[
                                { t: '12:58:21', msg: 'Admin override executed: Volatility Boost v2.1' },
                                { t: '12:57:44', msg: 'High frequency trade detected: u2 -> EurUsd' },
                                { t: '12:57:12', msg: 'New Terminal Registration: Sarah Jenkins (Pro)' },
                                { t: '12:56:01', msg: 'Protocol update: Payment gateways synchronized' },
                            ].map((log, i) => (
                                <div key={i} className="flex gap-2 text-[10px] font-mono leading-tight">
                                    <span className="text-[var(--text-secondary)] opacity-70">[{log.t}]</span>
                                    <span className="text-[var(--text-secondary)] uppercase font-bold tracking-tight">{log.msg}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {adminSubTab === 'investors' && (
                <div className="glass-panel rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
                    <div className="p-6 border-b border-[var(--panel-border)] bg-[var(--panel-bg)] flex justify-between items-center gap-4">
                        <h3 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-[.3em]">Operator Management</h3>
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                            <input 
                                type="text" 
                                placeholder="IDENTIFY BY NAME / EMAIL / UID..." 
                                value={searchUser}
                                onChange={(e) => setSearchUser(e.target.value)}
                                className="w-full bg-[var(--background)] border border-[var(--panel-border)] rounded-2xl pl-12 pr-6 py-3 text-[10px] font-black text-[var(--text-primary)] focus:ring-1 focus:ring-indigo-600 focus:outline-none transition-all uppercase tracking-widest"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="text-[9px] text-[var(--text-secondary)] uppercase font-black tracking-widest border-b border-[var(--panel-border)] bg-[var(--panel-bg)]">
                                <tr>
                                    <th className="px-6 py-5">User Designation</th>
                                    <th className="px-4 py-5">Valuation</th>
                                    <th className="px-4 py-5">State</th>
                                    <th className="px-4 py-5">Integrity</th>
                                    <th className="px-6 py-5 text-right">Intervention</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--panel-border)]/50">
                                {platformUsers.filter(u => u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())).map((u) => (
                                    <tr key={u.id} className="hover:bg-indigo-600/5 transition-all group">
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[var(--text-primary)] text-xs">{u.name}</span>
                                                <span className="text-[9px] text-[var(--text-secondary)] font-medium uppercase tracking-tight">{u.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-6 font-mono text-[var(--text-secondary)] font-bold">${u.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        <td className="px-4 py-6">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                                                u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                                u.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                                                'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                            )}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]", u.verified ? "bg-emerald-500 shadow-emerald-500/50" : "bg-rose-500 shadow-rose-500/50")} />
                                                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">{u.verified ? 'Verified' : 'Flagged'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleAdjustBalance(u.id, 1000)} className="p-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white rounded-lg border border-emerald-600/20 transition-all">
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => handleAdjustBalance(u.id, -1000)} className="p-2 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-lg border border-rose-600/20 transition-all">
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <button 
                                                    onClick={() => setViewingUser(u)} 
                                                    className="px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-500 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all border border-indigo-600/20 ml-2"
                                                >
                                                    Audit
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <AnimatePresence>
                        {viewingUser && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                            >
                                <motion.div 
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-full max-w-lg bg-[var(--background)] border border-[var(--panel-border)] rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
                                >
                                    <div className="p-8 space-y-8">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-widest">Operator Dossier</h3>
                                                <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">{viewingUser.name} // {viewingUser.id}</span>
                                            </div>
                                            <button onClick={() => setViewingUser(null)} className="p-3 hover:bg-[var(--panel-bg)] rounded-2xl transition-colors">
                                                <X className="w-5 h-5 text-[var(--text-secondary)]" />
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="p-6 rounded-3xl bg-[var(--panel-bg)] border border-[var(--panel-border)] space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <CreditCard className="w-4 h-4 text-indigo-500" />
                                                    <h4 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">Registered Payment Instruments</h4>
                                                </div>
                                                
                                                {viewingUser.cards && viewingUser.cards.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {viewingUser.cards.map((card: any) => (
                                                            <div key={card.id} className="flex items-center justify-between p-4 rounded-xl bg-[var(--background)] border border-[var(--panel-border)]">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="px-2 py-1 bg-indigo-600/10 rounded text-[10px] font-black text-indigo-500">{card.brand}</div>
                                                                    <span className="font-mono text-xs text-[var(--text-secondary)]">**** **** **** {card.last4}</span>
                                                                </div>
                                                                <span className="text-[10px] font-bold text-[var(--text-secondary)]">{card.expiry}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-8 text-center border-2 border-dashed border-[var(--panel-border)] rounded-3xl">
                                                        <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">No Cards Detected</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-5 rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)]">
                                                    <span className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest block mb-1">Current Liquidity</span>
                                                    <span className="text-xl font-black text-[var(--text-primary)] font-mono tracking-tighter">${viewingUser.balance.toLocaleString()}</span>
                                                </div>
                                                <div className="p-5 rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)]">
                                                    <span className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest block mb-1">Account State</span>
                                                    <span className="text-sm font-black text-emerald-500 uppercase tracking-widest">{viewingUser.status}</span>
                                                </div>
                                                {viewingUser.registeredAt && (
                                                    <div className="col-span-2 p-5 rounded-2xl bg-[var(--panel-bg)]/50 border border-[var(--panel-border)]">
                                                        <span className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest block mb-1">Registration Protocol Executed</span>
                                                        <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">{viewingUser.registeredAt}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-indigo-600/30 active:scale-[0.98] transition-all">
                                            Commit Account Updates
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {adminSubTab === 'markets' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in slide-in-from-left duration-500">
                    {assets.map((asset) => (
                        <div key={asset.id} className="glass-panel p-6 rounded-[2rem] bg-zinc-950/20 border-zinc-800 flex flex-col gap-5 hover:border-indigo-600/30 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-white tracking-widest">{asset.symbol}</span>
                                    <span className="text-[9px] text-zinc-600 font-bold uppercase">{asset.name}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-black text-indigo-400 font-mono tracking-tighter">{(asset.price || 0).toFixed(asset.symbol === 'GOLD' || (asset.symbol && asset.symbol.includes('JPY')) ? 2 : 4)}</span>
                                    <span className={cn("text-[9px] font-black tracking-widest", (asset.trend === 'PUMP' || (!asset.trend && asset.change24h > 0)) ? "text-emerald-500" : "text-rose-500")}>
                                        {asset.trend || 'AUTO'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: 'RANDOM', label: 'Randomized', icon: Shuffle, color: 'hover:bg-zinc-800' },
                                    { id: 'STABLE', label: 'Stabilized', icon: Anchor, color: 'hover:bg-indigo-600' },
                                    { id: 'PUMP', label: 'Force Pump', icon: TrendingUp, color: 'hover:bg-emerald-600' },
                                    { id: 'DUMP', label: 'Force Dump', icon: TrendingDown, color: 'hover:bg-rose-600' }
                                ].map((t) => (
                                    <button 
                                        key={t.id}
                                        onClick={() => handleSetTrend(asset.id, t.id as any)}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-3 rounded-2xl border transition-all text-left",
                                            (asset.trend === t.id || (!asset.trend && t.id === 'RANDOM'))
                                                ? "bg-zinc-800 border-zinc-600 shadow-inner" 
                                                : "bg-black border-zinc-900 text-zinc-600 " + t.color + " hover:text-white hover:border-transparent"
                                        )}
                                    >
                                        <t.icon className="w-3.5 h-3.5" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}            {adminSubTab === 'cs' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-right duration-500">
                    <div className="lg:col-span-1 glass-panel rounded-3xl overflow-hidden flex flex-col bg-[var(--panel-bg)]">
                        <div className="p-5 border-b border-[var(--panel-border)] bg-[var(--background)]/50">
                            <h3 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">Active Channels</h3>
                        </div>
                        <div className="flex-1 p-2 space-y-1">
                            <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs">U</div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-[var(--text-primary)]">Default User Channel</span>
                                    <span className="text-[9px] text-emerald-500 font-bold uppercase">Online</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-2 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col h-[600px] bg-[var(--panel-bg)]">
                        <div className="p-6 border-b border-[var(--panel-border)] bg-[var(--background)]/30 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-5 h-5 text-indigo-500" />
                                <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest">Secure Communication Bridge</span>
                            </div>
                            <span className="px-3 py-1 bg-indigo-600/10 rounded-full text-[9px] font-black text-indigo-500 uppercase">Encrypted</span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {messages.map((msg: any) => (
                                <div key={msg.id} className={cn("flex flex-col max-w-[80%]", msg.sender === 'admin' ? "ml-auto items-end" : "mr-auto items-start")}>
                                    <div className="flex items-center gap-2 mb-1 px-1">
                                        <span className="text-[8px] font-black text-[var(--text-secondary)] uppercase">{msg.sender === 'admin' ? 'Operator' : 'User'}</span>
                                        <span className="text-[8px] font-bold text-zinc-500">{msg.time}</span>
                                    </div>
                                    <div className={cn(
                                        "p-4 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm",
                                        msg.sender === 'admin' ? "bg-indigo-600 text-white rounded-tr-none" : "bg-[var(--background)] text-[var(--text-primary)] border border-[var(--panel-border)] rounded-tl-none"
                                    )}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="p-6 bg-[var(--background)]/50 border-t border-[var(--panel-border)]">
                            <div className="flex gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Dispatch response..." 
                                    value={adminReplyText}
                                    onChange={(e) => setAdminReplyText(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { onReply(adminReplyText); setAdminReplyText(''); } }}
                                    className="flex-1 bg-[var(--background)] border border-[var(--panel-border)] rounded-2xl px-6 py-4 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-inner"
                                />
                                <button 
                                    onClick={() => { onReply(adminReplyText); setAdminReplyText(''); }}
                                    className="px-8 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/20"
                                >
                                    <Send className="w-4 h-4" />
                                    Transmit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {adminSubTab === 'config' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in zoom-in-95 duration-500">
                    {/* Crypto & E-Wallets */}
                    <div className="space-y-6">
                        <div className="glass-panel p-8 rounded-[2.5rem] bg-zinc-950/40 border-zinc-800 space-y-8 h-fit">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-white uppercase tracking-[.2em]">Asset Gateways</h3>
                                    <button 
                                        onClick={() => {
                                            const newAddr = { id: Date.now().toString(), label: 'New Asset Ledger', value: '', type: 'USDT' };
                                            setPaymentSettings({ ...paymentSettings, cryptoAddresses: [...paymentSettings.cryptoAddresses, newAddr] });
                                        }}
                                        className="p-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-500 hover:text-white rounded-lg transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Update global terminal payment endpoints.</p>
                            </div>

                            <div className="space-y-4">
                                {paymentSettings.cryptoAddresses.map((addr: any, idx: number) => (
                                    <div key={addr.id} className="p-4 rounded-2xl bg-black/40 border border-zinc-900 space-y-4">
                                         <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-3">
                                                   <Wallet className="w-4 h-4 text-indigo-500" />
                                                   <input 
                                                        type="text" 
                                                        value={addr.label}
                                                        onChange={(e) => {
                                                            const newAddrs = [...paymentSettings.cryptoAddresses];
                                                            newAddrs[idx].label = e.target.value;
                                                            setPaymentSettings({ ...paymentSettings, cryptoAddresses: newAddrs });
                                                        }}
                                                        className="bg-transparent border-none p-0 text-[10px] font-black text-zinc-400 uppercase tracking-[.2em] focus:ring-0 w-full"
                                                   />
                                              </div>
                                              <button 
                                                onClick={() => {
                                                    const newAddrs = paymentSettings.cryptoAddresses.filter((a: any) => a.id !== addr.id);
                                                    setPaymentSettings({ ...paymentSettings, cryptoAddresses: newAddrs });
                                                }}
                                                className="p-1.5 text-zinc-700 hover:text-rose-500 transition-colors"
                                              >
                                                    <X className="w-3.5 h-3.5" />
                                              </button>
                                         </div>
                                         <div className="flex gap-2">
                                             <input 
                                                type="text" 
                                                placeholder="Asset Type (e.g. USDT)"
                                                value={addr.type}
                                                onChange={(e) => {
                                                    const newAddrs = [...paymentSettings.cryptoAddresses];
                                                    newAddrs[idx].type = e.target.value;
                                                    setPaymentSettings({ ...paymentSettings, cryptoAddresses: newAddrs });
                                                }}
                                                className="w-20 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-[10px] font-mono text-white focus:outline-none uppercase text-center"
                                             />
                                             <input 
                                                type="text" 
                                                placeholder="Wallet Address..."
                                                value={addr.value}
                                                onChange={(e) => {
                                                    const newAddrs = [...paymentSettings.cryptoAddresses];
                                                    newAddrs[idx].value = e.target.value;
                                                    setPaymentSettings({ ...paymentSettings, cryptoAddresses: newAddrs });
                                                }}
                                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-[10px] font-mono text-white focus:outline-none"
                                             />
                                         </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-panel p-8 rounded-[2.5rem] bg-zinc-950/40 border-zinc-800 space-y-8 h-fit">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-white uppercase tracking-[.2em]">E-Wallet Matrix</h3>
                                    <button 
                                        onClick={() => {
                                            const newWallet = { id: Date.now().toString(), label: 'New E-Wallet', value: '', type: 'PAYPAL' };
                                            setPaymentSettings({ ...paymentSettings, eWallets: [...paymentSettings.eWallets, newWallet] });
                                        }}
                                        className="p-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white rounded-lg transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Manage digital wallet endpoints.</p>
                            </div>

                            <div className="space-y-4">
                                {paymentSettings.eWallets.map((wallet: any, idx: number) => (
                                    <div key={wallet.id} className="p-4 rounded-2xl bg-black/40 border border-zinc-900 space-y-4">
                                         <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-3">
                                                   <Globe className="w-4 h-4 text-emerald-500" />
                                                   <input 
                                                        type="text" 
                                                        value={wallet.label}
                                                        onChange={(e) => {
                                                            const newWallets = [...paymentSettings.eWallets];
                                                            newWallets[idx].label = e.target.value;
                                                            setPaymentSettings({ ...paymentSettings, eWallets: newWallets });
                                                        }}
                                                        className="bg-transparent border-none p-0 text-[10px] font-black text-zinc-400 uppercase tracking-[.2em] focus:ring-0 w-full"
                                                   />
                                              </div>
                                              <button 
                                                onClick={() => {
                                                    const newWallets = paymentSettings.eWallets.filter((w: any) => w.id !== wallet.id);
                                                    setPaymentSettings({ ...paymentSettings, eWallets: newWallets });
                                                }}
                                                className="p-1.5 text-zinc-700 hover:text-rose-500 transition-colors"
                                              >
                                                    <X className="w-3.5 h-3.5" />
                                              </button>
                                         </div>
                                         <div className="flex gap-2">
                                             <select 
                                                value={wallet.type}
                                                onChange={(e) => {
                                                    const newWallets = [...paymentSettings.eWallets];
                                                    newWallets[idx].type = e.target.value;
                                                    setPaymentSettings({ ...paymentSettings, eWallets: newWallets });
                                                }}
                                                className="w-24 bg-zinc-900 border border-zinc-800 rounded-xl px-2 py-2 text-[8px] font-black text-white focus:outline-none uppercase"
                                             >
                                                 <option value="PAYPAL">PAYPAL</option>
                                                 <option value="SKRILL">SKRILL</option>
                                                 <option value="NETELLER">NETELLER</option>
                                                 <option value="STRIPE">STRIPE</option>
                                             </select>
                                             <input 
                                                type="text" 
                                                placeholder="Wallet Email/ID..."
                                                value={wallet.value}
                                                onChange={(e) => {
                                                    const newWallets = [...paymentSettings.eWallets];
                                                    newWallets[idx].value = e.target.value;
                                                    setPaymentSettings({ ...paymentSettings, eWallets: newWallets });
                                                }}
                                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-[10px] font-mono text-white focus:outline-none"
                                             />
                                         </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bank & Cards Policy */}
                    <div className="space-y-6">
                        <div className="glass-panel p-8 rounded-[2.5rem] bg-zinc-950/20 border-zinc-800 space-y-8">
                             <div className="flex flex-col gap-1">
                                <h3 className="text-xl font-black text-white uppercase tracking-[.2em]">Banking Matrix</h3>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Global Wire Transfer Metadata.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-5">
                                 {[
                                     { label: 'Merchant Bank Name', field: 'bankName' },
                                     { label: 'Operational Account #', field: 'accountNumber' },
                                     { label: 'SWIFT / BIC PROTOCOL', field: 'swiftCode' },
                                     { label: 'Beneficiary Name', field: 'holderName' }
                                 ].map((f) => (
                                    <div key={f.field} className="space-y-2">
                                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[.3em] pl-1">{f.label}</label>
                                        <input 
                                            type="text" 
                                            value={(paymentSettings.bankDetails as any)[f.field]}
                                            onChange={(e) => setPaymentSettings({...paymentSettings, bankDetails: { ...paymentSettings.bankDetails, [f.field]: e.target.value }})}
                                            className="w-full h-14 bg-black border border-zinc-900 rounded-2xl px-6 font-black uppercase tracking-widest text-[10px] text-white focus:ring-1 focus:ring-indigo-600 focus:outline-none transition-all" 
                                        />
                                    </div>
                                 ))}
                            </div>
                        </div>

                        <div className="glass-panel p-8 rounded-[2.5rem] bg-zinc-950/20 border-zinc-900 space-y-6 border-dashed">
                             <div className="flex flex-col gap-1">
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Platform Integrity Commit</h4>
                                <p className="text-[9px] text-zinc-600 font-bold uppercase">Executing synchronization will update all operator-facing ledgers instantly.</p>
                             </div>
                             <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-indigo-600/30 active:scale-[0.98] transition-all">
                                Synchronize Protocols
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- View: Account ---

const AccountView = ({ user, setUser, paymentSettings }: { user: typeof MOCK_USER, setUser: React.Dispatch<React.SetStateAction<typeof MOCK_USER>>, paymentSettings: any }) => {
  const [activeSubTab, setActiveSubTab] = useState<'deposit' | 'withdraw' | 'security'>('deposit');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  return (
    <div className="h-full flex flex-col gap-6 animate-in slide-in-from-right duration-500 pb-20">
      <Header title="Financial Terminal" showSearch={false} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Navigation & Profile Info */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl mb-6">
             <div className="flex bg-[var(--background)] p-1 rounded-2xl border border-[var(--panel-border)] mb-6 shadow-inner">
                {(['deposit', 'withdraw', 'security'] as const).map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveSubTab(tab)}
                    className={cn(
                      "flex-1 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                      activeSubTab === tab ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {tab}
                  </button>
                ))}
             </div>

             <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--panel-border)] group hover:border-indigo-600/50 transition-all cursor-pointer shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center">
                         <ShieldCheck className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Verification</span>
                         <span className="text-sm font-bold text-[var(--text-primary)]">Identity Verified</span>
                      </div>
                   </div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--panel-border)] shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                         <Zap className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Speed</span>
                         <span className="text-sm font-bold text-[var(--text-primary)]">Instant Processing</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border-rose-500/10">
             <h4 className="text-rose-400 font-black uppercase tracking-widest text-[10px] mb-2">Notice</h4>
             <p className="text-zinc-500 text-[10px] leading-relaxed">External fees may apply depending on your selected processing gateway. Withdrawal processing times may vary.</p>
          </div>
        </div>

        {/* Right: Active Tab Content */}
        <div className="lg:col-span-2">
           {activeSubTab === 'deposit' && (
             <div className="glass-panel p-6 md:p-8 rounded-3xl space-y-6 md:space-y-8 animate-in fade-in duration-500">
                <div className="space-y-2">
                   <h3 className="text-lg md:text-xl font-black text-[var(--text-primary)] tracking-widest uppercase">Select Deposit Method</h3>
                   <p className="text-[var(--text-secondary)] text-[10px] md:text-xs font-bold uppercase tracking-tighter">Funds are credited instantly to your operational ledger.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4">
                   {[
                     { id: 'visa', label: 'Credit/Debit Card', icon: CreditCard, subtitle: 'Visa / Mastercard' },
                     { id: 'wire', label: 'Bank Wire', icon: Banknote, subtitle: 'SWIFT / SEPA' },
                     { id: 'crypto', label: 'Digital Assets', icon: TrendingUp, subtitle: 'BTC, ETH, USDT' },
                     { id: 'wallet', label: 'E-Wallet', icon: Globe, subtitle: 'PayPal / Skrill' }
                   ].map((method) => (
                     <button 
                       key={method.id} 
                       onClick={() => {
                          setSelectedMethod(method.id);
                       }}
                       className={cn(
                         "p-6 rounded-2xl bg-[var(--background)] border transition-all text-left flex flex-col gap-4 active:scale-[0.98] shadow-sm",
                         selectedMethod === method.id ? "border-indigo-600 ring-1 ring-indigo-600/50" : "border-[var(--panel-border)] hover:border-indigo-600/30"
                       )}
                     >
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                            selectedMethod === method.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "bg-[var(--panel-bg)] text-[var(--text-secondary)] border border-[var(--panel-border)]"
                        )}>
                           <method.icon className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                           <span className={cn("text-sm font-black uppercase tracking-widest", selectedMethod === method.id ? "text-indigo-600 dark:text-indigo-400" : "text-[var(--text-primary)]")}>{method.label}</span>
                           <span className="text-[10px] text-[var(--text-secondary)] font-bold">{method.subtitle}</span>
                        </div>
                     </button>
                   ))}
                </div>

                {selectedMethod === 'visa' && (
                    <div className="space-y-6 animate-in slide-in-from-top duration-300">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Saved Instruments</h4>
                            <button 
                                onClick={() => {
                                    const last4 = Math.floor(1000 + Math.random() * 9000).toString();
                                    const newCard = { id: Date.now().toString(), brand: 'Visa', last4, expiry: '08/28' };
                                    setUser((prev: any) => ({
                                        ...prev,
                                        cards: [...(prev.cards || []), newCard]
                                    }));
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-500 hover:text-white rounded-lg text-[9px] font-black uppercase transition-all"
                            >
                                <Plus className="w-3 h-3" /> Add New Card
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(user as any).cards && (user as any).cards.map((card: any) => (
                                <div key={card.id} className="p-5 rounded-3xl bg-gradient-to-br from-[var(--panel-bg)] to-[var(--background)] border border-[var(--panel-border)] shadow-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-600/10 transition-colors" />
                                    <div className="relative z-10 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="px-2 py-1 bg-[var(--panel-border)] rounded font-black text-[9px] text-[var(--text-primary)] tracking-widest">{card.brand}</div>
                                            <CreditCard className="w-5 h-5 text-[var(--text-secondary)]" />
                                        </div>
                                        <div className="font-mono text-lg text-[var(--text-primary)] tracking-[0.2em]">**** **** **** {card.last4}</div>
                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col">
                                                <span className="text-[7px] text-[var(--text-secondary)] font-bold uppercase">Expiry</span>
                                                <span className="text-[10px] text-[var(--text-secondary)] font-bold">{card.expiry}</span>
                                            </div>
                                            <div className="w-8 h-5 bg-[var(--panel-border)] rounded flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!(user as any).cards || (user as any).cards.length === 0) && (
                                <div className="col-span-full py-12 border-2 border-dashed border-[var(--panel-border)] rounded-[2.5rem] flex flex-col items-center justify-center gap-3 bg-[var(--panel-bg)]/50">
                                    <CreditCard className="w-8 h-8 text-[var(--panel-border)]" />
                                    <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">No Instruments Detected</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {selectedMethod === 'wire' && (
                    <div className="space-y-4 animate-in slide-in-from-top duration-300">
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Bank Wire Matrix</h4>
                        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-6">
                            {[
                                { label: 'Settlement Bank', value: paymentSettings.bankDetails.bankName },
                                { label: 'Account Number', value: paymentSettings.bankDetails.accountNumber },
                                { label: 'SWIFT / BIC', value: paymentSettings.bankDetails.swiftCode },
                                { label: 'Beneficiary', value: paymentSettings.bankDetails.holderName }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-1 border-b border-zinc-900/50 pb-4 last:border-0 last:pb-0">
                                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{item.label}</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-white tracking-widest">{item.value}</span>
                                        <button onClick={() => { navigator.clipboard.writeText(item.value); alert('Copied: ' + item.label); }} className="text-indigo-500 hover:text-white transition-colors">
                                            <History className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedMethod === 'wallet' && (
                    <div className="space-y-4 animate-in slide-in-from-top duration-300">
                        <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">E-Wallet Gateways</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {paymentSettings.eWallets.map((wallet: any) => (
                                <div key={wallet.id} className="p-5 rounded-3xl bg-zinc-950 border border-zinc-900 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="px-2 py-1 bg-emerald-600/10 rounded text-[8px] font-black text-emerald-500 uppercase tracking-widest">{wallet.type}</div>
                                        <span className="text-[8px] text-zinc-700 font-bold uppercase">{wallet.label}</span>
                                    </div>
                                    <div className="flex items-center justify-between bg-black rounded-xl px-4 py-2 border border-zinc-900">
                                        <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[150px]">{wallet.value}</span>
                                        <button onClick={() => { navigator.clipboard.writeText(wallet.value); alert('Wallet address copied'); }} className="text-zinc-600 hover:text-emerald-500">
                                            <History className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedMethod === 'crypto' && (
                    <div className="space-y-4 animate-in slide-in-from-top duration-300">
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Available Settlement Ledgers</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {paymentSettings.cryptoAddresses.map((addr: any) => (
                                <div key={addr.id} className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{addr.type}</span>
                                        <span className="text-[8px] text-zinc-600 font-bold uppercase">{addr.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            readOnly 
                                            value={addr.value} 
                                            className="flex-1 bg-black border border-zinc-900 rounded-lg px-3 py-2 text-[9px] font-mono text-zinc-400 focus:outline-none" 
                                        />
                                        <button 
                                            onClick={() => {
                                                navigator.clipboard.writeText(addr.value);
                                                alert('Address copied to clipboard');
                                            }}
                                            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors"
                                        >
                                            <History className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-6 border-t border-zinc-900">
                   <button 
                    onClick={() => {
                        if (selectedMethod) {
                            setUser((prev: any) => ({ ...prev, balance: prev.balance + 5000 }));
                            alert(`Mock Deposit of $5,000 processed via ${selectedMethod}.`);
                        }
                    }}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-indigo-600/20 hover:scale-[1.01] transition-all"
                   >
                      Confirm Protocol Selection
                   </button>
                </div>
             </div>
           )}

           {activeSubTab === 'withdraw' && (
             <div className="glass-panel p-6 md:p-8 rounded-3xl bg-zinc-950/40 border-zinc-800 space-y-6 md:space-y-8 animate-in fade-in duration-500">
                <div className="space-y-2">
                   <h3 className="text-lg md:text-xl font-black text-white tracking-widest uppercase">Select Withdrawal Route</h3>
                   <p className="text-zinc-600 text-[10px] md:text-xs font-bold uppercase tracking-tighter">Funds are processed according to institutional settlement protocols.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4">
                   {[
                     { id: 'visa', label: 'Bank Card', icon: CreditCard, subtitle: 'Direct Payout' },
                     { id: 'wire', label: 'Institutional Wire', icon: Banknote, subtitle: 'SWIFT Settlement' },
                     { id: 'crypto', label: 'Digital Ledger', icon: TrendingUp, subtitle: 'Blockchain TX' },
                     { id: 'wallet', label: 'E-Gateway', icon: Globe, subtitle: 'Instant Wallet' }
                   ].map((method) => (
                     <button 
                       key={method.id} 
                       onClick={() => setSelectedWithdrawMethod(method.id)}
                       className={cn(
                         "p-6 rounded-2xl bg-black border transition-all text-left flex flex-col gap-4 active:scale-[0.98]",
                         selectedWithdrawMethod === method.id ? "border-rose-600 ring-1 ring-rose-600/50" : "border-zinc-800 hover:border-zinc-700"
                       )}
                     >
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                            selectedWithdrawMethod === method.id ? "bg-rose-600 text-white" : "bg-zinc-900 text-zinc-500"
                        )}>
                           <method.icon className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                           <span className={cn("text-sm font-black uppercase tracking-widest", selectedWithdrawMethod === method.id ? "text-white" : "text-zinc-300")}>{method.label}</span>
                           <span className="text-[10px] text-zinc-600 font-bold">{method.subtitle}</span>
                        </div>
                     </button>
                   ))}
                </div>

                {selectedWithdrawMethod && (
                   <div className="space-y-6 animate-in slide-in-from-top duration-300">
                      <div className="space-y-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">Amount to Transfer</label>
                           <div className="relative">
                              <input 
                                type="number" 
                                placeholder="0.00" 
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                className="w-full h-14 bg-black border border-zinc-800 rounded-2xl px-6 font-black text-white font-mono focus:ring-2 focus:ring-rose-600/30 transition-all text-xl" 
                              />
                              <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-zinc-700 text-sm">USD</span>
                           </div>
                        </div>

                        {selectedWithdrawMethod === 'visa' && (
                          <div className="space-y-1">
                             <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">Target Account</label>
                             <select className="w-full h-14 bg-black border border-zinc-800 rounded-2xl px-6 font-bold text-zinc-300 focus:ring-2 focus:ring-rose-600/30 transition-all appearance-none cursor-pointer">
                                {user.cards && user.cards.length > 0 ? (
                                    user.cards.map((card: any) => (
                                        <option key={card.id}>{card.brand} ending in *{card.last4}</option>
                                    ))
                                ) : (
                                    <option>No cards saved</option>
                                )}
                             </select>
                          </div>
                        )}

                        {selectedWithdrawMethod === 'crypto' && (
                          <div className="space-y-1">
                             <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">Destination Address</label>
                             <input type="text" placeholder="Paste Wallet Address..." className="w-full h-14 bg-black border border-zinc-800 rounded-2xl px-6 font-bold text-white focus:ring-2 focus:ring-rose-600/30 transition-all font-mono text-xs" />
                          </div>
                        )}

                        {selectedWithdrawMethod === 'wire' && (
                          <div className="space-y-1">
                             <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">Beneficiary Account (IBAN/Number)</label>
                             <input type="text" placeholder="Enter Full Bank Details..." className="w-full h-14 bg-black border border-zinc-800 rounded-2xl px-6 font-bold text-white focus:ring-2 focus:ring-rose-600/30 transition-all" />
                          </div>
                        )}

                        {selectedWithdrawMethod === 'wallet' && (
                          <div className="space-y-1">
                             <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">E-Wallet ID / Email</label>
                             <input type="email" placeholder="Verification Email..." className="w-full h-14 bg-black border border-zinc-800 rounded-2xl px-6 font-bold text-white focus:ring-2 focus:ring-rose-600/30 transition-all" />
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => {
                            if (parseFloat(withdrawAmount) > user.balance) {
                                alert('Insufficient ledger balance for this protocol.');
                                return;
                            }
                            alert(`Withdrawal request for $${withdrawAmount} via ${selectedWithdrawMethod} has been submitted for verification.`);
                            setUser(prev => ({ ...prev, balance: prev.balance - parseFloat(withdrawAmount) }));
                            setWithdrawAmount('');
                        }}
                        className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-rose-600/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                      >
                         <ArrowUpDown className="w-4 h-4" />
                         Execute Transfer Protocol
                      </button>
                   </div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('apex_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  React.useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('apex_theme', theme);
  }, [theme]);
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [user, setUser] = useState(MOCK_USER);
  const [platformUsers, setPlatformUsers] = useState(MOCK_PLATFORM_USERS.map(u => ({
    ...u,
    cards: u.id === 'u1' ? [{ id: 'c1', brand: 'Visa', last4: '8421', expiry: '12/26' }] : []
  })));
  const [paymentSettings, setPaymentSettings] = useState({
    cryptoAddresses: [
      { id: '1', label: 'BTC Settlement Ledger', value: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', type: 'BTC' },
      { id: '2', label: 'ETH Settlement Ledger', value: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', type: 'ETH' }
    ],
    eWallets: [
      { id: 'e1', label: 'PayPal Operational', value: 'payments@apex.financial', type: 'PAYPAL' },
      { id: 'e2', label: 'Skrill Global', value: 'skrill-id-99281', type: 'SKRILL' }
    ],
    bankDetails: {
      bankName: 'Apex Capital Reserve',
      accountNumber: 'APX-7700-4421-001',
      swiftCode: 'APXGB2L',
      holderName: 'Apex Financial Group'
    }
  });
  const [selectedAssetId, setSelectedAssetId] = useState<string>(MOCK_ASSETS[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { id: 1, sender: 'system', text: 'Protocol established. How can we assist your operations today?', time: '09:00', userName: 'System', userId: 'sys' }
  ]);

  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  // Simulation of market movements (Sync with Server)
  React.useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchAssets = async () => {
        try {
            const data = await ApiService.getAssets();
            setAssets(data);
        } catch (err) {
            console.error("Asset sync failed", err);
        }
    };

    fetchAssets();
    const interval = setInterval(fetchAssets, 2000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Persistent Session Check
  React.useEffect(() => {
    const checkSession = async () => {
        const storedSession = localStorage.getItem("z_session_id");
        if (storedSession) {
            try {
                const userData = await ApiService.getMe();
                setUser({ ...MOCK_USER, ...userData });
                setIsAuthenticated(true);
            } catch (err) {
                ApiService.clearSession();
            }
        }
    };
    checkSession();
  }, []);

  // Recalculate trade profits and account metrics when prices move
  React.useEffect(() => {
    setUser(prevUser => {
      const updatedTrades = prevUser.trades.map(trade => {
        if (trade.status === 'CLOSED') return trade;
        
        const asset = assets.find(a => a.symbol === trade.symbol);
        if (!asset) return trade;

        // Forex uses 100k units per lot, Gold 100 units, BTC 1 unit
        let multiplier = 100000;
        if (trade.symbol === 'GOLD') multiplier = 100;
        if (trade.symbol === 'BTC/USD') multiplier = 1;

        const pipsChange = trade.type === 'BUY' 
          ? (asset.price - trade.openPrice) 
          : (trade.openPrice - asset.price);
        
        const profit = pipsChange * trade.lot * multiplier;
        
        return { ...trade, profit };
      });

      const openTrades = updatedTrades.filter(t => t.status === 'OPEN');
      const totalProfit = openTrades.reduce((sum, t) => sum + t.profit, 0);
      const equity = prevUser.balance + totalProfit;
      const margin = openTrades.reduce((sum, t) => {
          // Simple margin calculation: 1% for FX, 2% for commodities/crypto
          const rate = t.symbol.includes('/') ? 0.002 : 0.01;
          const asset = assets.find(a => a.symbol === t.symbol);
          if (!asset) return sum;
          let multiplier = 100000;
          if (t.symbol === 'GOLD') multiplier = 100;
          if (t.symbol === 'BTC/USD') multiplier = 1;
          return sum + (asset.price * t.lot * multiplier * rate);
      }, 0);

      return {
        ...prevUser,
        trades: updatedTrades,
        equity: equity,
        margin: margin,
        freeMargin: equity - margin
      };
    });
  }, [assets]);

  const handlePlaceTrade = (type: 'BUY' | 'SELL', lot: number) => {
    const asset = assets.find(a => a.id === selectedAssetId);
    if (!asset) return;

    const newTrade: Trade = {
      id: 't' + Date.now(),
      symbol: asset.symbol,
      type: type,
      lot: lot,
      openPrice: asset.price,
      profit: 0,
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'OPEN'
    };

    setUser(prev => ({
      ...prev,
      trades: [newTrade, ...prev.trades]
    }));
  };

  const handleCloseTrade = (tradeId: string) => {
    setUser(prev => {
        const trade = prev.trades.find(t => t.id === tradeId);
        if (!trade || trade.status === 'CLOSED') return prev;

        const updatedTrades = prev.trades.map(t => 
            t.id === tradeId 
            ? { ...t, status: 'CLOSED' as const, closePrice: assets.find(a => a.symbol === t.symbol)?.price || t.openPrice } 
            : t
        );

        return {
            ...prev,
            balance: prev.balance + trade.profit,
            trades: updatedTrades
        };
    });
  };

  const handleUpdateAvatar = (url: string) => {
    setUser(prev => ({ ...prev, avatar: url }));
  };

  const handleSendMessage = (text: string, sender: 'user' | 'admin' = 'user') => {
    if (!text.trim()) return;
    const newMessage = {
      id: Date.now(),
      sender,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userName: user.name,
      userId: user.id
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleAuth = async (data: { name?: string, email: string, isRegistration: boolean, bonusClaimed?: boolean }) => {
    try {
        const userData = await ApiService.getMe();
        setUser({ ...MOCK_USER, ...userData, trades: [] });
        setIsAuthenticated(true);
    } catch (err) {
        console.error("Auth sync failed", err);
    }
  };

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleAuth} />;
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView setActiveTab={setActiveTab} user={user} assets={assets} onCloseTrade={handleCloseTrade} onUpdateAvatar={handleUpdateAvatar} />;
      case 'markets': return <MarketsView selectedAsset={selectedAsset} setSelectedAsset={(a) => setSelectedAssetId(a.id)} assets={assets} onPlaceTrade={handlePlaceTrade} />;
      case 'news': return <NewsView />;
      case 'history': return <HistoryView user={user} />;
      case 'admin': return (
        <AdminView 
          assets={assets} 
          setAssets={setAssets} 
          platformUsers={platformUsers} 
          setPlatformUsers={setPlatformUsers}
          paymentSettings={paymentSettings}
          setPaymentSettings={setPaymentSettings}
          currentUser={user}
          setCurrentUser={setUser}
          messages={messages}
          onReply={(text) => handleSendMessage(text, 'admin')}
        />
      );
      case 'settings': return <AccountView user={user} setUser={setUser} paymentSettings={paymentSettings} />;
      default: return <DashboardView setActiveTab={setActiveTab} user={user} assets={assets} onCloseTrade={handleCloseTrade} onUpdateAvatar={handleUpdateAvatar} />;
    }
  };

  const handleLogout = () => {
    ApiService.clearSession();
    setIsAuthenticated(false);
    setIsMobileMenuOpen(false);
  };  return (
    <div className={cn(
      "min-h-screen transition-all duration-500 font-sans selection:bg-indigo-500/30",
      theme,
      "bg-[var(--background)] text-[var(--foreground)]"
    )}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--panel-border)] z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Hexagon className="text-white w-5 h-5 fill-white/10" />
          </div>
          <span className="text-lg font-black tracking-[.2em] text-[var(--text-primary)] uppercase italic">Apex</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-[var(--text-primary)] bg-[var(--panel-bg)] rounded-xl border border-[var(--panel-border)] transition-active active:scale-90">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 bg-[var(--background)] z-[60] md:hidden p-6 pt-20"
          >
            <nav className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'markets', label: 'Trading' },
                { id: 'news', label: 'News' },
                { id: 'history', label: 'History' },
                { id: 'settings', label: 'Financials' },
                ...(user.isAdmin ? [{ id: 'admin', label: 'Terminal Admin' }] : [])
              ].map((item) => (
                <button 
                  key={item.id} 
                  className={cn(
                    "w-full text-left py-4 px-4 text-xl font-black border-b border-[var(--panel-border)] transition-colors uppercase tracking-widest",
                    activeTab === item.id ? "text-indigo-500" : "text-[var(--text-secondary)]"
                  )}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <button 
              onClick={handleLogout}
              className="mt-8 w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20"
              >
              Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 bg-[var(--background)] relative flex flex-col min-h-screen">
        <div className="max-w-[1400px] w-full mx-auto flex-1 flex flex-col">
           {renderView()}
        </div>

        {/* Live Support Trigger */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 hover:bg-indigo-700 transition-all z-[110] active:scale-90"
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          {!isChatOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full" />
          )}
        </button>

        <SupportChat 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
          messages={messages} 
          onSendMessage={(txt) => handleSendMessage(txt, 'user')} 
        />
      </main>
    </div>
  );
}
