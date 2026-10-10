
import { useState } from "react";
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  XCircle,
} from "lucide-react";

const API_URL = "https://vigilpay-zi01.onrender.com";
function PaymentAnalyzer() {
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzePayment = async (event) => {
    event.preventDefault();

    if (!upiId.trim() || !amount || Number(amount) <= 0) {
      setError("Enter a valid UPI ID and an amount greater than zero.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/v1/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          upi_id: upiId.trim(),
          amount: Number(amount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail
            ? typeof data.detail === "string"
              ? data.detail
              : JSON.stringify(data.detail)
            : "Payment analysis failed."
        );
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message || "Could not connect to the VigilPay backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="analyzer">
      <div className="analyzer-header">
        <div>
          <span className="badge">PAYMENT SECURITY</span>
          <h2>Analyze a UPI Payment</h2>
          <p>
            Analyze payment information using VigilPay's demo,
            rule-based risk engine. Results are saved to scan history.
          </p>
        </div>

        <ShieldCheck size={48} />
      </div>

      <form onSubmit={analyzePayment} className="analyzer-form">
        <div className="form-group">
          <label htmlFor="upi-id">UPI ID / VPA</label>
          <input
            id="upi-id"
            type="text"
            placeholder="example@upi"
            value={upiId}
            onChange={(event) => setUpiId(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Transaction Amount</label>
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Enter amount in INR"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="analyze-button"
          disabled={loading}
        >
          <Search size={19} />
          {loading ? "Analyzing..." : "Analyze Payment"}
        </button>
      </form>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {result && (
        <div className={`result-card ${result.verdict.toLowerCase()}`}>
          {result.verdict === "SAFE" && <ShieldCheck size={38} />}
          {result.verdict === "SUSPICIOUS" && (
            <AlertTriangle size={38} />
          )}
          {result.verdict === "DANGEROUS" && <XCircle size={38} />}

          <div>
            <span>Security Verdict</span>
            <h3>{result.verdict}</h3>
            <p>
              Risk Score: <strong>{result.risk_score}/100</strong>
            </p>
            <p>
              Scan ID: <strong>{result.id}</strong>
            </p>

            {result.reasons?.length > 0 && (
              <ul>
                {result.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            )}

            <p>
              <small>
                Demo risk assessment — not proof of fraud or safety.
              </small>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default PaymentAnalyzer;
