#ifndef _STEPPER_H_
#define _STEPPER_H_

#include <Arduino.h>

class StepperMotor
{
  private:
    uint8_t index;
    uint8_t stepPin;
    uint8_t directionPin;
  public:
    StepperMotor(uint8_t index, uint8_t stepPin, uint8_t directionPin);
    void step(boolean inverse);
    void stop();
};

#endif
