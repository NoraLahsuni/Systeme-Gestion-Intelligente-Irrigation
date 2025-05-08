from flask import Flask, request, jsonify, render_template # type: ignore
import sys
import json
import sqlite3
#---------------------
# --- Function to Initialize SQLite Database ---
def initialize_database():
    """Creates the database file and table if they don't exist."""
    print(f"Initializing database '{DATABASE_FILE}'...")
    try:
        # Use check_same_thread=False for Flask's multithreaded access
        conn = sqlite3.connect(DATABASE_FILE, check_same_thread=False)
        cursor = conn.cursor()
        # This definition includes the 'id' column
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sensor_readings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                temperature REAL,
                air_humidity REAL,
                soil_moisture INTEGER,
                pump_on INTEGER NOT NULL
            )
        ''')
        conn.commit()
        conn.close()
        print("Database initialized successfully.")
        return True
    except sqlite3.Error as e:
        print(f"FATAL ERROR: Failed to initialize SQLite database: {e}", file=sys.stderr)
        return False
# -----------------------------------------

# --- Function to Save Data to SQLite ---
def save_to_database(timestamp, temp, air_hum, soil_moist, pump_on):
    """Inserts a new record into the sensor_readings table."""
    print("Attempting to save data to SQLite database...")
    try:
        conn = sqlite3.connect(DATABASE_FILE, check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO sensor_readings (timestamp, temperature, air_humidity, soil_moisture, pump_on)
            VALUES (?, ?, ?, ?, ?)
        ''', (timestamp, temp, air_hum, soil_moist, 1 if pump_on else 0))
        conn.commit()
        conn.close()
        print("Data saved to database successfully.")
        return True
    except sqlite3.Error as e:
        print(f"ERROR saving data to SQLite database: {e}", file=sys.stderr)
        return False
# --------------------------------------

# --- Function to Get Readings from DB (Used by Web UI and JSON API) ---
def get_readings_from_db(limit=None):
     """
     Fetches sensor readings from the database.
     If limit is specified, gets the latest N records.
     If limit is None, gets all records.
     """
     readings = []
     # --- CODE FIX: Order by timestamp instead of id to avoid 'no such column' error ---
     # --- if the table was created without the id column initially.              ---
     query = '''
            SELECT timestamp, temperature, air_humidity, soil_moisture, pump_on
            FROM sensor_readings
            ORDER BY timestamp DESC
        '''
     # --------------------------------------------------------------------------------
     params = []
     if limit:
         query += " LIMIT ?"
         params.append(limit)

     try:
        conn = sqlite3.connect(DATABASE_FILE, check_same_thread=False)
        conn.row_factory = sqlite3.Row # Access rows by column name
        cursor = conn.cursor()
        cursor.execute(query, params)
        readings = cursor.fetchall() # Fetch results
        conn.close()
        print(f"Fetched {len(readings)} readings from database (Limit: {limit}).")
     except sqlite3.Error as e:
        print(f"ERROR fetching data from SQLite database: {e}", file=sys.stderr)
     # Convert Row objects to dictionaries for JSON serialization
     return [dict(row) for row in readings]