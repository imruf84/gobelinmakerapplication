/// <reference path="RequestHandler.ts"/>
/// <reference path="../utils/Utils.ts"/>

/**
 * Motorvezérlő kezelője.
 */
class MotorControlHandler extends RequestHandler {

    constructor(parent: RequestHandler) {
        super('/motorcontrol', 'Motorvezérlő', parent);
    }

    protected beforeHandle(req, res): boolean {
        // Ha vannak paraméterek, akkor végrehajtjuk az utasítást...
        if (Utils.keys(req.body).length > 0) {
            
            // ...majd frissítjük az oldalt (hogy minden post adat eltűnjön).
            // HACK: - ez azért kell, hogy az oldal bármikor frissíthető legyen a 'biztosan elhagyja az oldalt' figyelmeztetés nélkül
            //this.refresh(res);
            console.log(req.body);
            res.redirect(this.getPath());
            return true;
        }

        return false;
    };

    protected handle(req, res): void {

        // Megjelenítjük az űrlapot. 
        res.write('<br><br>');
        res.write(
            '<form action="' + this.getPath() + '" method="post">' +
            ' X: <input type="number" name="MOTOR_X" value="0">' +
            ' <br><br><input type="submit" value="Elküld">' +
            '</form>'
        );

    };
}