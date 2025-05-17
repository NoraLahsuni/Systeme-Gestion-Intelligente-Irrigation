#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>       // Ensure this library is installed!
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

// --- Wi-Fi Credentials ---
const char* ssid     = "RT";          
const char* password = "12345678";    
// -------------------------

// --- Gateway Server Configuration ---
const char* gatewayUrl = "http://192.168.29.252:5000/data";  
// -------------------------------------

// --- Sensor and Relay Pins ---
#define DHTPIN     D4       
#define DHTTYPE    DHT11
DHT_Unified dht(DHTPIN, DHTTYPE);

#define SOIL_PIN   A0       
#define RELAY_PIN  D6       
// -------------------------

// --- Control Threshold (en %) ---
const int MOISTURE_THRESHOLD = 70; 
// -------------------------

// --- Timing for Sending Data ---
unsigned long lastSendTime = 0;
const long sendInterval = 60000; // 60 000 ms
// -------------------------

// --- Globals ---
float currentTemperature   = NAN;
float currentAirHumidity   = NAN;
int   rawSoilValue         = -1;
int   soilHumidityPercent  = -1;
bool  currentPumpState     = false;
// -----------------------

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println(F("\nESP8266 Sensor Client"));

  // Connexion Wi-Fi
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.printf("Connecting to %s", ssid);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\nWiFi connected, IP = " + WiFi.localIP().toString());

  // Init DHT
  dht.begin();
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Relay OFF (active-LOW)
  currentPumpState = false;
  delay(2000); // Stabilisation capteurs
}

void loop() {
  // 1) Lecture DHT
  sensors_event_t ev;
  dht.temperature().getEvent(&ev);
  currentTemperature = isnan(ev.temperature) ? NAN : ev.temperature;
  
  dht.humidity().getEvent(&ev);
  currentAirHumidity = isnan(ev.relative_humidity) ? NAN : ev.relative_humidity;

  // 2) Lecture sol (brute) et conversion en %
  rawSoilValue = analogRead(SOIL_PIN);
  if (rawSoilValue >= 0 && rawSoilValue <= 1023) {
    // map: 1023 (très sec) → 0 %; 0 (trempé) → 100 %
    soilHumidityPercent = map(rawSoilValue, 1023, 0, 0, 100);
    soilHumidityPercent = constrain(soilHumidityPercent, 0, 100);
  } else {
    soilHumidityPercent = -1; // erreur de lecture
  }

  // 3) Logique pompe (ON si sol trop sec)
  bool desired = (soilHumidityPercent >= 0 && soilHumidityPercent < MOISTURE_THRESHOLD);
  if (desired != currentPumpState) {
    currentPumpState = desired;
    if (currentPumpState) {
      Serial.println(F(">> Sol sec → Pompe ON"));
      digitalWrite(RELAY_PIN, LOW);
    } else {
      Serial.println(F(">> Sol humide/Erreur → Pompe OFF"));
      digitalWrite(RELAY_PIN, HIGH);
    }
  }

  // 4) Envoi périodique
  if (millis() - lastSendTime >= sendInterval) {
    lastSendTime = millis();
    if (WiFi.status() == WL_CONNECTED) {
      sendDataToGateway();
    } else {
      Serial.println(F("WiFi déconnecté, impossible d'envoyer"));
    }
  }

  delay(10);
}

void sendDataToGateway() {
  WiFiClient client;
  HTTPClient http;
  Serial.print(F("[HTTP] POST to "));
  Serial.println(gatewayUrl);

  if (!http.begin(client, gatewayUrl)) {
    Serial.println(F("[HTTP] Échec de la connexion"));
    return;
  }
  http.addHeader("Content-Type", "application/json");

  // Construction du JSON
  StaticJsonDocument<256> doc;
  if (!isnan(currentTemperature))      doc["temperature"]     = currentTemperature;
  if (!isnan(currentAirHumidity))      doc["air_humidity"]    = currentAirHumidity;
  if (soilHumidityPercent >= 0)        doc["soil_humidity"]   = soilHumidityPercent;
  doc["pump_state"] = currentPumpState ? 1 : 0;

  String payload;
  serializeJson(doc, payload);
  Serial.print(F("[HTTP] Payload: "));
  Serial.println(payload);

  int code = http.POST(payload);
  if (code > 0) {
    Serial.printf("[HTTP] Réponse code: %d\n", code);
  } else {
    Serial.printf("[HTTP] Erreur POST: %s\n", http.errorToString(code).c_str());
  }
  http.end();
  Serial.println(F("[HTTP] Connexion fermée"));
}
