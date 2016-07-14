#include "Device.h"

Device::Device(String ID)
{
  this->ID = ID;
}

String Device::getDeviceID()
{
  return ID;
}

void Device::setActionID(uint16_t actionID)
{
  this->actionID = actionID;
}
uint16_t Device::getActionID()
{
  return this->actionID;
}

