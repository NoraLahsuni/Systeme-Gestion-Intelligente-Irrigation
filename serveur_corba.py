import sys
import threading
import sqlite3
import CORBA
import SDR
import SDR__POA
from flask import Flask, request, jsonify
from flask_cors import CORS

# ✅ Initialisation Flask
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# ✅ Initialisation de la base de données
def init_db():
    conn = sqlite3.connect("donnees_capteurs.db")
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS capteurs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            temperature REAL,
            humidite REAL,
            humidite2 REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            pompe TEXT
        )
    """)
    conn.commit()
    conn.close()

# ✅ Classe CORBA implémentée
class IrrigationImpl(SDR__POA.CapteurData):
    def envoyerDonnees(self, temperature, humidite, humidite2, pompe):
        print("➡️ Données reçues via CORBA :")
        print(f"Température : {temperature}°C | Humidité de sol: {humidite}% |Humidité: {humidite2}| Pompe : {'ON' if pompe else 'OFF'}")

        conn = sqlite3.connect("donnees_capteurs.db")
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO capteurs (temperature, humidite,humidite2, pompe)
            VALUES (?, ?, ? ,?)
        """, (temperature, humidite,humidite2, 'ON' if pompe else 'OFF'))
        conn.commit()
        conn.close()

        return "Données enregistrées avec succès"

    def arroser(self):
        print("Système d'irrigation activé.")
        return "Arrosage terminé"

# ✅ Routes REST
@app.route('/api/mesures', methods=['GET'])
def get_all_data():
    conn = sqlite3.connect("donnees_capteurs.db")
    cur = conn.cursor()
    cur.execute("SELECT * FROM capteurs")
    rows = cur.fetchall()
    conn.close()
    result = [
        {"id": row[0], "temperature": row[1], "humidite": row[2],"humidite2":row[3],"timestamp": row[4], "pompe": row[5]}
        for row in rows
    ] if rows else []
    return jsonify(result)

@app.route('/api/mesures/last', methods=['GET'])
def get_last_data():
    conn = sqlite3.connect("donnees_capteurs.db")
    cur = conn.cursor()
    cur.execute("SELECT * FROM capteurs ORDER BY id DESC LIMIT 1")
    row = cur.fetchone()
    conn.close()
    result = {
        "id": row[0], "temperature": row[1], "humidite": row[2],"humidite2":row[3],"timestamp": row[4], "pompe": row[5]
    } if row else {}
    return jsonify(result)

# ✅ Endpoint POST /data (pont REST → CORBA)
@app.route('/data', methods=['POST'])
def receive_data():
    data = request.get_json()
    if data:
        try:
            temperature = float(data.get("temperature", 0.0))
            humidity = float(data.get("soil_humidity", 0.0))
            humidite2= float(data.get("air_humidity", 0.0))
            pump_state = bool(data.get("pump_state", False))
            pot_value = 0.0  # valeur fictive

            print("📥 Données reçues via REST :")
            print(f"Température : {temperature}°C")
            print(f"Humidité  : {humidite2}%")
            print(f"Humidité de sol : {humidity}%")
            print(f"Pompe : {'ON' if pump_state else 'OFF'}")

            # Appel local à la méthode CORBA (objet `corba_servant`)
            response = corba_servant.envoyerDonnees(temperature, humidity, humidite2, pump_state)
            return jsonify({"status": "success", "message": response}), 200
        except Exception as e:
            print("Erreur lors du traitement :", e)
            return jsonify({"status": "error", "message": str(e)}), 500
    else:
        return jsonify({"error": "Données non valides"}), 400

# ✅ Serveur CORBA
def start_corba():
    global corba_servant  # pour l'utiliser dans /data
    orb = CORBA.ORB_init(sys.argv, CORBA.ORB_ID)
    poa = orb.resolve_initial_references("RootPOA")
    poa_manager = poa._get_the_POAManager()
    poa_manager.activate()

    corba_servant = IrrigationImpl()
    obj_ref = corba_servant._this()

    with open("ior.txt", "w") as f:
        f.write(orb.object_to_string(obj_ref))

    print("✅ Serveur CORBA prêt. IOR écrit dans ior.txt")
    orb.run()

# ✅ Lancement combiné
if __name__ == "__main__":
    init_db()  # Toujours init DB en premier
    threading.Thread(target=lambda: app.run(host='0.0.0.0', port=5000)).start()
    start_corba()
