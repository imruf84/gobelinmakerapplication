#ifndef __DEVICE_MANAGER_H__
#define __DEVICE_MANAGER_H__

#include "Device.h"
#include "LinkedList.h"

class DeviceManager
{
  private:
    LinkedList<Device*> devices = LinkedList<Device*>();

  public:
    DeviceManager();
    void addDevice(Device *d);
    String getDeviceIDs();
    void doAction(String action);
    void doLoop();
};

#endif
