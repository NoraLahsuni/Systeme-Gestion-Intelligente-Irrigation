import sqlite3
import random
import time
from datetime import datetime
import threading

def init_db():
    conn = sqlite3.connect('donnees_capteurs.db')
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS mesures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            temperature REAL,
            humidite REAL,
            potentiometre INTEGER,
            pompe TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def generate_fake_data():
    conn = sqlite3.connect('donnees_capteurs.db')
    cur = conn.cursor()
    
    # Generate random sensor data
    temperature = round(random.uniform(20, 30), 2)  # Temperature between 20-30°C
    humidite = round(random.uniform(40, 80), 2)    # Humidity between 40-80%
    potentiometre = random.randint(0, 1023)        # Potentiometer value 0-1023
    pompe = random.choice([True, False])           # Pump state
    
    # Insert data into database
    cur.execute("""
        INSERT INTO mesures (temperature, humidite, potentiometre, pompe)
        VALUES (?, ?, ?, ?)
    """, (temperature, humidite, potentiometre, pompe))
    
    conn.commit()
    conn.close()

def run_fake_data_generator():
    while True:
        generate_fake_data()
        time.sleep(5)  # Generate new data every 5 seconds

def start_fake_data_generator():
    init_db()
    data_thread = threading.Thread(target=run_fake_data_generator)
    data_thread.daemon = True
    data_thread.start()