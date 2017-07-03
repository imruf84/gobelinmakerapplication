#ifndef __MOTOR_H__
#define __MOTOR_H__

#define MOTOR_STEPS_PER_ONE_TURN 4096l

#include "Device.h"
#include <AccelStepper.h>

class Motor: public Device
{
  private:
    AccelStepper *stepper = NULL;
    bool isRunning = false;

  public:
    Motor(String ID, uint8_t pin1, uint8_t pin2, uint8_t pin3, uint8_t pin4);
    AccelStepper* getStepper();
    // dm:steps|MOTOR_X|100$3 (100 lépést tesz meg a 'MOTOR_X' 3-as parancs azonosítóval)
    // dm:turns|MOTOR_X|1$3   (1 teljes kört tesz meg a 'MOTOR_X' 3-as parancs azonosítóval)
    // dm:angle|MOTOR_X|90$3  (90 fokos szöget fordul el a 'MOTOR_X' 3-as parancs azonosítóval)
    virtual void doAction(String action, String actionID);
    virtual void doLoop();
    virtual bool isFinished();
    virtual void finishAction();
    void moveSteps(long steps);
    void run();
};

#endif
