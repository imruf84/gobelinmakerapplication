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
     * Átirányítás adott oldalra.
     * 
     * @param res válasz objektum
     * @param path új oldal
     */
    public redirect(res, path: string): void {
        res.write('<script type="text/javascript">document.location="' + path + '"</script>');
    }

    /**
     * Oldal frissítése.
     * 
     * @param res válasz objektum
     */
    public refresh(res): void {
        this.redirect(res, this.getPath());
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

        res.write('<a href="' + this.getParent().getPath() + '">< Vissza</a>');
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
}