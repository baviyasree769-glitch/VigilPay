
import { useEffect, useState } from "react";

import {
  ShieldCheck,
  Activity,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import PaymentAnalyzer from "./components/PaymentAnalyzer";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadScans() {
    try {
      setError("");

      const response = await fetch(`${API_URL}/api/v1/scans`);

      if (!response.ok) {
        throw new Error("Could not load scan history.");
      }

      const data = await response.json();
      setScans(data.scans || []);
    } catch (err) {
      setError(
        "Could not connect to the backend. Check that the API server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadScans();

    const interval = setInterval(loadScans, 10000);

    return () => clearInterval(interval);
  }, []);

  const suspiciousCount = scans.filter(
    (scan) => scan.verdict === "SUSPICIOUS"
  ).length;

  const dangerousCount = scans.filter(
    (scan) => scan.verdict === "DANGEROUS"
  ).length;

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">
            <ShieldCheck size={28} />
          </div>

          <div>
            <h1>VigilPay</h1>
            <span>UPI Security Platform</span>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          System Online
        </div>
      </header>

      <main className="main-content">
        <section className="hero">
          <div className="hero-text">
            <span className="badge">
              UPI SECURITY MONITORING
            </span>

            <h2>
              Protect every payment
              <br />
              before you pay.
            </h2>

            <p>
              VigilPay analyzes UPI payment information and
              identifies suspicious activity using a demo,
              rule-based risk engine.
            </p>
          </div>

          <div className="security-card">
            <ShieldCheck size={52} />

            <h3>VigilPay Security</h3>

            <p>
              Payment risk analysis and scan history monitoring.
            </p>

            <div className="security-status">
              <Activity size={18} />
              Detection Engine Active
            </div>
          </div>
        </section>

        <PaymentAnalyzer />

        <section className="stats">
          <div className="stat-card">
            <Activity size={24} />
            <div>
              <span>Saved Scans</span>
              <strong>{scans.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <ShieldCheck size={24} />
            <div>
              <span>Suspicious Scans</span>
              <strong>{suspiciousCount}</strong>
            </div>
          </div>

          <div className="stat-card">
            <AlertTriangle size={24} />
            <div>
              <span>Dangerous Scans</span>
              <strong>{dangerousCount}</strong>
            </div>
          </div>
        </section>

        <section className="scan-history">
          <div className="history-heading">
            <div>
              <h2>Recent Scan History</h2>
              <p>Transactions saved by the VigilPay API</p>
            </div>

            <button onClick={loadScans} disabled={loading}>
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {loading && <p>Loading scan history...</p>}

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          {!loading && !error && scans.length === 0 && (
            <p>No scans recorded yet. Analyze a payment to get started.</p>
          )}

          {!loading && !error && scans.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>UPI ID</th>
                    <th>Amount</th>
                    <th>Risk Score</th>
                    <th>Verdict</th>
                    <th>Analyzed At</th>
                  </tr>
                </thead>

                <tbody>
                  {scans.map((scan) => (
                    <tr key={scan.id}>
                      <td>{scan.upi_id}</td>
                      <td>
                        ₹
                        {Number(scan.amount).toLocaleString("en-IN")}
                      </td>
                      <td>{scan.risk_score}/100</td>
                      <td>
                        <span
                          className={`verdict verdict-${scan.verdict.toLowerCase()}`}
                        >
                          {scan.verdict}
                        </span>
                      </td>
                      <td>
                        {new Date(scan.analyzed_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>
          VigilPay © 2026 — Educational UPI Risk Analysis Platform
        </p>
      </footer>
    </div>
  );
}

export default App;
