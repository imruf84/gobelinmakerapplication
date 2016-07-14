#include "Motor.h"

Motor::Motor(String ID, uint8_t pin1, uint8_t pin2, uint8_t pin3, uint8_t pin4): Device(ID)
{
  stepper = new AccelStepper(8, pin1, pin3, pin2, pin4);

  stepper->setMaxSpeed(1000);
  stepper->setAcceleration(500);
  stepper->setSpeed(1000);
}

void Motor::doAction(String action, uint16_t actionID)
{
  // Adott számú lépés végrehajtása.
  if (action.startsWith("dm:steps|"))
  {
    long steps;
    sscanf(action.c_str(), "dm:steps|%[^'|']|%ld", NULL, &steps);

    // Parancs végrehajtása.
    moveSteps(steps);

    // Parancs azonosító tárolása.
    setActionID(actionID);

    isRunning = true;
    return;
  }

  // Adott számú teljes kör végrehajtása.
  if (action.startsWith("dm:turns|"))
  {
    long rounds;
    sscanf(action.c_str(), "dm:turns|%[^'|']|%ld", NULL, &rounds);

    // Parancs végrehajtása.
    moveSteps(rounds * MOTOR_STEPS_PER_ONE_TURN);

    // Parancs azonosító tárolása.
    setActionID(actionID);

    isRunning = true;
    return;
  }

  // Adott szöggel való elfordulás végrehajtása.
  if (action.startsWith("dm:angle|"))
  {
    long angle;
    sscanf(action.c_str(), "dm:angle|%[^'|']|%ld", NULL, &angle);

    // Parancs végrehajtása.
    moveSteps((MOTOR_STEPS_PER_ONE_TURN*angle) / 360l);

    // Parancs azonosító tárolása.
    setActionID(actionID);

    isRunning = true;
    return;
  }

}

void Motor::doLoop()
{
  if (isFinished())
  {
    finishAction();
    return;
  }

  stepper->run();
}

void Motor::finishAction()
{
  isRunning = false;
  Serial.print("dm:");
  Serial.print("finished|");
  Serial.print(getDeviceID());
  Serial.print("$");
  Serial.println(getActionID());
  setActionID(0);
}

AccelStepper* Motor::getStepper()
{
  return stepper;
}

bool Motor::isFinished()
{
  return ((0 == stepper->distanceToGo()) && isRunning);
}

void Motor::moveSteps(long steps)
{
  stepper->move(steps);
}

void Motor::run()
{
  if (isFinished()) return;

  stepper->run();
}

