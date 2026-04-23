const API_BASE = "/api";

export class ApiService {
  private static sessionId: string | null = localStorage.getItem("z_session_id");

  private static get headers() {
    return {
      "Content-Type": "application/json",
      "x-session-id": this.sessionId || "",
    };
  }

  static setSession(id: string) {
    this.sessionId = id;
    localStorage.setItem("z_session_id", id);
  }

  static clearSession() {
    this.sessionId = null;
    localStorage.removeItem("z_session_id");
  }

  static async register(name: string, email: string, phone?: string, country?: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, country }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  static async login(email: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  static async getAssets() {
    const res = await fetch(`${API_BASE}/assets`);
    return res.json();
  }

  static async getMe() {
    const res = await fetch(`${API_BASE}/user/me`, { headers: this.headers });
    if (!res.ok) throw new Error("Session expired");
    return res.json();
  }

  static async getAdminUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, { headers: this.headers });
    if (!res.ok) throw new Error("Admin access denied");
    return res.json();
  }

  static async adjustBalance(userId: string, amount: number) {
    const res = await fetch(`${API_BASE}/admin/adjust-balance`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ userId, amount }),
    });
    return res.json();
  }

  static async setTrend(assetId: string, trend: string) {
    const res = await fetch(`${API_BASE}/admin/set-trend`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ assetId, trend }),
    });
    return res.json();
  }

  static async claimBonus() {
    const res = await fetch(`${API_BASE}/user/claim-bonus`, {
      method: "POST",
      headers: this.headers
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
}
