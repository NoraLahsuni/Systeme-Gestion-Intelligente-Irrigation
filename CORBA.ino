#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>       // Ensure this library is installed!
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

// --- Wi-Fi Credentials ---
const char* ssid = "RT";         // REPLACE with your Wi-Fi network name
const char* password = "12345678"; // REPLACE with your Wi-Fi password
// -------------------------

// --- Gateway Server Configuration ---
// Use the IP address you provided for the machine running the Python Gateway script
const char* gatewayUrl = "http://192.168.148.171:5001/sensordata"; // Using your IP, default Flask port 5000
// --------------------------------

// --- Sensor and Relay Pin Definitions ---
#define DHTPIN     D4       // DHT11 sensor pin
#define DHTTYPE    DHT11
DHT_Unified dht(DHTPIN, DHTTYPE);

#define SOIL_PIN   A0       // Soil moisture sensor pin
#define RELAY_PIN  D6       // Relay control pin for pump
// ------------------------------------

// --- Control Logic Threshold ---
const int MOISTURE_THRESHOLD = 70; // Pump ON if moisture < 70%
// -----------------------------

// --- Timing for Sending Data ---
unsigned long lastSendTime = 0;
const long sendInterval = 60000; // Send data every 60 seconds (60000 milliseconds)
// -----------------------------

// --- Global variables for sensor data ---
float currentTemperature = NAN; // Use NAN to indicate invalid reading initially
float currentAirHumidity = NAN;
int currentSoilMoisture = -1; // Use -1 for invalid reading
bool currentPumpState = false;
// ------------------------------------

void setup() {
  Serial.begin(115200); // Start Serial for debugging messages
  delay(1000);
  Serial.println(F("\nESP8266 Sensor Client for CORBA Gateway"));

  // --- Connect to Wi-Fi ---
  Serial.printf("Connecting to %s ", ssid);
  WiFi.mode(WIFI_STA); // Set WiFi to station mode explicitly
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(F("\nWiFi connected!"));
  Serial.print(F("IP address: "));
  Serial.println(WiFi.localIP());
  // -----------------------

  // Initialisation DHT
  dht.begin();
  sensor_t sensor;
  dht.temperature().getSensor(&sensor);
  Serial.print(F("Temp Sensor: ")); Serial.println(sensor.name);
  dht.humidity().getSensor(&sensor);
  Serial.print(F("Humid Sensor: ")); Serial.println(sensor.name);

  // Initialisation du relais (Active-LOW) -> Start HIGH for OFF
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Pump OFF at startup for Active-LOW relay
  currentPumpState = false;      // Initialize pump state variable
  Serial.println(F("Relay initialised (Pump OFF)"));

  // Allow sensors to stabilize
  delay(2000);
}

void loop() {
  // --- Read Sensors ---
  sensors_event_t event;

  // Read Temperature
  dht.temperature().getEvent(&event);
  if (!isnan(event.temperature)) {
    currentTemperature = event.temperature;
    // Serial.print(F("Temp: ")); Serial.print(currentTemperature); Serial.println(F(" °C")); // Print only if changed?
  } else {
    Serial.println(F("Erreur lecture temperature DHT!"));
    currentTemperature = NAN; // Mark as invalid
  }

  // Read Air Humidity
  dht.humidity().getEvent(&event);
  if (!isnan(event.relative_humidity)) {
    currentAirHumidity = event.relative_humidity;
    // Serial.print(F("Humidite: ")); Serial.print(currentAirHumidity); Serial.println(F(" %"));
  } else {
    Serial.println(F("Erreur lecture humidite DHT!"));
    currentAirHumidity = NAN; // Mark as invalid
  }

  // Read Soil Moisture
  int raw = analogRead(SOIL_PIN);
  if (raw >= 0 && raw <= 1023) { // Basic sanity check
     int moisturePercent = map(raw, 1023, 0, 0, 100); // Assuming 1023=dry, 0=wet
     currentSoilMoisture = constrain(moisturePercent, 0, 100);
     // Serial.print(F("Humidité sol: ")); Serial.print(currentSoilMoisture);
     // Serial.print(F(" % (raw=")); Serial.print(raw); Serial.println(F(")"));
  } else {
    Serial.println(F("Erreur lecture humidite sol (invalid raw value)!"));
    currentSoilMoisture = -1; // Mark as invalid
  }

  // --- Control Pump Logic (Active-LOW) ---
  bool desiredPumpState = false;
  if (currentSoilMoisture != -1) { // Only decide if soil reading is valid
      if (currentSoilMoisture < MOISTURE_THRESHOLD) {
          desiredPumpState = true; // Soil is dry -> Pump should be ON
      } else {
          desiredPumpState = false; // Soil is wet -> Pump should be OFF
      }
  } else {
      desiredPumpState = false; // Safety: Turn pump OFF if soil reading is invalid
  }

  // Apply the desired state only if it's different from the current state
  if (desiredPumpState != currentPumpState) {
      currentPumpState = desiredPumpState; // Update the global state variable
      if (currentPumpState) {
          Serial.println(F(">> Sol sec - Pompe ON (Relais Actif LOW)"));
          digitalWrite(RELAY_PIN, LOW); // Send LOW to turn ON Active-LOW relay
      } else {
          Serial.println(F(">> Sol humide/Erreur - Pompe OFF (Relais Actif LOW)"));
          digitalWrite(RELAY_PIN, HIGH); // Send HIGH to turn OFF Active-LOW relay
      }
  }

  // --- Send Data Periodically ---
  unsigned long currentTime = millis();
  if (currentTime - lastSendTime >= sendInterval) {
    lastSendTime = currentTime; // Update the last send time

    // Check WiFi status before trying to send
    if (WiFi.status() == WL_CONNECTED) {
      sendDataToGateway(); // Call the function to format and send data
    } else {
      Serial.println("Cannot send data: WiFi not connected.");
      // Optional: Add reconnection logic here if needed
      // WiFi.begin(ssid, password);
    }
  }

  // Short delay to yield control, prevents watchdog timer issues on some ESP boards
   delay(10);
}

// --- Function to Send Data to Gateway ---
void sendDataToGateway() {
  WiFiClient client;
  HTTPClient http;

  Serial.print(F("[HTTP] Connecting to Gateway: "));
  Serial.println(gatewayUrl);

  if (http.begin(client, gatewayUrl)) {
    http.addHeader("Content-Type", "application/json");

    // ===== FIXED: Specify JSON document capacity =====
    StaticJsonDocument<200> jsonDoc;   // ← must specify a size in <>!
    // Or, alternatively:
    // DynamicJsonDocument jsonDoc(200);

    if (!isnan(currentTemperature))   jsonDoc["temperature"]   = currentTemperature;
    if (!isnan(currentAirHumidity))   jsonDoc["air_humidity"]  = currentAirHumidity;
    if (currentSoilMoisture != -1)    jsonDoc["soil_moisture"] = currentSoilMoisture;
    jsonDoc["pump_on"] = currentPumpState;

    String jsonOutput;
    serializeJson(jsonDoc, jsonOutput);
    Serial.print(F("[HTTP] Sending JSON: "));
    Serial.println(jsonOutput);

    int httpCode = http.POST(jsonOutput);
    if (httpCode > 0) {
      Serial.printf("[HTTP] POST successful, response code: %d\n", httpCode);
    } else {
      Serial.printf("[HTTP] POST failed, error: %s\n",
                    http.errorToString(httpCode).c_str());
    }

    http.end();
    Serial.println(F("[HTTP] Connection closed."));
  } else {
    Serial.println(F("[HTTP] Unable to connect to gateway."));
  }
}
