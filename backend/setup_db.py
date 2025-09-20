# setup_db.py
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import os

load_dotenv(".env")

DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")

def create_tables():
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    cursor = conn.cursor()

    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        user_password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE
    );
    """)

    # Colleges table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS colleges (
        id SERIAL PRIMARY KEY,
        college_code VARCHAR(20) NOT NULL UNIQUE,
        college_name VARCHAR(100) NOT NULL
    );
    """)

    # Programs table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS programs (
        id SERIAL PRIMARY KEY,
        program_code VARCHAR(20) NOT NULL UNIQUE,
        program_name VARCHAR(100) NOT NULL,
        college_id INTEGER REFERENCES colleges(id) ON DELETE SET NULL
    );
    """)

    # Students table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        student_id SERIAL PRIMARY KEY,
        id_number VARCHAR(20) NOT NULL UNIQUE,
        last_name VARCHAR(50) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Others')),
        year_level VARCHAR(3) NOT NULL CHECK (year_level IN ('1','2','3','4','4+')),
        college_id INTEGER REFERENCES colleges(id) ON DELETE SET NULL,
        program_id INTEGER REFERENCES programs(id) ON DELETE SET NULL
    );
    """)

    conn.commit()
    cursor.close()
    conn.close()
    print("All tables created successfully (if not existed).")

if __name__ == "__main__":
    create_tables()
