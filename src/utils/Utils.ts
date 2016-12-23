/**
 * Segédeszközök.
 */
class Utils {

    /**
     * Objektuk kulcsainak a lekérdezése.
     * 
     * @return objektum kulcsainak tömbje
     */
    public static keys(obj: any): Array<any> {
        var r: Array<any> = new Array<any>();
        for (var k in obj) r.push(k);
        return r;
    }
}