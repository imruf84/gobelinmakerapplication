#include "StepperMotor.h"

StepperMotor::StepperMotor(uint8_t index, uint8_t stepPin, uint8_t directionPin)
{
  this->index = index;
  this->stepPin = stepPin;
  this->directionPin = directionPin;

  pinMode(stepPin, OUTPUT);
  pinMode(directionPin, OUTPUT);
  digitalWrite(stepPin, LOW);
  digitalWrite(directionPin, LOW);
}

void StepperMotor::step(boolean inverse)
{
  digitalWrite(directionPin, inverse ? HIGH : LOW);
  digitalWrite(stepPin, HIGH);
  debug(inverse ? "-" : "+");
  debug("m");
  debug(index);
}

void StepperMotor::stop()
{
  digitalWrite(stepPin, LOW);
}

