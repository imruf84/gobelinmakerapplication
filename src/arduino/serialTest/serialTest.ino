void handleCustomEvent(String msg)
{
  String action = "";
  
  // Teszt esemény: add:1,2 -> addResponse:1+2=3
  action = "add:";
  if (msg.startsWith(action))
  {
    // Parancs szövegének törlése.
    msg.remove(0, action.length());

    // Adatok kinyerése.
    int a, b;
    char c[msg.length() + 1];
    msg.toCharArray(c, msg.length() + 1);
    sscanf(c, "%d,%d", &a, &b);
    // Válasz küldése.
    Serial.print("addResponse:");
    Serial.print(a);
    Serial.print("+");
    Serial.print(b);
    Serial.print("=");
    Serial.println(a+b);

    return;
  }
}

#define DEVICE_ID "TEST_DEVICE_1"

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

  // Egyéb egyedi események kezelése.
  handleCustomEvent(msg);
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
