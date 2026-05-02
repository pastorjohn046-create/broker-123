export interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  color: string;
  sparkline: { time: string; value: number; open: number; high: number; low: number; close: number; }[];
  trend?: 'RANDOM' | 'PUMP' | 'DUMP' | 'STABLE';
}

export interface PortfolioItem {
  assetId: string;
  amount: number;
  avgPrice: number;
}

export const MOCK_ASSETS: Asset[] = [
  {
    id: 'eurusd',
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    price: 1.0842,
    change24h: 0.12,
    marketCap: 0,
    volume24h: 6000000000,
    color: '#3B82F6',
    sparkline: Array.from({ length: 40 }, (_, i) => {
      const base = 1.08 + Math.random() * 0.01;
      const open = base + (Math.random() - 0.5) * 0.002;
      const close = base + (Math.random() - 0.5) * 0.002;
      return {
        time: i.toString(),
        value: close,
        open,
        close,
        high: Math.max(open, close) + Math.random() * 0.001,
        low: Math.min(open, close) - Math.random() * 0.001
      };
    })
  },
  {
    id: 'gbpjusd',
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    price: 1.2654,
    change24h: -0.08,
    marketCap: 0,
    volume24h: 4000000000,
    color: '#10B981',
    sparkline: Array.from({ length: 40 }, (_, i) => {
      const base = 1.26 + Math.random() * 0.01;
      const open = base + (Math.random() - 0.5) * 0.002;
      const close = base + (Math.random() - 0.5) * 0.002;
      return {
        time: i.toString(),
        value: close,
        open,
        close,
        high: Math.max(open, close) + Math.random() * 0.001,
        low: Math.min(open, close) - Math.random() * 0.001
      };
    })
  },
  {
    id: 'usdjpy',
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    price: 151.42,
    change24h: 0.45,
    marketCap: 0,
    volume24h: 5000000000,
    color: '#F43F5E',
    sparkline: Array.from({ length: 40 }, (_, i) => {
      const base = 150 + Math.random() * 2;
      const open = base + (Math.random() - 0.5) * 0.5;
      const close = base + (Math.random() - 0.5) * 0.5;
      return {
        time: i.toString(),
        value: close,
        open,
        close,
        high: Math.max(open, close) + Math.random() * 0.2,
        low: Math.min(open, close) - Math.random() * 0.2
      };
    })
  },
  {
    id: 'xauusd',
    symbol: 'GOLD',
    name: 'Gold / US Dollar',
    price: 2342.15,
    change24h: 1.24,
    marketCap: 0,
    volume24h: 8000000000,
    color: '#EAB308',
    sparkline: Array.from({ length: 40 }, (_, i) => {
      const base = 2300 + Math.random() * 60;
      const open = base + (Math.random() - 0.5) * 5;
      const close = base + (Math.random() - 0.5) * 5;
      return {
        time: i.toString(),
        value: close,
        open,
        close,
        high: Math.max(open, close) + Math.random() * 2,
        low: Math.min(open, close) - Math.random() * 2
      };
    })
  },
  {
    id: 'btcusd',
    symbol: 'BTC/USD',
    name: 'Bitcoin / US Dollar',
    price: 64231.50,
    change24h: 2.45,
    marketCap: 0,
    volume24h: 35000000000,
    color: '#F97316',
    sparkline: Array.from({ length: 40 }, (_, i) => {
      const base = 62000 + Math.random() * 4000;
      const open = base + (Math.random() - 0.5) * 200;
      const close = base + (Math.random() - 0.5) * 200;
      return {
        time: i.toString(),
        value: close,
        open,
        close,
        high: Math.max(open, close) + Math.random() * 100,
        low: Math.min(open, close) - Math.random() * 100
      };
    })
  }
];

export interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  lot: number;
  openPrice: number;
  closePrice?: number;
  profit: number;
  time: string;
  status: 'OPEN' | 'CLOSED';
}

export const MOCK_USER = {
  id: 'OPERATOR_0',
  name: 'Juddy Banz',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop&crop=faces',
  balance: 50000.00,
  equity: 50000.00,
  margin: 0,
  freeMargin: 50000.00,
  marginLevel: 0,
  isAdmin: false,
  cards: [] as { id: string; brand: string; last4: string; expiry: string; }[],
  portfolio: [
    { assetId: 'eurusd', amount: 0, avgPrice: 0 },
  ],
  trades: [] as Trade[]
};

export const MOCK_PLATFORM_USERS = [
  { id: 'ADMIN_CHIEF', name: 'Alex Rivera', email: 'alex@apex.financial', balance: 10450.75, status: 'Active', verified: true, joined: '2024-01-12' },
  { id: 'usr_2', name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', balance: 42500.00, status: 'Active', verified: true, joined: '2024-02-05' },
  { id: 'usr_3', name: 'Michael Chen', email: 'm.chen@outlook.com', balance: 1200.50, status: 'Pending', verified: false, joined: '2024-04-18' },
  { id: 'usr_4', name: 'Elena Rodriguez', email: 'elena.rod@yahoo.com', balance: 8900.25, status: 'Active', verified: true, joined: '2023-11-30' },
  { id: 'usr_5', name: 'David Smith', email: 'd.smith@proton.me', balance: 0.00, status: 'Suspended', verified: true, joined: '2023-09-15' },
];

export const MOCK_PLATFORM_STATS = {
  totalVolume: '$4.2B',
  activeTraders: 12450,
  serverLoad: '12%',
  uptime: '99.99%',
  revenue24h: '$1.2M'
};
