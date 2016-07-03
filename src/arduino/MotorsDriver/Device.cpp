#include "Device.h"

Device::Device(String ID)
{
  this->ID = ID;
}

String Device::getDeviceID()
{
  return ID;
}

