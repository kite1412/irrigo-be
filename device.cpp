#include <Wire.h>
#include <BH1750.h>
#include <PubSubClient.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <EEPROM.h>
#include <ArduinoJson.h>

#define SOIL_PIN A0
#define RELAY_PIN D7
#define TRG_PIN D5
#define ECHO_PIN D6
#define COOLDOWN 20000
#define SMOOTH_COUNT 5

#define EEPROM_SIZE 512
#define EEPROM_SSID_ADDR 0
#define EEPROM_PASS_ADDR 64
#define EEPROM_MQTT_ADDR 128
#define EEPROM_CONFIGURED_ADDR 192
#define EEPROM_MIN_MOISTURE_ADDR 196
#define EEPROM_DURATION_ADDR 200
#define EEPROM_AUTOMATED_ADDR 204

const char* apSSID = "IrriGo-Config";
const char* apPassword = "12345678";
const char* deviceId = "esp01";

WiFiClient espClient;
PubSubClient client(espClient);
BH1750 lightMeter;
ESP8266WebServer server(80);
HTTPClient http;

String ssid = "";
String password = "";
String mqttServer = "";
bool configured = false;

unsigned long lastPumpTime = 0;
int readings[SMOOTH_COUNT] = {0};
int readIndex = 0;

// Watering config variables
float minSoilMoisturePercent = 20.0;
int durationMs = 2000;
bool automated = true;

const int wetThreshold = 300;
const int dryThreshold = 700;

void saveConfig() {
  EEPROM.write(EEPROM_CONFIGURED_ADDR, 1);
  for(int i=0; i<ssid.length(); i++) EEPROM.write(EEPROM_SSID_ADDR + i, ssid[i]);
  EEPROM.write(EEPROM_SSID_ADDR + ssid.length(), '\0');
  
  for(int i=0; i<password.length(); i++) EEPROM.write(EEPROM_PASS_ADDR + i, password[i]);
  EEPROM.write(EEPROM_PASS_ADDR + password.length(), '\0');
  
  for(int i=0; i<mqttServer.length(); i++) EEPROM.write(EEPROM_MQTT_ADDR + i, mqttServer[i]);
  EEPROM.write(EEPROM_MQTT_ADDR + mqttServer.length(), '\0');
  
  EEPROM.commit();
}

void saveWateringConfig() {
  EEPROM.put(EEPROM_MIN_MOISTURE_ADDR, minSoilMoisturePercent);
  EEPROM.put(EEPROM_DURATION_ADDR, durationMs);
  EEPROM.write(EEPROM_AUTOMATED_ADDR, automated ? 1 : 0);
  EEPROM.commit();
}

void loadWateringConfig() {
  EEPROM.get(EEPROM_MIN_MOISTURE_ADDR, minSoilMoisturePercent);
  EEPROM.get(EEPROM_DURATION_ADDR, durationMs);
  automated = EEPROM.read(EEPROM_AUTOMATED_ADDR) == 1;
  
  // Validasi nilai default jika EEPROM kosong
  if(isnan(minSoilMoisturePercent) || minSoilMoisturePercent < 0 || minSoilMoisturePercent > 100) {
    minSoilMoisturePercent = 20.0;
  }
  if(durationMs < 1000 || durationMs > 60000) {
    durationMs = 2000;
  }
}

void fetchWateringConfigFromBackend() {
  if(WiFi.status() != WL_CONNECTED) return;
  
  // Parse MQTT server untuk mendapatkan IP backend (asumsi backend di IP yang sama)
  String backendUrl = "http://" + mqttServer + ":5001/watering-config";
  
  http.begin(espClient, backendUrl);
  int httpCode = http.GET();
  
  if(httpCode == 200) {
    String payload = http.getString();
    StaticJsonDocument<256> doc;
    DeserializationError error = deserializeJson(doc, payload);
    
    if(!error && doc["success"] == true) {
      JsonObject data = doc["data"];
      if(data.containsKey("min_soil_moisture_percent")) {
        minSoilMoisturePercent = data["min_soil_moisture_percent"].as<float>();
      }
      if(data.containsKey("duration_ms")) {
        durationMs = data["duration_ms"].as<int>();
      }
      if(data.containsKey("automated")) {
        automated = data["automated"].as<bool>();
      }
      saveWateringConfig();
      Serial.println("Config fetched from backend");
      Serial.printf("Min: %.2f%%, Duration: %dms, Automated: %s\n", 
        minSoilMoisturePercent, durationMs, automated ? "true" : "false");
    }
  }
  http.end();
}

void loadConfig() {
  configured = EEPROM.read(EEPROM_CONFIGURED_ADDR) == 1;
  if(!configured) return;
  
  char buf[64];
  for(int i=0; i<64; i++) {
    buf[i] = EEPROM.read(EEPROM_SSID_ADDR + i);
    if(buf[i] == '\0') break;
  }
  ssid = String(buf);
  
  for(int i=0; i<64; i++) {
    buf[i] = EEPROM.read(EEPROM_PASS_ADDR + i);
    if(buf[i] == '\0') break;
  }
  password = String(buf);
  
  for(int i=0; i<64; i++) {
    buf[i] = EEPROM.read(EEPROM_MQTT_ADDR + i);
    if(buf[i] == '\0') break;
  }
  mqttServer = String(buf);
}

void handleRoot() {
  String html = "<html><body><h1>IrriGo Configuration</h1>";
  html += "<form action='/save' method='POST'>";
  html += "WiFi SSID: <input name='ssid' value='" + ssid + "'><br>";
  html += "WiFi Password: <input name='pass' type='password' value='" + password + "'><br>";
  html += "MQTT Server: <input name='mqtt' value='" + mqttServer + "'><br>";
  html += "<input type='submit' value='Save'></form></body></html>";
  server.send(200, "text/html", html);
}

