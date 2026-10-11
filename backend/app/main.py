from contextlib import asynccontextmanager
from datetime import datetime, timezone
import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from backend.app.database.connection import (
    initialize_database,
    get_connection,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create the database table when the API starts.
    initialize_database()
    yield


app = FastAPI(
    title="VigilPay API",
    description="UPI Fraud Risk Detection and Security Monitoring API",
    version="1.0.0",
    lifespan=lifespan,
)

# Development configuration only.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://vigilpay-dashboard.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    upi_id: str = Field(min_length=3, max_length=100)
    amount: float = Field(gt=0, allow_inf_nan=False)

    @field_validator("upi_id")
    @classmethod
    def validate_upi_id(cls, value: str) -> str:
        value = value.strip()

        if (
            "@" not in value
            or value.startswith("@")
            or value.endswith("@")
        ):
            raise ValueError(
                "Enter a UPI ID like name@bank"
            )

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
    # Educational demonstration rules, not verified fraud detection.
    score = 10
    reasons = []

    if request.amount >= 50000:
        score += 40
        reasons.append(
            "High transaction amount (₹50,000 or more)"
        )
    elif request.amount >= 10000:
        score += 25
        reasons.append(
            "Elevated transaction amount (₹10,000 or more)"
        )

    upi_name, upi_handle = request.upi_id.split("@", 1)

    if len(upi_name) < 3 or len(upi_handle) < 2:
        score += 20
        reasons.append(
            "UPI ID has an unusually short name or handle"
        )

    score = min(score, 100)

    if score >= 60:
        verdict = "DANGEROUS"
    elif score >= 30:
        verdict = "SUSPICIOUS"
    else:
        verdict = "SAFE"

    if not reasons:
        reasons.append(
            "No configured demo risk rules were triggered"
        )

    analyzed_at = datetime.now(timezone.utc).isoformat()

    # Save this analysis in the SQLite database.
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO payment_scans (
                upi_id,
                amount,
                risk_score,
                verdict,
                reasons,
                analyzed_at
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                request.upi_id,
                request.amount,
                score,
                verdict,
                json.dumps(reasons),
                analyzed_at,
            ),
        )
        scan_id = cursor.lastrowid
        connection.commit()

    return {
        "id": scan_id,
        "upi_id": request.upi_id,
        "amount": request.amount,
        "risk_score": score,
        "verdict": verdict,
        "reasons": reasons,
        "analysis_type": "demo_rule_based",
        "disclaimer": (
            "This educational demo score is not proof "
            "of fraud or safety."
        ),
        "analyzed_at": analyzed_at,
    }


@app.get("/api/v1/scans")
def get_scan_history(limit: int = 50):
    # Limit how many records can be requested at once.
    limit = max(1, min(limit, 100))

    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT
                id,
                upi_id,
                amount,
                risk_score,
                verdict,
                reasons,
                analyzed_at
            FROM payment_scans
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()

    scans = []

    for row in rows:
        scans.append({
            "id": row["id"],
            "upi_id": row["upi_id"],
            "amount": row["amount"],
            "risk_score": row["risk_score"],
            "verdict": row["verdict"],
            "reasons": json.loads(row["reasons"]),
            "analyzed_at": row["analyzed_at"],
        })

    return {
        "count": len(scans),
        "scans": scans,
    }
