#ifndef __UTILS_H__
#define __UTILS_H__

#include "DeviceManager.h"

DeviceManager deviceManager = DeviceManager();

String inputString = "";
boolean stringComplete = false;


extern void handleCustomEvent(String msg);

void mySetup()
{
  Serial.begin(9600);
  while (!Serial);
  inputString.reserve(50);
}

void handleEvent(String msg)
{
  // Eszköz(ök) azonosítójának a lekérdezése.
  if (msg.equals("getDeviceIDs"))
  {
    // Visszaküldjük az azonosítót.
    Serial.print("deviceIDs:");
    Serial.println(deviceManager.getDeviceIDs());
    return;
  }

  // Eszközkezelő kapott utasítást.
  if (msg.startsWith("dm:"))
  {
    deviceManager.doAction(msg);
    return;
  }

  // Egyéb egyedi események kezelése.
  handleCustomEvent(msg);
}

void loopSerialEvent()
{
  deviceManager.doLoop();

  if (stringComplete)
  {
    handleEvent(inputString);
    inputString = "";
    stringComplete = false;
  }
}

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

#endif
