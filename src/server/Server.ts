/// <reference path="MainMenuHandler.ts"/>
/// <reference path="MotorControlHandler.ts"/>
/// <reference path="ArmControlHandler.ts"/>

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
     * Szerver alkalmazás.
     */
    private expressApp: any = null;

    /**
     * Konstruktor.
     * 
     * @param port port
     */
    constructor(port: number) {

        this.port = port;

        // Szerver létrehozása.
        var express = require('express');
        var bodyParser = require("body-parser");
        this.expressApp = express();
        this.expressApp.use(bodyParser.urlencoded({extended: false}));
        this.expressApp.use(bodyParser.json());
    }

    /**
     * Port lekérdezése.
     * 
     * @return port
     */
    public getPort(): number {
        return this.port;
    }

    /**
     * Express alkalmazás lekérdezése.
     * 
     * @return express alkalmazás
     */
    public getExpressApp(): any {
        return this.expressApp;
    }

    /**
     * Kezelő regisztrálása.
     * 
     * @param handler kezelő
     */
    public registerHandler(handler: RequestHandler): RequestHandler {
        this.expressApp.get(handler.getPath(), function (req, res) { handler.getHandler(req, res); });
        this.expressApp.post(handler.getPath(), function (req, res) { handler.getHandler(req, res); });
        return handler;
    }

    /**
     * Szerver indítása.
     * 
     * @param callback sikeres indítás eseménye
     */
    public start(callback: () => void): void {
        this.expressApp.listen(this.getPort(), callback);
    }
}