#include "Utils.h"

#include "Motor.h"

// Saját parancsok teljesítése.
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
    sscanf(msg.c_str(), "%d,%d", &a, &b);
    // Válasz küldése.
    Serial.print("addResponse:");
    Serial.print(a);
    Serial.print("+");
    Serial.print(b);
    Serial.print("=");
    Serial.println(a + b);

    return;
  }
}

void setup()
{
  // Globális beállítások végrehajtása.
  mySetup();

  // Motorok létrehozása.
  deviceManager.addDevice(new Motor("MOTOR_X", 3, 4, 5, 6));
  deviceManager.addDevice(new Motor("MOTOR_Y", 7, 8, 9, 10));
}

void loop()
{
  loopSerialEvent();
}
