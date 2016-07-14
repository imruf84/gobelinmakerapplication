#ifndef __DEVICE_H__
#define __DEVICE_H__

#include <Arduino.h>

class Device
{
  private:
    String ID = "";
    uint16_t actionID = 0;

  public:
    Device(String ID);
    String getDeviceID();
    // dm:action|deviceID|param1|param2|...|paramN
    virtual void doAction(String action, uint16_t actionID) = 0;
    virtual void doLoop() = 0;
    virtual bool isFinished() = 0;
    virtual void finishAction() = 0;
    void setActionID(uint16_t actionID);
    uint16_t getActionID();
};

#endif
