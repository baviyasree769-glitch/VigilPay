import { useState } from "react";
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  XCircle,
} from "lucide-react";

function PaymentAnalyzer() {
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);

  const analyzePayment = (event) => {
    event.preventDefault();

    if (!upiId || !amount) {
      return;
    }

    const numericAmount = Number(amount);

    let riskScore = 10;
    let verdict = "SAFE";

    if (numericAmount > 10000) {
      riskScore += 30;
    }

    if (upiId.length < 6 || !upiId.includes("@")) {
      riskScore += 35;
    }

    if (riskScore >= 60) {
      verdict = "DANGEROUS";
    } else if (riskScore >= 30) {
      verdict = "SUSPICIOUS";
    }

    setResult({
      riskScore,
      verdict,
    });
  };

  return (
    <section className="analyzer">
      <div className="analyzer-header">
        <div>
          <span className="badge">PAYMENT SECURITY</span>

          <h2>Analyze a UPI Payment</h2>

          <p>
            Enter the payment information below. VigilPay will
            evaluate the transaction for potential security risks.
          </p>
        </div>

        <ShieldCheck size={48} />
      </div>

      <form onSubmit={analyzePayment} className="analyzer-form">
        <div className="form-group">
          <label>UPI ID / VPA</label>

          <input
            type="text"
            placeholder="example@upi"
            value={upiId}
            onChange={(event) => setUpiId(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Transaction Amount</label>

          <input
            type="number"
            placeholder="Enter amount in INR"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>

        <button type="submit" className="analyze-button">
          <Search size={19} />
          Analyze Payment
        </button>
      </form>

      {result && (
        <div className={`result-card ${result.verdict.toLowerCase()}`}>
          {result.verdict === "SAFE" && (
            <ShieldCheck size={38} />
          )}

          {result.verdict === "SUSPICIOUS" && (
            <AlertTriangle size={38} />
          )}

          {result.verdict === "DANGEROUS" && (
            <XCircle size={38} />
          )}

          <div>
            <span>Security Verdict</span>

            <h3>{result.verdict}</h3>

            <p>
              Risk Score: <strong>{result.riskScore}/100</strong>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default PaymentAnalyzer;