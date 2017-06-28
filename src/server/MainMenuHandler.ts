/// <reference path="RequestHandler.ts"/>

/**
 * Főmenü kezelője.
 */
class MainMenuHandler extends RequestHandler {

    /**
     * Konstruktor.
     */
    constructor() {
        super('/', 'GOBELIN MAKER', null);
    }

    /**
     * Kérés kezelése.
     * 
     * @param req kérés
     * @param res válasz
     */
    protected handle(req, res): void {
        this.writeTitle(req, res);
        this.writeSubHandlersLink(req, res);
    };
}
