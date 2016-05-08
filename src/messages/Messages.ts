/**
 * Üzenetek.
 */
class Messages {
    
    /**
     * Szöveg kiírása.
     * 
     * @param msg szöveg
     */
    public static log(msg:string) {
        console.log(msg);
    }
    
    /**
     * Figyelmeztetés kiírása.
     * 
     * @param msg szöveg
     */
    public static warn(msg:string) {
        console.warn('WARNING: ' + msg);
    }
    
    /**
     * Hiba kiírása.
     * 
     * @param msg szöveg
     */
    public static error(msg:string) {
        console.error('ERROR: ' + msg);
    }
}