void handleSave() {
  ssid = server.arg("ssid");
  password = server.arg("pass");
  mqttServer = server.arg("mqtt");
  
  saveConfig();
  
  String html = "<html><body><h1>Saved!</h1>";
  html += "<p>Restarting...</p></body></html>";
  server.send(200, "text/html", html);
  
  delay(2000);
  ESP.restart();
}

float calculateMoisturePercent(int rawValue) {
  float percent = ((float)(dryThreshold - rawValue) * 100.0) / (float)(dryThreshold - wetThreshold);

  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;

  return percent;
}

void waterPlant(bool isManual = false) {
  digitalWrite(RELAY_PIN, LOW);
  Serial.printf("Pompa menyala (%s) - Duration: %dms\n", isManual ? "Manual" : "Auto", durationMs);
  delay(durationMs);
  digitalWrite(RELAY_PIN, HIGH);
  Serial.println("Pompa mati");
  StaticJsonDocument<64> doc;
  doc["manual"] = isManual;
  doc["duration_ms"] = durationMs;
  char buffer[64];
  serializeJson(doc, buffer);
  client.publish("devices/1/watering", buffer);
  lastPumpTime = millis();
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("]: ");
  
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, message);
  
  if(error) {
    Serial.println("JSON parse error");
    return;
  }

  // Handle watering_config
  if(strcmp(topic, "server/watering_config") == 0) {
    if(doc.containsKey("min_soil_moisture_percent")) {
      minSoilMoisturePercent = doc["min_soil_moisture_percent"].as<float>();
    }
    if(doc.containsKey("duration_ms")) {
      durationMs = doc["duration_ms"].as<int>();
    }
    if(doc.containsKey("automated")) {
      automated = doc["automated"].as<bool>();
    }
    saveWateringConfig();
    Serial.printf("Config updated: Min=%.2f%%, Duration=%dms, Auto=%s\n", 
      minSoilMoisturePercent, durationMs, automated ? "true" : "false");
  }
  
  // Handle water_now
  if(strcmp(topic, "server/water_now") == 0) {
    if(doc["command"] == "water_now") {
      Serial.println("Manual watering triggered");
      waterPlant(true);
    }
  }
}

void setupAP() {
  WiFi.mode(WIFI_AP);
  WiFi.softAP(apSSID, apPassword);
  Serial.println("AP Mode: " + String(apSSID));
  Serial.println("IP: " + WiFi.softAPIP().toString());
  
  server.on("/", handleRoot);
  server.on("/save", HTTP_POST, handleSave);
  server.begin();
}

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(TRG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  digitalWrite(RELAY_PIN, HIGH);

  Wire.begin(D2, D1);
  Serial.begin(115200);
  EEPROM.begin(EEPROM_SIZE);

  if (lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE)) {
    Serial.println("BH1750 ready");
  } else {
    Serial.println("BH1750 error");
  }

  loadConfig();
  loadWateringConfig();

  if(!configured || ssid.length() == 0) {
    setupAP();
    return;
  }

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid.c_str(), password.c_str());
  
  int timeout = 20;
  while(WiFi.status() != WL_CONNECTED && timeout > 0){
    delay(500);
    Serial.print(".");
    timeout--;
  }
  
  if(WiFi.status() != WL_CONNECTED) {
    Serial.println("\nWiFi failed, starting AP");
    setupAP();
    return;
  }
  
  Serial.println("\nWiFi connected: " + WiFi.localIP().toString());
  client.setServer(mqttServer.c_str(), 1883);
  client.setCallback(mqttCallback);

  // Fetch config from backend saat startup
  fetchWateringConfigFromBackend();
}

void loop() {
  if(WiFi.getMode() == WIFI_AP) {
    server.handleClient();
    return;
  }

  if(!client.connected()){
    while(!client.connected()){
      if(client.connect(deviceId)) {
        client.subscribe("server/watering_config");
        Serial.println("Subscribed to server/watering_config");
        client.subscribe("server/water_now");
        Serial.println("Subscribed to server/water_now");
      }
      delay(500);
    }
  }

  client.loop();

  digitalWrite(TRG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH);
  float distance = duration * 0.0343 / 2.0;
  String dist = String(distance, 2);
  client.publish("devices/1/ultrasonic", dist.c_str());

  int soilValue = analogRead(SOIL_PIN);
  readings[readIndex] = soilValue;
  readIndex = (readIndex + 1) % SMOOTH_COUNT;
  int sum = 0;
  for(int i=0;i<SMOOTH_COUNT;i++) sum += readings[i];
  soilValue = sum / SMOOTH_COUNT;
  
  float moisturePercent = calculateMoisturePercent(soilValue);
  
  String soilStr = String(soilValue);
  client.publish("devices/1/soil", soilStr.c_str());

  float lux = lightMeter.readLightLevel();
  String luxStr = String(lux, 2);
  client.publish("devices/1/light", luxStr.c_str());

  Serial.printf("Dist: %.2f | Soil: %d (%.2f%%) | Lux: %.2f\n", 
    distance, soilValue, moisturePercent, lux);
  
  unsigned long currentTime = millis();

  // Auto watering jika mode automated
  if(automated && moisturePercent < minSoilMoisturePercent && 
     (currentTime - lastPumpTime >= COOLDOWN)) {
    waterPlant(false);
    return;
  }

  delay(1000); 
}