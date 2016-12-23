/**
 * Eszköz.
 */
class Device {

    /**
     * Azonosító.
     */
    private ID: string;
    /**
     * Soros port objektum.
     */
    private serial: any;

    /**
     * Konstruktor.
     * 
     * @param ID azonosító
     * @param portName port neve
     * @param serial soros port objektum
     */
    constructor(ID: string, serial: any) {
        this.ID = ID;
        this.serial = serial;
    }

    /**
     * Azonosító lekérdezése.
     * 
     * @return azonosító 
     */
    public getID(): string {
        return this.ID;
    }

    /**
     * Port nevének a lekérdezése.
     * 
     * @return port neve
     */
    public getPortName(): string {
        return this.getSerialPort().path;
    }
    /**
     * Soros port objektum lekérdezése.
     * 
     * @return soros port
     */
    public getSerialPort(): any {
        return this.serial;
    }

    public toString(): string {
        return 'Device[ID: ' + this.getID() + ', portName: ' + this.getPortName() + ']';
    }
}