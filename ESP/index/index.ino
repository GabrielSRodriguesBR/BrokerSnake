
#include <Keypad.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#define MSG_BUFFER_SIZE  (50)

const char* ssid = "CMCC-SiE7";
const char* password = "G@bri3lN@j@";
const char* mqtt_server = "192.168.100.42";
const char* topic = "snake";
WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
char msg[MSG_BUFFER_SIZE];

const byte rows = 4; 
const byte cols = 4;
char KeyPadMatriz[rows][cols] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};
byte pinRows[rows] = {23,22,3,21}; 
byte pinCols[cols] = {19,18,5,17};

Keypad key_pad = Keypad( makeKeymap(KeyPadMatriz), pinRows, pinCols, rows, cols );




void setup_wifi() {

  delay(10);
  Serial.println();
  Serial.print("Conectando em ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("IP: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Mensagem recebida [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando MQTT...");
    String clientId = "ESP32-GABS";
    
    if (client.connect(clientId.c_str())) {
      Serial.println("MQTT Conectado!");
      client.subscribe(topic);
      client.publish(topic,"Teclado conectado.");
      
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" tentando novamente em 5 seg...");
      
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  else{
     char key_press = key_pad.getKey();
    if (key_press) {
      client.publish(topic,&key_press);
    }
    
  }
   client.loop();
 

 // client.loop();
}
