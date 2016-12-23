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

    protected handle(req, res): void {
        this.writeTitle(req, res);
        this.writeSubHandlersLink(req, res);
    };
}
