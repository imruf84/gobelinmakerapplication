/// <reference path="../utils/UniqueIdentifier.ts"/>

/**
 * Eszköz parancs.
 */
class DeviceAction {

    private deviceID: string;
    private command: string = '';

    constructor(deviceID: string, command: string) {
        this.deviceID = deviceID;
        this.command = command;
    }

    public getDeviceID(): string {
        return this.deviceID;
    }

    public getCommand(): string {
        return this.command;
    }
}