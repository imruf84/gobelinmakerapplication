#define DEVICE_ID "TEST_DEVICE_2"

String inputString = "";
boolean stringComplete = false;

void serialEvent() 
{
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    if (inChar == '\n') {
      stringComplete = true;
      return;
    }

    inputString += inChar;
  }
}

void setup() 
{
  Serial.begin(9600);
  while(!Serial);
  inputString.reserve(200);
}

void handleEvent(String msg)
{
  // Eszköz azonosítójának a lekérdezése.
  if (msg.equals("getDeviceID"))
  {
    // Visszaküldjük az azonosítót.
    Serial.print("deviceID:");
    Serial.println(DEVICE_ID);
    return;
  }
}

void loop() 
{
  if (stringComplete) 
  {
    handleEvent(inputString);
    inputString = "";
    stringComplete = false;
  }
}
