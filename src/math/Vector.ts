/**
 * Vektorműveletek osztálya.
 */
class Vector {

    /**
     * Összeg.
     * 
     * @param a első vektor
     * @param b második vektor
     * @return összeg
     */
    public static add(a: number[], b: number[]): number[] {
        return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    }

    /**
     * Különbség.
     * 
     * @param a első vektor
     * @param b második vektor
     * @return különbség
     */
    public static sub(a: number[], b: number[]): number[] {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    }

    /**
     * Skaláris szorzat.
     * 
     * @param a első vektor
     * @param b második vektor
     * @return skaláris szorzat
     */
    public static dot(a: number[], b: number[]): number {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];;
    }

    /**
     * Skalárral való szorzat.
     * 
     * @param a első vektor
     * @param b második vektor
     * @return skalárral való szorzat
     */
    public static mul(a: number[], b: number): number[] {
        return [a[0] * b, a[1] * b, a[2] * b];;
    }

    /**
     * Vektor hossza.
     * 
     * @param a vektor
     * @return hossz
     */
    public static len(a: number[]) {
        return Math.sqrt(Vector.dot(a, a));
    }

    /**
     * Veltor normálása.
     * 
     * @param a vektor
     * @return normált vektor
     */
    public static nor(a: number[]): number[] {
        return Vector.mul(a, 1.0 / Math.sqrt(Vector.dot(a, a)));
    }

    /**
     * Vektorszorzat.
     * 
     * @param a első vektor
     * @param b második vektor
     * @return vektor szorzat
     */
    public static vec(a: number[], b: number[]): number[] {
        return [-a[2] * b[1] + a[1] * b[2], a[2] * b[0] - a[0] * b[2], -a[1] * b[0] + a[0] * b[1]];;
    }

    /**
     * Másolat készítése.
     * 
     * @param a vektor
     * @return másolat
     */
    public static copy(a: number[]): number[] {
        return [a[0], a[1], a[2]];
    }

    /**
     * Hajlásszög.
     * 
     * @param a első vektor
     * @param b második vektor
     * @return hajlásszög
     */
    public static ang(a: number[], b: number[]): number {

        var angle: number = 180.0 / Math.PI * Math.acos(Vector.dot(a, b) / (Vector.len(a) * Vector.len(b)));

        if (Vector.vec(a, b)[2] < .0) angle -= 360;

        return angle;
    }

    /**
     * Interpoláció.
     * 
     * @param a első vektor
     * @param b második vektor
     * @param t paraméter
     * @return interpolált vektor
     */
    public static interpolate(a: number[], b: number[], t: number): number[] {
        return [(1 - t) * a[0] + t * b[0], (1 - t) * a[1] + t * b[1], (1 - t) * a[2] + t * b[2]];
    }

    /**
     * Szög átszámítása lépésekké.
     * @param angle szög
     * @return lépések
     */
    public static toSteps(angle: number): number {
        return Math.floor(angle / 1.8);
    }
}