/// <reference path="RequestHandler.ts"/>
/// <reference path="../utils/Utils.ts"/>
/// <reference path="../devices/DeviceAction.ts"/>
/// <reference path="../devices/DeviceManager.ts"/>

/**
 * Motorvezérlő kezelője.
 */
class MotorControlHandler extends RequestHandler {

    constructor(parent: RequestHandler) {
        super('/motorcontrol', 'Motor control', parent);
    }

    protected postDataProcess(req, res, data): boolean {

        var key: string;

        key = 'MB';
        if (data[key]) {
            var value: number = Number(data[key]);
            DeviceManager.doAction(
                new DeviceAction(key, 'angle', [isNaN(value) ? 0 : value], function(){console.log(this.getDeviceID() + ' is finished.');})
            );
        }

        key = 'MBN';
        if (data[key]) {
            var value: number = Number(data[key]);
            DeviceManager.doAction(
                new DeviceAction(key, 'angle', [isNaN(value) ? 0 : value], function(){console.log(this.getDeviceID() + ' is finished.');})
            );
        }

        return false;
    };

    protected handle(req, res): void {

        // Megjelenítjük az űrlapot. 
        res.write('<br><br>');
        res.write(
            '<center>' + 
            '<form action="' + this.getPath() + '" method="post">' +
            '<table border="0">' +
            ' <tr><td>Bottom motion:</td><td><input type="number" name="MB" value="0"></td></tr>' +
            ' <tr><td>Bottom needle:</td><td><input type="number" name="MBN" value="0"></td></tr>' +
            ' <tr><td colspan="2" align="center"><br><input type="submit" value="Send"></td></tr>' +
            '</table>' + 
            '</form>' +
            '</center>'
        );

    };
}