/// <reference path="RequestHandler.ts"/>
/// <reference path="../utils/Utils.ts"/>
/// <reference path="../devices/DeviceAction.ts"/>
/// <reference path="../devices/DeviceManager.ts"/>

/**
 * Motorvezérlő kezelője.
 */
class MotorControlHandler extends RequestHandler {

    /**
     * Konstruktor.
     * 
     * @param parent szülő kérés
     */
    constructor(parent: RequestHandler) {
        super('/motorcontrol', 'Motor control', parent);
    }

    /**
     * Űrlap adatainak a feldolgozása (POST adatok).
     * 
     * @param req kérés
     * @param res válasz
     * @param data adatok
     * @return minden esetben hamis (használaton kívüli)
     */
    protected postDataProcess(req, res, data): boolean {

        // Motorok vezérlése.
        /*for (var key of ['MB', 'MBN']) {
            // Ha van adat az elküldött űrlapon, akkor feldolgozzuk.
            if (data[key]) {
                var value: number = Number(data[key]);
                // Érvénytelen adatokat nem küldünk.
                if (!isNaN(value) && 0 != value) {
                    // Parancs tárolása.
                    //DeviceManager.doAction(
                    ActionManager.storeAction(
                        new DeviceAction(
                            key, 
                            ReusableCounter.generate(), 
                            'angle', 
                            [value], 
                            function () {
                                console.log(this.getDeviceID() + ' is finished.');
                            }
                        )
                    );
                }
            }
        }*/

        ActionManager.storeAction(new DeviceAction('ARM1', 'm+123-456'));

        return false;
    };

    /**
     * Kérés lekezelése (űrlap megjelenítése).
     * 
     * @param req kérés
     * @param res válasz
     */
    protected handle(req, res): void {

        // Megjelenítjük az űrlapot. 
        res.write('<br><br>');
        res.write(
            '<center>' +
            '<form action="' + this.getPath() + '" method="post">' +
            '<table border="0">');

        // Motorok beviteli mezőjének a megjelenítése.
        for (var s of DeviceManager.getDevicesIDs()) {
            res.write(' <tr><td>' + s + ':</td><td><input type="number" name="MB" value="10"></td></tr>');
        }

        res.write(
            ' <tr><td colspan="2" align="center"><br><input type="submit" value="Send"></td></tr>' +
            '</table>' +
            '</form>' +
            '</center>'
        );

    };
}