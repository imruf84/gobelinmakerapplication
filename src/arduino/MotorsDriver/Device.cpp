#include "Device.h"

Device::Device(String ID)
{
  this->ID = ID;
}

String Device::getDeviceID()
{
  return ID;
}

void Device::setActionID(String actionID)
{
  this->actionID = actionID;
}
String Device::getActionID()
{
  return this->actionID;
}

