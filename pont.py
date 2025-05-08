from flask import Flask, request, jsonify
import CORBA
import SDR  # le module généré par omniidl
import SDR__POA  # utile si tu ajoutes une implémentation locale (pas nécessaire ici)

app = Flask(__name__)

# Initialisation CORBA
orb = CORBA.ORB_init()
with open("ior.txt", "r") as f:
    ior = f.read()
obj = orb.string_to_object(ior)
capteur = obj._narrow(SDR.CapteurData)

@app.route('/data', methods=['POST'])
def receive_data():
    data = request.get_json()
    
    if data:
        temperature = float(data.get("temperature", 0.0))
        humidity = float(data.get("humidity", 0.0))
        pot_value = int(data.get("pot_value", 0))
        pump_state = bool(data.get("pump_state", False))

        print("📥 Données reçues :")
        print(f"Température : {temperature}°C")
        print(f"Humidité : {humidity}%")
        print(f"Potentiomètre : {pot_value}")
        print(f"Pompe : {'ON' if pump_state else 'OFF'}")

        # Appel CORBA
        capteur.envoyerDonnees(temperature, humidity, pot_value, pump_state)

        return jsonify({"status": "success"}), 200
    else:
        return jsonify({"error": "Données non valides"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
