#ifndef __MOTOR_H__
#define __MOTOR_H__

#define MOTOR_STEPS_PER_ONE_TURN 4096

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
    // dm:steps|MOTOR_X|100 (100 lépést tesz meg a 'MOTOR_X')
    // dm:turns|MOTOR_X|1   (1 teljes kört tesz meg a 'MOTOR_X')
    // dm:angle|MOTOR_X|90  (90 fokos szöget fordul el a 'MOTOR_X')
    virtual void doAction(String action);
    virtual void doLoop();
    virtual bool isFinished();
    virtual void finishAction();
    void moveSteps(int32_t steps);
    void run();
};

#endif
