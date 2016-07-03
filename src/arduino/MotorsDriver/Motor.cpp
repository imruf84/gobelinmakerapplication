#include "Motor.h"

Motor::Motor(String ID, uint8_t pin1, uint8_t pin2, uint8_t pin3, uint8_t pin4): Device(ID)
{
  stepper = new AccelStepper(8, pin1, pin3, pin2, pin4);

  stepper->setMaxSpeed(1000);
  stepper->setAcceleration(500);
  stepper->setSpeed(1000);
}

void Motor::doAction(String action)
{
  // Adott számú lépés végrehajtása.
  if (action.startsWith("dm:steps|"))
  {
    int steps;
    sscanf(action.c_str(), "dm:steps|%[^'|']|%d", NULL, &steps);

    // Parancs végrehajtása.
    stepper->move(steps);

    isRunning = true;
    return;
  }

  // Adott számú teljes kör végrehajtása.
  if (action.startsWith("dm:turns|"))
  {
    int rounds;
    sscanf(action.c_str(), "dm:turns|%[^'|']|%d", NULL, &rounds);

    // Parancs végrehajtása.
    stepper->move(rounds * MOTOR_STEPS_PER_ONE_TURN);

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
  Serial.print(getDeviceID());
  Serial.print(":");
  Serial.println("finished");
}

AccelStepper* Motor::getStepper()
{
  return stepper;
}

bool Motor::isFinished()
{
  return ((0 == stepper->distanceToGo()) && isRunning);
}

void Motor::moveSteps(int32_t steps)
{
  stepper->move(steps);
}

void Motor::run()
{
  if (isFinished()) return;

  stepper->run();
}

