
import sqlite3
from pathlib import Path

DATABASE_PATH = Path(__file__).resolve().parents[1] / "vigilpay.db"


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS payment_scans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                upi_id TEXT NOT NULL,
                amount REAL NOT NULL,
                risk_score INTEGER NOT NULL,
                verdict TEXT NOT NULL,
                reasons TEXT NOT NULL,
                analyzed_at TEXT NOT NULL
            )
            """
        )
        connection.commit()
