import sys
import CORBA
import SDR__POA
import sqlite3

# Define the implementation of the CORBA servant for the CapteurData interface
class IrrigationImpl(SDR__POA.CapteurData):
    
    # Method to receive sensor data and store it in the database
    def envoyerDonnees(self, temperature, humidite, potentiometre, pompe):
        print("➡️ Data received via CORBA:")
        print(f"  Temperature : {temperature}°C")
        print(f"  Humidity : {humidite}%")
        print(f"  Potentiometer : {potentiometre}")
        print(f"  Pump : {'ON' if pompe else 'OFF'}")

        # ✅ Create SQLite connection here (in the correct thread)
        conn = sqlite3.connect("donnees_capteurs.db")
        cur = conn.cursor()

        # Create the table if it doesn't already exist
        cur.execute("""
            CREATE TABLE IF NOT EXISTS capteurs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                temperature REAL,
                humidite REAL,
                potentiometre INTEGER,
                pompe TEXT
            )
        """)

        # Insert the received data into the database
        cur.execute("""
            INSERT INTO capteurs (temperature, humidite, potentiometre, pompe)
            VALUES (?, ?, ?, ?)
        """, (temperature, humidite, potentiometre, 'ON' if pompe else 'OFF'))

        # Save (commit) changes and close the database connection
        conn.commit()
        conn.close()

        return "Data successfully recorded"

    # Method to simulate the activation of the irrigation system
    def arroser(self):
        print("Irrigation system activated.")
        return "Irrigation completed"

# Initialize the CORBA ORB (Object Request Broker)
orb = CORBA.ORB_init(sys.argv, CORBA.ORB_ID)

# Get reference to Root POA (Portable Object Adapter)
poa = orb.resolve_initial_references("RootPOA")

# Get POA manager and activate it to start receiving requests
poa_manager = poa._get_the_POAManager()
poa_manager.activate()

# Create an instance of the servant and register it with the ORB
servant = IrrigationImpl()
obj_ref = servant._this()

# Convert object reference to string and write it to a file (IOR)
ior = orb.object_to_string(obj_ref)
with open("ior.txt", "w") as f:
    f.write(ior)

# Print confirmation and run the server
print("Server ready. IOR written to ior.txt")
orb.run()
