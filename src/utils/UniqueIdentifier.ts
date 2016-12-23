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


    constructor() {

        // Azonosító előállítása az aktuális dátumból.
        var d: Date = new Date(Date.now());
        this.ID = parseInt(UniqueIdentifier.removeUnnecessaryChars(d.toISOString()));

        UniqueIdentifier.lastCounter = (this.ID == UniqueIdentifier.lastUID ? ++UniqueIdentifier.lastCounter : 0);
        this.counter = UniqueIdentifier.lastCounter;

        UniqueIdentifier.lastUID = this.ID; 
    }

    /**
     * Felesleges karakterek eltávolítása a dátumból.
     */
    private static removeUnnecessaryChars(s: string) :string {
        var ls: string = s.split('-').join('').split('T').join('').split(':').join('');

        return ls.substring(0, ls.indexOf('.'));
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

    public toString(): string {
        return this.ID + '_' + this.counter;
    }
}