/// <reference path="RequestHandler.ts"/>
/// <reference path="../utils/Utils.ts"/>

/**
 * Motorvezérlő kezelője.
 */
class MotorControlHandler extends RequestHandler {

    constructor(parent: RequestHandler) {
        super('/motorcontrol', 'Motor control', parent);
    }

    protected postDataProcess(req, res, data): boolean {

        var key: string;

        key = 'MOTOR_X';
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
            ' X: <input type="number" name="MOTOR_X" value="0">' +
            ' <br><br><input type="submit" value="Send">' +
            '</form>' +
            '</center>'
        );

    };
}