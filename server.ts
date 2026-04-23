import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // --- API Routes (Security Layer) ---

  // Mock server-side state (in a real app, this would be a database)
  let serverUsers = [
    { id: 'u1', name: 'Alex Rivera', email: 'alex@apex.financial', balance: 10450.75, status: 'Active', verified: true, joined: '2024-01-12', isAdmin: true, cards: [{ id: 'c1', brand: 'Visa', last4: '8421', expiry: '12/26' }] },
  ];

  let serverAssets = [
    { id: 'eurusd', name: 'EUR/USD', symbol: 'EUR/USD', price: 1.0824, change24h: 0.15, sparkline: [], trend: 'RANDOM' },
    { id: 'gbpusd', name: 'GBP/USD', symbol: 'GBP/USD', price: 1.2654, change24h: -0.22, sparkline: [], trend: 'RANDOM' },
    { id: 'usdjpy', name: 'USD/JPY', symbol: 'USD/JPY', price: 151.42, change24h: 0.45, sparkline: [], trend: 'RANDOM' },
    { id: 'xauusd', name: 'Gold', symbol: 'GOLD', price: 2355.20, change24h: 1.12, sparkline: [], trend: 'RANDOM' },
    { id: 'btcusd', name: 'Bitcoin', symbol: 'BTC/USD', price: 64250.00, change24h: -2.45, sparkline: [], trend: 'RANDOM' },
  ];

  // Initialize sparklines with proper OHLC data for candlesticks
  serverAssets = serverAssets.map(a => {
    let currentPrice = a.price;
    const history = Array.from({ length: 100 }, (_, i) => {
      const open = currentPrice;
      const volatility = (a.symbol.includes('GOLD') || a.symbol.includes('BTC')) ? 0.005 : 0.001;
      const close = open * (1 + (Math.random() - 0.5) * volatility);
      const high = Math.max(open, close) * (1 + Math.random() * (volatility * 0.5));
      const low = Math.min(open, close) * (1 - Math.random() * (volatility * 0.5));
      currentPrice = close;
      return {
        time: `${i}:00`,
        open,
        high,
        low,
        close,
        value: close
      };
    });
    return { ...a, price: currentPrice, sparkline: history };
  });

  // Simple Session Store
  const sessions = new Map<string, any>();

  // Middleware to verify session (Security Guarantee)
  const authMiddleware = (req: any, res: any, next: any) => {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId || !sessions.has(sessionId)) {
        return res.status(401).json({ error: "Unauthorized Access" });
    }
    const userId = sessions.get(sessionId);
    req.user = serverUsers.find(u => u.id === userId);
    next();
  };

  // Admin Security Layer
  const adminMiddleware = (req: any, res: any, next: any) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: "Access Denied: High Privilege Required" });
    }
    next();
  };

  app.post("/api/auth/register", (req, res) => {
    const { name, email, phone, country } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Missing identity data" });
    
    // Check if user already exists
    if (serverUsers.find(u => u.email === email)) {
        return res.status(400).json({ error: "Terminal ID already commissioned" });
    }

    const newUser = {
      id: 'u' + Date.now(),
      name,
      email,
      phone: phone || 'N/A',
      country: country || 'N/A',
      balance: 0, // Starts at 0, claimed via bonus
      status: 'Active',
      verified: true,
      joined: new Date().toISOString().split('T')[0],
      isAdmin: false,
      cards: [],
      portfolio: [],
      trades: []
    };

    serverUsers.push(newUser);
    const sessionId = Math.random().toString(36).substring(7);
    sessions.set(sessionId, newUser.id);
    
    res.json({ user: newUser, sessionId });
  });

  app.post("/api/user/claim-bonus", authMiddleware, (req: any, res) => {
    const user = serverUsers.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    if ((user as any).bonusClaimed) {
        return res.status(400).json({ error: "Bonus already extracted" });
    }

    user.balance += 10000;
    (user as any).bonusClaimed = true;
    
    res.json({ success: true, balance: user.balance });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email } = req.body;
    const user = serverUsers.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    
    const sessionId = Math.random().toString(36).substring(7);
    sessions.set(sessionId, user.id);
    res.json({ user, sessionId });
  });

  // Middleware to verify session (Security Guarantee)
  // (Moved up for temporal dead zone safety)

  app.get("/api/assets", (req, res) => {
    res.json(serverAssets);
  });

  app.get("/api/user/me", authMiddleware, (req: any, res) => {
    res.json(req.user);
  });

  // Admin Security Layer
  // (Moved up for temporal dead zone safety)

  app.get("/api/admin/users", authMiddleware, adminMiddleware, (req, res) => {
    res.json(serverUsers);
  });

  app.post("/api/admin/adjust-balance", authMiddleware, adminMiddleware, (req, res) => {
    const { userId, amount } = req.body;
    const userIdx = serverUsers.findIndex(u => u.id === userId);
    if (userIdx === -1) return res.status(404).json({ error: "User not found" });
    
    serverUsers[userIdx].balance += amount;
    res.json(serverUsers[userIdx]);
  });

  app.post("/api/admin/set-trend", authMiddleware, adminMiddleware, (req, res) => {
    const { assetId, trend } = req.body;
    const assetIdx = serverAssets.findIndex(a => a.id === assetId);
    if (assetIdx === -1) return res.status(404).json({ error: "Asset not found" });
    
    serverAssets[assetIdx].trend = trend;
    res.json(serverAssets[assetIdx]);
  });

  // Simulation loop on server
  setInterval(() => {
    serverAssets = serverAssets.map(asset => {
        const isVolatile = asset.symbol.includes('GOLD') || asset.symbol.includes('BTC');
        const defaultVolatility = isVolatile ? 0.002 : 0.0004;
        
        const open = asset.price;
        let bias = 0;
        if (asset.trend === 'PUMP') bias = defaultVolatility * 2;
        if (asset.trend === 'DUMP') bias = -defaultVolatility * 2;
        if (asset.trend === 'STABLE') bias = 0;

        const changePercent = ((Math.random() - 0.5) * defaultVolatility) + bias;
        const close = open * (1 + changePercent);
        
        // Generate realistic High/Low
        const range = Math.abs(close - open);
        const high = Math.max(open, close) + (Math.random() * range * 0.5);
        const low = Math.min(open, close) - (Math.random() * range * 0.5);

        const newSparkline = [...asset.sparkline.slice(1), { 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
          open,
          high,
          low,
          close,
          value: close
        }];

        return {
          ...asset,
          price: close,
          change24h: asset.change24h + (changePercent * 100),
          sparkline: newSparkline
        };
    });
  }, 2000);

  // --- Vite / Frontend Serving ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Financial Server running on http://localhost:${PORT}`);
  });
}

startServer();
