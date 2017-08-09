/**
 * Motorvezérlő alkalmazás
 * pl. mv0.5,-1,4,0.5,-1,0 fej mozgatása a (0.5,-1,4) pontból a (0.5,-1,0) pontba
 */

/* 
mv5,0,4,-5,0,4
mv-5,0,4,5,0,4
*/

//#define DEBUG

#include "debug.h"
#include "StepperMotor.h"
#include "Vector.h"

String inputString = "";
#define INPUT_STRINT_MAX 500
boolean stringComplete = false;

#define DELAY 300

StepperMotor motors[] = {
  StepperMotor(0,3,2),
  /*StepperMotor(1,5,4),
  StepperMotor(2,6,7),
  StepperMotor(3,9,8),*/
};

const uint8_t MOTORS_COUNT = sizeof(motors)/sizeof(StepperMotor);

void setup() 
{
  while (!Serial);
  Serial.begin(9600);
  inputString.reserve(INPUT_STRINT_MAX);
}

void loop() 
{
  if (stringComplete)
  {    
    // Üzenet feldolgozása.

    // Eszközazonosító lekérdezése.
    if (inputString.equals("getDeviceIDs"))
    {
      Serial.print("deviceIDs:");
      Serial.println("ARM1");
    }

    // Fej mozgatása adott koordinátákba.
    // pl. mv12.3,45.6,7.89 fej mozgatása a (12.3,45.6,7.89) pontból a (3.21,65.4,9.87) pontba
    String command = "mv";
    if (inputString.startsWith(command))
    {
      debug(inputString);
      debug("\n");
      
      inputString = inputString.substring(command.length());

      // Kezdőpont koordinátáinak a lekérdezése.
      vector vFrom;
      for (int i = 0; i < 3; i++)
      {
        vFrom.a[i] = inputString.substring(0,inputString.indexOf(",")).toDouble();
        inputString = inputString.substring(inputString.indexOf(",")+1);
      }
      print(vFrom);
      
      // Végpont koordinátáinak a lekérdezése.
      vector vTo;
      for (int i = 0; i < 3; i++)
      {
        vTo.a[i] = inputString.substring(0,inputString.indexOf(",")).toDouble();
        inputString = inputString.substring(inputString.indexOf(",")+1);
      }
      print(vTo);

      // Végpont jelenlegi koordinátái
      double x0=vFrom.a[0];
      double y0=vFrom.a[1];
      double z0=vFrom.a[2];
      // Végpont következő koordinátái
      double x1=vTo.a[0];
      double y1=vTo.a[1];
      double z1=vTo.a[2];
      // Motorok távolsága
      double dm=5.;
      // Motorok karjainak a hossza
      double lm=3.;
      // Végpont karjainak a hossza
      double le=2.;
      // Fő karok hossza.
      double la=5.;
    
      int prevSteps[MOTORS_COUNT];
      for (double t=.0; t < 1.; t+=.001) {
      
        // Szögek meghatározása.
        double angles[] = {
            calcAngle(x0,y0,z0,x1,y1,z1,dm,lm,le,la,0,1,0,1,0,0,t),
            calcAngle(x0,y0,z0,x1,y1,z1,dm,lm,le,la,-1,0,0,0,1,0,t),
            calcAngle(x0,y0,z0,x1,y1,z1,dm,lm,le,la,0,-1,0,-1,0,0,t),
            calcAngle(x0,y0,z0,x1,y1,z1,dm,lm,le,la,1,0,0,0,-1,0,t)
        };
        
        
        String control = "";
        boolean hasControl = false;
        for (uint8_t i = 0; i < MOTORS_COUNT; i++) {
                  
          // Ha nem létezik szög akkor leállunk.
          if (isnan(angles[i])) {
            Serial.println("NaN detected!");
            return;
          }
          
          // Szög átalakítása lépésekre.
          int8_t step = toSteps(angles[i]);
          
          // Ha van eltérés az előző értéktől...
          if (step != prevSteps[i])
            {
              // ...és nem az első lépésnél járunk...
              if (t > .0) {
                // ...akkor végrehajtjuk a parancsot a motoron.
                
                debug("t=");
                debug(t);
                int16_t dStep = step-prevSteps[i];
                motors[i].step(dStep < 0);
  
                debug(" ");
                debug(dStep);
                debug("\n");
                
                hasControl = true;
              }
              // Jelenlegi érték tárolása.
              prevSteps[i] = step;
            }
          
        }
        
        // Ha volt parancs, akkor várunk.
        if (hasControl) {
  
          // Várunk egy kicsit.
          delayMicroseconds(DELAY);
  
          // Motorok leállítása.
          for (uint8_t i = 0; i < MOTORS_COUNT; i++)
          {
            motors[i].stop();
          }
    
          // Várunk egy kicsit.
          delayMicroseconds(DELAY);
        }
        
      }
  
      // Küldjük a választ, hogy végeztünk.
      Serial.println("mFinished");
    }

    inputString = "";
    stringComplete = false;
  }
}

void serialEvent()
{
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    if (inChar == '\n') {
      stringComplete = true;
      return;
    }

    inputString += inChar;
  }
}
