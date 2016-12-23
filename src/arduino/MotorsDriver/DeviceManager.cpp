#include "DeviceManager.h"

DeviceManager::DeviceManager()
{
}

void DeviceManager::addDevice(Device *d)
{
  devices.add(d);
}

String DeviceManager::getDeviceIDs()
{
  String s = "";
  for (int i = 0; i < devices.size(); i++)
  {
    s += devices.get(i)->getDeviceID() + ";";
  }

  s.remove(s.length() - 1);

  return s;
}

void DeviceManager::doAction(String action)
{

  // Címzett eszköz azonosítójának a lekérdezése.
  char pID[10];
  sscanf(action.c_str(), "dm:%[^'|']|%[^'|']", NULL, pID);
  Device *d = NULL;
  for (int i = 0; i < devices.size(); i++)
  {
    d = devices.get(i);

    // Ha egyezik az azonosító a címzettel, akkor végrehajtatjuk a műveletet.
    if (!strcmp(d->getDeviceID().c_str(), pID))
    {
      // Parancs azonosítójának a lekérdezése.
      uint16_t actionID;
      sscanf(action.c_str(), "dm:%[^'$']$%u", NULL, &actionID);
      d->doAction(action, actionID);
      return;
    }
  }
}

void DeviceManager::doLoop()
{
  for (int i = 0; i < devices.size(); i++)
  {
    devices.get(i)->doLoop();
  }
}

