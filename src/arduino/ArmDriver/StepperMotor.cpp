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
  //Serial.print(inverse ? "-" : "+");
  //Serial.print("m");
  //Serial.print(index);
}

void StepperMotor::stop()
{
  digitalWrite(stepPin, LOW);
}

