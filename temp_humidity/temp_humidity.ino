
/*
  Web client

 This sketch connects to a website (http://www.google.com)
 using a WiFi shield.

 This example is written for a network using WPA encryption. For
 WEP or WPA, change the Wifi.begin() call accordingly.

 This example is written for a network using WPA encryption. For
 WEP or WPA, change the Wifi.begin() call accordingly.

 Circuit:
 * WiFi shield attached

 created 13 July 2010
 by dlf (Metodo2 srl)
 modified 31 May 2012
 by Tom Igoe
 */


#ifndef __CC3200R1M1RGC__
// Do not include SPI for CC3200 LaunchPad
#include <SPI.h>
#endif
#include <WiFi.h>

/* setup temperature and humidity sensor */
#include "DHT.h"
#define  TEMP_HUMI_PIN  24
DHT dht(TEMP_HUMI_PIN, DHT22);  /* sensor object */

#define  SOUND_SENSOR  39 

//our network name also called SSID
char ssid[] = "Mi A3";
// your network password
char password[] = "idontknow";

// if you don't want to use DNS (and reduce your sketch size)
// use the numeric IP instead of the name for the server:
IPAddress server(192, 168, 95, 184);
//char server[] = "energia.nu";    // name address for Google (using DNS)

// Initialize the Ethernet client library
// with the IP address and port of the server
// that you want to connect to (port 80 is default for HTTP):
WiFiClient client;


void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(115200);

  // temperature-humidity sensor
  dht.begin();
  
  // attempt to connect to Wifi network:
  Serial.print("Attempting to connect to Network named: ");
  // print the network name (SSID);
  Serial.println(ssid); 
  // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
  WiFi.begin(ssid, password);
  while ( WiFi.status() != WL_CONNECTED) {
    // print dots while we wait to connect
    Serial.print(".");
    delay(300);
  }
  
  Serial.println("\nYou're connected to the network");
  Serial.println("Waiting for an ip address");
  
  while (WiFi.localIP() == INADDR_NONE) {
    // print dots while we wait for an ip addresss
    Serial.print(".");
    delay(300);
  }

  Serial.println("\nIP Address obtained");
  printWifiStatus();
  char json[128];
  readSensors(json);
  Serial.println("\nStarting connection to server...");
  // if you get a connection, report back via serial:
  client.connect(server, 3000);
}

void loop() {
  Serial.println("Sending data");
  sendHTTPRequest();
  // if there are incoming bytes available
  // from the server, read them and print them:
  while (client.available()) {
    char c = client.read();
    Serial.write(c);
  }

  // if the server's disconnected, stop the client:
  if (!client.connected()) {
    Serial.println();
    Serial.println("disconnecting from server.");
    client.stop();
    client.connect(server, 3000);  // retry connection
  }
  delay(2000);
}


void printWifiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}

int readSensors(char *json)
{
  int temp  = dht.readTemperature();
  int humi  = dht.readHumidity();
  int sound = analogRead(SOUND_SENSOR);
  // create json
  Serial.println();
  sprintf(json, "{\"temp\": %d, \"humi\": %d, \"sound\": %d}",\
          temp, humi, rand()%30);
  Serial.println(json);
  return strlen(json);
}

void sendHTTPRequest()
{
    char json[128];
    
    int len = readSensors(json);
    // Make a HTTP request:
    client.println("POST / HTTP/1.1");
    client.println("Content-Type: application/json");
    client.print("Content-Length: ");
    client.println(len);
    client.println();
    client.println(json);
    client.println();
}


