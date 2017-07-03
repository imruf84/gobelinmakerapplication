/// <reference path="../utils/UniqueIdentifier.ts"/>

/**
 * Eszköz parancs.
 */
class DeviceAction {

    /**
     * Parancs egyedi azonosítója.
     */
    private uid: UniqueIdentifier = new UniqueIdentifier();
    /**
     * Parancs azonosítója.
     */
    private actionID: number;
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
    /**
     * Sikeres végrehajtás eseménye.
     */
    private callback: () => void;
    /**
     * Épp fut a parancs.
     */
    private running: boolean = false;
    /**
     * A parancs lefutott.
     */
    private finished: boolean = false;

    /**
     * Konstruktor.
     * 
     * @param deviceID eszköz azonosítója
     * @param action parancs
     * @param params paraméterek tömbje
     */
    constructor(deviceID: string, actionID: number, action: string, params: [any], callback: () => void) {
        this.deviceID = deviceID;
        this.actionID = actionID;
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

    /**
     * Parancsazonosító lekérdezése.
     * 
     * @return parancsazonosító
     */
    public getActionID(): number {
        return this.actionID;
    }

    /**
     * Egyedi azonosító lekérdezése.
     * 
     * @return egyedi azonosító
     */
    public getUniqueID(): UniqueIdentifier {
        return this.uid;
    }

    /**
     * A parancs fut-e?
     * 
     * @return futás esetén igaz, egyébként hamis
     */
    public isRunning(): boolean {
        return this.running;
    }

    /**
     * A parancs lefutott-e?
     * 
     * @return végzés esetén igaz, egyébként hamis
     */
    public isFinished(): boolean {
        return this.finished;
    }

    /**
     * Parancs elindítása.
     */
    public start(): void {
        this.running = true;
        this.finished = false;
    }

    /**
     * Parancs befejezése.
     */
    public finish(): void {

        if (this.finished) return;

        this.running = false;
        this.finished = true;

        if (null != this.callback) this.callback();
    }

    /**
     * Parancsok összevetése.
     * 
     * @param a Parancsok összehasonlítása.
     * @return ha megegyeznek akkor igaz, egyébként hamis
     */
    public compare(a: DeviceAction): boolean {
        return this.getUniqueID() === a.getUniqueID();
    }

    /**
     * Átalakítás karakterlánccá.
     * 
     * @return karakterlánc
     */
    public toString(): string {
        return 'dm:' 
            + this.action 
            + '|' + this.deviceID 
            + (this.params ? '|' + this.params.join('|') : '') 
            + '$' + this.uid;
    }
}