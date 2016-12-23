/**
 * Kliens felől érkező kérés kezelője.
 */
class RequestHandler {

    /**
     * Kezelők tárolója.
     */
    private handlers: Array<RequestHandler> = [];
    /**
     * Szülő.
     */
    private parent: RequestHandler = null;
    /**
     * Útvonal.
     */
    private path: string;
    /**
     * Név.
     */
    private title: string;


    /**
     * Konstruktor.
     * 
     * @param path elérési út
     * @param title cím
     * @param parent szülő
     */
    constructor(path: string, title: string, parent: RequestHandler) {
        this.path = path;
        this.title = title;
        this.setParent(parent);
    }

    /**
     * Oldal frissítése.
     * 
     * @param res válasz objektum
     */
    public refresh(res): void {
        res.redirect(this.getPath());
    }

    /**
     * Kezelő hozzáadása.
     * 
     * @param rh kezelő
     */
    protected addHandler(rh: RequestHandler): void {
        this.handlers.push(rh);
    }

    /**
     * Szülő megadása.
     * 
     * @param p szülő
     */
    protected setParent(p: RequestHandler): void {
        this.parent = p;
        if (p) p.addHandler(this);
    }

    /**
     * Szülő lekérdezése.
     * 
     * @return szülő
     */
    public getParent(): RequestHandler {
        return this.parent;

    }

    /**
     * Útvonal lekérdezése.
     * 
     * @return útvonal
     */
    public getPath(): string {
        return this.path;
    }

    /**
     * Cím lekérdezése.
     * 
     * @return cím
     */
    public getTitle(): string {
        return this.title;
    }

    /**
     * Kezelő függvény lekérdezése.
     * 
     * @param req kérés
     * @param res válasz
     */
    public getHandler(req, res): void {
        
        // Ha vannak paraméterek, akkor végrehajtjuk az adatok feldolgozását.
        if (Utils.keys(req.body).length > 0) {
            
            // ...majd frissítjük az oldalt (hogy minden post adat eltűnjön).
            // HACK: - ez azért kell, hogy az oldal bármikor frissíthető legyen a 'biztosan elhagyja az oldalt' figyelmeztetés nélkül
            if (!this.postDataProcess(req, res, req.body)) {
                this.refresh(res);
                return;
            }
        }

        // Kérés normál kiszolgálása.
        this.writeBeforeHandle(req, res);
        this.handle(req, res);
        this.writeAfterHandle(req, res);
    }

    /**
     * Kiszolgálás előtti alap dolgok küldése.
     * 
     * @param req kérés
     * @param res válasz
     */
    protected writeBeforeHandle(req, res): void {
        res.set({ 'Content-Type': 'text/html' });
        res.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><STYLE type="text/css">a {color:blue;text-decoration: underline;font-weight: bold;}</STYLE><title>' + this.getTitle() + '</title></head>');
        res.write('<body style="font-family: Arial">');
        this.writeBackLink(req, res);
    }

    /**
     * Kiszolgálás utáni alap dolgok küldése.
     * 
     * @param req kérés
     * @param res válasz
     */
    protected writeAfterHandle(req, res): void {
        res.write('</body></html>');
        res.end();
    }

    /**
     * Vissza link létrehozása.
     * 
     * @param req kérés
     * @param res válasz
     */
    protected writeBackLink(req, res): void {
        if (!this.getParent()) return;

        res.write('<a href="' + this.getParent().getPath() + '">< Back</a>');
    }

    /**
     * Név kiírása.
     * 
     * @param req kérés
     * @param res válasz
     */
    protected writeTitle(req, res): void {
        res.write('<center><h1>' + this.getTitle() + '</h1></center><br>');
    }

    /**
     * Link írása.
     * 
     * @param req kérés
     * @param res válasz
     */
    protected writeLink(req, res): void {
        res.write('<a href="' + this.getPath() + '">' + this.getTitle() + '</a>');
    }

    /**
     * Almenü linkek írása.
     * 
     * @param req kérés
     * @param res válasz
     */
    protected writeSubHandlersLink(req, res): void {
        res.write('<center>');
        for (var rh in this.handlers) {
            this.handlers[rh].writeLink(req, res);
            res.write('<br><br>');
        }
        res.write('</center>');
    }

    /**
     * Kezelő eseménye. Ezt kell felülírni a származtatott osztályokban.
     * 
     * @param req kérés
     * @param res válasz
     */
    protected handle(req, res): void { };

    /**
     * Kiszolgálás előtti lehetőség POST adatok feldolgozására.
     * 
     * @param req kérés
     * @param res válasz
     * @param data adatok
     * @return igaz esetén lefut a kérés további kiszolgálása, hamis esetén nem
     */
    protected postDataProcess(req, res, data): boolean {return false;};
}