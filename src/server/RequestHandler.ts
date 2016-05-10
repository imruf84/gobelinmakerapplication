/**
 * Kliens felől érkező kérés kezelője.
 */
class RequestHandler {
    
    /**
     * Kezelők tárolója.
     */
    private handlers:Array<RequestHandler> = [];
    /**
     * Szülő.
     */
    private parent:RequestHandler = null;
    /**
     * Útvonal.
     */
    private path:string;
    
    
    /**
     * Konstruktor.
     * 
     * @param path elérési út
     */
    constructor(path:string) {
        this.path = path;
    }
    
    /**
     * Kezelő hozzáadása.
     * 
     * @param rh kezelő
     */
    public addHandler(rh:RequestHandler):void {
        this.handlers.push(rh);
        rh.setParent(this);
    }
    
    /**
     * Szülő megadása.
     * 
     * @param p szülő
     */
    public setParent(p:RequestHandler):void {
        this.parent = p;
    }
    
    /**
     * Útvonal lekérdezése.
     * 
     * @return útvonal
     */
    public getPath():string {
        return this.path;
    }
    
    /**
     * Kezelő függvény lekérdezése.
     * 
     * @param req kérés
     * @param res válasz
     */
    public getHandler(req, res):void {
        
    }
}