/**
 * Újrafelhasználható kulcsú számláló.
 */
class ReusableCounter {

    /**
     * Használatban lévő kulcsok tárolója.
     */
    private static keys:Map<number, number> = new Map<number, number>();

    /**
     * Új kulcs generálása.
     * 
     * @return új kulcs
     */
    public static generate(): number {
        var key: number = 1;
        while (ReusableCounter.keys.has(key)) key++;

        ReusableCounter.keys.set(key, key);

        return key;
    }

    public static delete(key: number): boolean {

        return ReusableCounter.keys.delete(key);
    }
}