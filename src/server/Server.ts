declare function require(s: string);

/**
 * Szerver.
 */
class Server {

    /**
     * Port.
     */
    private port: number = -1;

    /**
     * Konstruktor.
     * 
     * @param port port
     * @param callback sikeres indítás eseménye
     */
    constructor(port: number, callback: () => void) {

        this.port = port;

        // Szerver létrehozása.
        var express = require('express');
        var app = express();

        app.get('/:param', function (req, res) {
            res.send('Hello World! ' + req.params.param);
        });

        // Szerver indítása.
        app.listen(port, callback);
    }

    /**
     * Port lekérdezése.
     * 
     * @return port
     */
    public getPort(): number {
        return this.port;
    }
}