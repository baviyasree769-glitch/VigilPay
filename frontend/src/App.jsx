
  import {
  ShieldCheck,
  Activity,
  AlertTriangle,
} from "lucide-react";

import PaymentAnalyzer from "./components/PaymentAnalyzer";

import "./App.css";

function App() {
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
              REAL-TIME CYBERSECURITY
            </span>

            <h2>
              Protect every payment
              <br />
              before you pay.
            </h2>

            <p>
              VigilPay analyzes UPI payment information and
              identifies suspicious activity using cybersecurity
              risk analysis.
            </p>

          </div>


          <div className="security-card">

            <ShieldCheck size={52} />

            <h3>
              VigilPay Security
            </h3>

            <p>
              Real-time fraud risk analysis is ready.
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

              <span>
                System Status
              </span>

              <strong>
                ACTIVE
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <ShieldCheck size={24} />

            <div>

              <span>
                Security Engine
              </span>

              <strong>
                READY
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <AlertTriangle size={24} />

            <div>

              <span>
                Threat Alerts
              </span>

              <strong>
                0
              </strong>

            </div>

          </div>

        </section>

      </main>


      <footer>

        <p>
          VigilPay © 2026 — Real-Time UPI Fraud Detection Platform
        </p>

      </footer>

    </div>
  );
}

export default App;