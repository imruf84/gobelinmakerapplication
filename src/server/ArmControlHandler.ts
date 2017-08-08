/// <reference path="RequestHandler.ts"/>
/// <reference path="../utils/Utils.ts"/>
/// <reference path="../devices/DeviceAction.ts"/>
/// <reference path="../devices/DeviceManager.ts"/>

/**
 * Motorvezérlő kezelője.
 */
class ArmHandler extends RequestHandler {

    /**
     * Motorok száma.
     */
    private motorsCount: number = 3;

    /**
     * Konstruktor.
     * 
     * @param parent szülő kérés
     */
    constructor(parent: RequestHandler) {
        super('/armcontrol', 'Arm control', parent);
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

        if (data['m']) {
            ActionManager.storeAction(new DeviceAction('ARM1', 'm+123-456'));
        }

        return false;
    };

    /**
     * Kérés lekezelése (űrlap megjelenítése).
     * 
     * @param req kérés
     * @param res válasz
     */
    protected handle(req, res): void {

        // Megjelenítjük az űrlapokat. 

        for (var deviceID of DeviceManager.getDevicesIDs()) {

            res.write('<br><br>');
            res.write(
                '<center>' +
                deviceID + 
                '<form action="' + this.getPath() + '" method="post">' +
                '<table border="1">' +
                ' <thead>' + 
                '  <tr>'
            );

            for (var i = 0; i < this.motorsCount; i++) {
                res.write('<th>' + i + '</th>');
            }

            res.write('  </tr>');
            res.write(' </thead>');
            res.write(' <tbody>');
            

            // Motorok beviteli mezőjének a megjelenítése.
            res.write(' <tr>');
            for (var i = 0; i < this.motorsCount; i++) {
                res.write('<td><input type="input" name="m' + i + '" value="+" size=1></td>');
            }
            res.write(' </tr>');
            
            res.write(
                //' <tr><td colspan="' + this.motorsCount + '" align="center"><input name="m" type="text" value=""></td></tr>' +
                ' <tr><td colspan="' + this.motorsCount + '" align="center"><input type="submit" value="Send"></td></tr>' +
                ' </tbody>' + 
                '</table>' +
                '</form>' +
                '</center>'
            );

        }

    };
}