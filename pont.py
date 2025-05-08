from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/data', methods=['POST'])
def receive_data():
    data = request.get_json()
    
    if data:
        temperature = data.get("temperature")
        humidity = data.get("humidity")
        pot_value = data.get("pot_value")
        pump_state = data.get("pump_state")

        print("📥 Données reçues :")
        print(f"Température : {temperature}°C")
        print(f"Humidité : {humidity}%")
        print(f"Potentiomètre : {pot_value}")
        print(f"Pompe : {'ON' if pump_state else 'OFF'}")

        # Ici, plus tard, on pourra appeler le serveur CORBA

        return jsonify({"status": "success"}), 200
    else:
        return jsonify({"error": "Données non valides"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
