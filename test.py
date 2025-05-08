import requests
import time

for i in range(5):  # on envoie 5 jeux de données
    data = {
        "temperature": 28 + i,         # simulation dynamique
        "humidity": 45 - i,
        "pot_value": 1200 + i * 20,
        "pump_state": 1 if i % 2 == 0 else 0
    }

    response = requests.post("http://127.0.0.1:5000/data", json=data)
    print("Réponse du serveur :", response.text)
    time.sleep(2)  # pause de 2 secondes entre chaque envoi
