/// <reference path="../utils/UniqueIdentifier.ts"/>

/**
 * Eszköz parancs.
 */
class DeviceAction {

    /**
     * Parancs azonosítója.
     */
    private actionID: UniqueIdentifier = new UniqueIdentifier();
    /**
     * Eszköz azonosítója.
     */
    private deviceID: string;
    /**
     * Parancs.
     */
    private action: string;
    /**
     * Paraméterek.
     */
    private params: [any];
    private callback: () => void;

    /**
     * Konstruktor.
     * 
     * @param deviceID eszköz azonosítója
     * @param action parancs
     * @param params paraméterek tömbje
     */
    constructor(deviceID: string, action: string, params: [any], callback: () => void) {
        this.deviceID = deviceID;
        this.action = action;
        this.params = params;
        this.callback = callback;
    }

    /**
     * Eszköz azonosítójának a lekérdezése.
     * 
     * @return eszköz azonosítója
     */
    public getDeviceID(): string {
        return this.deviceID;
    }

    public toString(): string {
        return 'dm:' + this.action + '|' + this.deviceID + (this.params ? '|' + this.params.join('|') : '');
    }
}