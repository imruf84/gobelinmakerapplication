/// <reference path="../math/Geom.ts"/>

class DeltaRobot {

    constructor() {

        // Végpont jelenlegi koordinátái
        var x0: number = .5;
        var y0: number = -1.;
        var z0: number = 3;
        // Végpont következő koordinátái
        var x1: number = 1.5;
        var y1: number = 1.;
        var z1: number = 1;
        // Motorok távolsága
        var dm: number = 5.;
        // Motorok karjainak a hossza
        var lm: number = 2.;
        // Végpont karjainak a hossza
        var le: number = 1.;
        // Fő karok hossza.
        var la: number = 3.;


        var prevSteps: number[] = [0, 0, 0, 0];
        for (var t: number = .0; t < 1.; t += .0001) {

            // Szögek meghatározása.
            var angles: number[] = [
                Geom.calcAngle(x0, y0, z0, x1, y1, z1, dm, lm, le, la, 0, 1, 0, 1, 0, 0, t),
                Geom.calcAngle(x0, y0, z0, x1, y1, z1, dm, lm, le, la, -1, 0, 0, 0, 1, 0, t),
                Geom.calcAngle(x0, y0, z0, x1, y1, z1, dm, lm, le, la, 0, -1, 0, -1, 0, 0, t),
                Geom.calcAngle(x0, y0, z0, x1, y1, z1, dm, lm, le, la, 1, 0, 0, 0, -1, 0, t)
            ];


            var control: string = "";
            var hasControl: boolean = false;
            for (var i: number = 0; i < 4; i++) {

                // Ha nem létezik szög akkor leállunk.
                if (isNaN(angles[i])) {
                    Messages.error("NaN detected!");
                    return;
                }

                // Szög átalakítása lépésekre.
                var step: number = Vector.toSteps(angles[i]);

                // Ha van eltérés az előző értéktől...
                if (step != prevSteps[i]) {
                    // ...és nem az első lépésnél járunk...
                    if (t > .0) {
                        // ...akkor végrehajtjuk a parancsot a motoron.
                        //control += "["+(i+1)+":"+(step-prevSteps[i])+"]  " + angles[i] + "  " + step;
                        control += "[" + (i + 1) + ":" + (step - prevSteps[i]) + "]";
                        hasControl = true;
                    }
                    // Jelenlegi érték tárolása.
                    prevSteps[i] = step;
                }

            }

            // Ha volt parancs, akkor várunk.
            if (hasControl) {
                Messages.log(t + ":" + control);
            }

        }

    }


}