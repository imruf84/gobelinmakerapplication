#ifndef __DEVICE_H__
#define __DEVICE_H__

#include <Arduino.h>

class Device
{
  private:
    String ID = "";
    String actionID = "";

  public:
    Device(String ID);
    String getDeviceID();
    // dm:action|deviceID|param1|param2|...|paramN
    virtual void doAction(String action, String actionID) = 0;
    virtual void doLoop() = 0;
    virtual bool isFinished() = 0;
    virtual void finishAction() = 0;
    void setActionID(String actionID);
    String getActionID();
};

#endif
