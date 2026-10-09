from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

app = FastAPI(
    title="VigilPay API",
    description="UPI Fraud Risk Detection and Security Monitoring API",
    version="1.0.0",
)

# Development configuration only.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)


class AnalyzeRequest(BaseModel):
    upi_id: str = Field(min_length=3, max_length=100)
    amount: float = Field(gt=0, allow_inf_nan=False)

    @field_validator("upi_id")
    @classmethod
    def validate_upi_id(cls, value: str) -> str:
        value = value.strip()

        if "@" not in value or value.startswith("@") or value.endswith("@"):
            raise ValueError("Enter a UPI ID in a format such as name@bank")

        return value


@app.get("/")
def root():
    return {
        "app": "VigilPay",
        "message": "UPI Security API is running",
        "status": "online",
    }


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "VigilPay API",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.post("/api/v1/analyze")
def analyze_payment(request: AnalyzeRequest):
    score = 10
    reasons = []

    # Educational demonstration rules only—not a real fraud detector.
    if request.amount >= 50000:
        score += 40
        reasons.append("High transaction amount (₹50,000 or more)")
    elif request.amount >= 10000:
        score += 25
        reasons.append("Elevated transaction amount (₹10,000 or more)")

    upi_name, upi_handle = request.upi_id.split("@", 1)

    if len(upi_name) < 3 or len(upi_handle) < 2:
        score += 20
        reasons.append("UPI ID has an unusually short name or handle")

    score = min(score, 100)

    if score >= 60:
        verdict = "DANGEROUS"
    elif score >= 30:
        verdict = "SUSPICIOUS"
    else:
        verdict = "SAFE"

    if not reasons:
        reasons.append("No configured demo risk rules were triggered")

    return {
        "upi_id": request.upi_id,
        "amount": request.amount,
        "risk_score": score,
        "verdict": verdict,
        "reasons": reasons,
        "analysis_type": "demo_rule_based",
        "disclaimer": (
            "This educational demo score is not proof of fraud or safety."
        ),
        "analyzed_at": datetime.now(timezone.utc).isoformat(),
    }