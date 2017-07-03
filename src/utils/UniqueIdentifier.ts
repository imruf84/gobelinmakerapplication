/**
 * Egyedi azonosító.
 */
class UniqueIdentifier {
    /**
     * Azonosító.
     */
    private ID: number = 0;;
    /**
     * Számláló.
     */
    private counter: number = 0;
    /**
     * Legutóbbi azonosító.
     */
    private static lastUID: number = 0;
    /**
     * Legutóbbi számláló.
     */
    private static lastCounter: number = 0;

    /**
     * Konstruktor.
     */
    constructor() {

        // Azonosító előállítása az aktuális dátumból (unix timestamp).
        this.ID = Math.round(+new Date()/1000);

        // Ha létezik már ilyen, akkor léptetjük.
        UniqueIdentifier.lastCounter = (this.ID == UniqueIdentifier.lastUID ? ++UniqueIdentifier.lastCounter : 0);
        this.counter = UniqueIdentifier.lastCounter;

        UniqueIdentifier.lastUID = this.ID; 
    }

    /**
     * Azonosítók egyezésének a tesztelése.
     * 
     * @param uid másik azonosító
     * @return egyezés esetén igaz egyébként hamis
     */
    public equals(uid: UniqueIdentifier): boolean {
        return this.ID.toString() === uid.toString();
    }

    /**
     * Átalakítás karakterlánccá.
     * 
     * @return karakterlánc
     */
    public toString(): string {
        return this.ID + '_' + this.counter;
    }
}