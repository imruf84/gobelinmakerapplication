/// <reference path="../math/Vector.ts"/>

/**
 * Alapvető geometriai számítások osztálya.
 */
class Geom {

    /**
     * Kör és gömb metszéspontjainak a kiszámítása.
     * 
     * @param cx kör középpontjának első koordinátája
     * @param cy kör középpontjának második koordinátája
     * @param cz kör középpontjának harmadik koordinátája
     * @param cr kör sugara
     * @param cnx kör síkjának a normálvektorának az első koordinátája
     * @param cny kör síkjának a normálvektorának a második koordinátája
     * @param cnz kör síkjának a normálvektorának a harmadik koordinátája
     * @param sx gömb középpontjának első koordinátája
     * @param sy gömb középpontjának második koordinátája
     * @param sz gömb középpontjának harmadik koordinátája
     * @param sr gömb sugara
     * @param vx szöghöz tartozó referencia vektor első koordinátája
     * @param vy szöghöz tartozó referencia vektor második koordinátája
     * @param vz szöghöz tartozó referencia vektor harmadik koordinátája
     * @return szög
     */
    public static circleSphereIntersection(cx: number, cy: number, cz: number, cr: number, cnx: number, cny: number, cnz: number, sx: number, sy: number, sz: number, sr: number, vx: number, vy: number, vz: number): number {

        // kör középpontja
        var cc: number[] = [cx, cy, cz];
        // kör síkjának normálvektora
        var cn: number[] = [cnx, cny, cnz];
        // normalizálás
        cn = Vector.nor(cn);
        // gömb középpontja
        var sc: number[] = [sx, sy, sz];

        // gömb középpontjából a kör középpontjába mutató vektor vetítése a kör síkjára
        var pv: number[] = Vector.sub(Vector.sub(sc, cc), Vector.mul(cn, (Vector.dot(Vector.sub(sc, cc), cn) / Vector.dot(cn, cn))));
        // a kör és a gömb középpontjainak a távolsága a kör síkjában
        var d: number = Vector.len(pv);

        // metszéskör sugarának a meghatározása
        var r: number = Math.sqrt(sr * sr - Vector.dot(Vector.sub(pv, Vector.sub(sc, cc)), Vector.sub(pv, Vector.sub(sc, cc))));

        // metszéskör középpontjának a meghatározása
        var c: number[] = Vector.add(cc, pv);

        // a kör sugarának vetülete a kör és a metszéskör középpontjait összekötő szakaszra
        var cd: number = .5 * (cr * cr + d * d - r * r) / d;

        // a kör és a metszéskör középpontjait összekötő szakasz és a metszéspontokat összekötő szakasz metszéspontja
        var F: number[] = Vector.add(cc, Vector.mul(Vector.nor(pv), cd));

        // kör és metszetkör metszéspontjainak a távolságának a felének a meghatározása
        var h: number = Math.sqrt(cr * cr - cd * cd);

        // kör és gömb metszéspontjainak a meghatározása a kör és metszéskör középpontjait összekötő vektor 90 fokkal 
        //  való elforgatásával a metszéskör síkjának normálvektora körül normalizálva majd megszorozva a megfelelő hosszúsággal
        var M: number[] = Vector.add(F, Vector.mul(Vector.nor(Vector.add(Vector.vec(cn, pv), Vector.mul(cn, Vector.dot(cn, pv)))), h));


        // elforgatás szögének a meghatározása egy referencia vektorhoz képest
        var v1: number[] = [vx, vy, vz];
        var v2: number[] = Vector.sub(M, cc);
        var angle: number = Vector.ang(v1, v2);

        return angle;
    }

    /**
     * Adott kar szögének meghatározása.
     * 
     * @param x0 kezdőpont első koordinátája
     * @param y0 kezdőpont második koordinátája
     * @param z0 kezdőpont harmadik koordinátája
     * @param x1 végpont első koordinátája
     * @param y1 végpont második koordinátája
     * @param z1 végpont harmadik koordinátája
     * @param dm motorok távolsága
     * @param lm motor karjának a hossza
     * @param le végpont karjának a hossza
     * @param la kar hossza
     * @param nx motor karjának a síkjának a normálvektorának az első koordinátája
     * @param ny motor karjának a síkjának a normálvektorának a második koordinátája
     * @param nz motor karjának a síkjának a normálvektorának a harmadik koordinátája
     * @param ux 
     * @param uy 
     * @param uz 
     * @param t 
     * @return szög
     */
    public static calcAngle(
        x0: number, y0: number, z0: number,
        x1: number, y1: number, z1: number,
        dm: number, lm: number, le: number, la: number,
        nx: number, ny: number, nz: number,
        ux: number, uy: number, uz: number,
        t: number):number {

        var ex: number = (1 - t) * x0 + t * x1;
        var ey: number = (1 - t) * y0 + t * y1;
        var ez: number = (1 - t) * z0 + t * z1;

        return Geom.circleSphereIntersection(ux * dm / 2., uy * dm / 2., uz * dm / 2., lm, nx, ny, nz, ex + ux * le / 2., ey + uy * le / 2., ez + uz * le / 2., la, ux, uy, uz);
    }
}