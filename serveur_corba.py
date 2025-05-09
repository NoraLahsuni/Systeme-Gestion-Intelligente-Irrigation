import sys
import CORBA
import SDR__POA
import sqlite3

class IrrigationImpl(SDR__POA.CapteurData):
    def envoyerDonnees(self, temperature, humidite, potentiometre, pompe):
        print("➡️ Données reçues via CORBA :")
        print(f"  Température : {temperature}°C")
        print(f"  Humidité : {humidite}%")
        print(f"  Potentiomètre : {potentiometre}")
        print(f"  Pompe : {'ON' if pompe else 'OFF'}")

        # ✅ Créer la connexion SQLite ici (dans le bon thread)
        conn = sqlite3.connect("donnees_capteurs.db")
        cur = conn.cursor()

        # Créer la table si elle n'existe pas 
        cur.execute("""
            CREATE TABLE IF NOT EXISTS capteurs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                temperature REAL,
                humidite REAL,
                potentiometre INTEGER,
                pompe TEXT
            )
        """)

        # Insérer les données
        cur.execute("""
            INSERT INTO capteurs (temperature, humidite, potentiometre, pompe)
            VALUES (?, ?, ?, ?)
        """, (temperature, humidite, potentiometre, 'ON' if pompe else 'OFF'))

        conn.commit()
        conn.close()

        return "Données enregistrées avec succès"

    def arroser(self):
        print("Système d'irrigation activé.")
        return "Arrosage terminé"

orb = CORBA.ORB_init(sys.argv, CORBA.ORB_ID)
poa = orb.resolve_initial_references("RootPOA")
poa_manager = poa._get_the_POAManager()
poa_manager.activate()

servant = IrrigationImpl()
obj_ref = servant._this()

ior = orb.object_to_string(obj_ref)
with open("ior.txt", "w") as f:
    f.write(ior)

print("Serveur prêt. IOR écrit dans ior.txt")
orb.run()
