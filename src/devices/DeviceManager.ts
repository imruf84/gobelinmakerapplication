/// <reference path="Device.ts"/>
/// <reference path="DeviceAction.ts"/>
/// <reference path="../messages/Messages.ts"/>
/// <reference path="../utils/Collections.ts"/>
/// <reference path="../utils/ReusableCounter.ts"/>

declare function require(s: string);


/**
 * Eszközök kezelője.
 */
class DeviceManager {

    /**
     * Eszközök tárolója.
     */
    private static devices: Map<string, Device> = new Map<string, Device>();
    /**
     * Kiadott parancsok tárolója.
     */
    private static startedActions: Map<number, Device> = new Map<number, Device>();

    /**
     * Eszközök keresése.
     * 
     * @param timeout várakozási idő
     * @param callback keresés befejezésének az eseménye
     * @param nofound keresés befejezésének az eseménye
     */
    public static scanDevices(timeout: number, callback: () => void, nofound: () => void) {

        var serialPort = require('serialport');
        var SerialPort = require('serialport').SerialPort;

        Messages.log('Scanning devices...');
        var counter: number = 0;
        var found: number = 0;

        // Ha adott idő után sem találunk eszközt, akkor jelezzük.
        setTimeout(function () {
            if (!(found > 0)) nofound();
        }, 5000);

        // Portok listázása.
        serialPort.list(function (err, ports) {
            // Hiba esetén kilépünk.
            if (err) {
                Messages.error(err);
                return;
            }

            // Számláló deklarálása.
            counter = ports.length;
console.log(counter);

            // Végigmegyünk a portokon.
            ports.forEach(function (port) {

                // HACK: linux alatt hibát generál, ami nem okoz gondot csak kényelmetlen.
                if (port.comName.startsWith('ttyAMA')) return;

                // Port létrehozása.
                var sp = new SerialPort(port.comName, {
                    baudrate: 9600,
                    parser: serialPort.parsers.readline('\n')
                }, false);

                // Események deklarálása.
                sp.on('open', function () {

                    sp.on('data', function (data) {
                        
                        // Ha az üzenet nem eszközazonosító, akkor kilépünk.
                        if (!data.toString().startsWith('deviceIDs:')) return;

                        // Egyébként tároljuk az eszközt.
                        var deviceID = data.toString().replace('deviceIDs:', '');
                        // HACK: valamiért egy extra karaktert is kapunk a szöveg végén, amire nincs szükségünk ezért levágjuk
                        deviceID = deviceID.substring(0, deviceID.length - 1); 
                        Messages.log('Device(s) found at ' + sp.path + ' with IDs: ' + deviceID);
                        DeviceManager.storeDeviceByIDs(deviceID.split(';'), new Device(deviceID, sp));

                        // Megtalált eszközök számának a növelése.
                        found++;

                        // Ha nincs több felderítendő eszköz akkor eseménnyel jelezzük.
                        if (!(counter > 0)) callback();
                    });

                    sp.on('error', function (err) {
                        Messages.error(err);
                        return;
                    });
                });

                // Port megnyitása.
                sp.open(function (err) {

                    // Csökkentjük a felderítendő eszközök számát.
                    counter--;
                    console.log(counter);

                    if (err) {
                        Messages.error(err);
                        return;
                    }

                    // Várunk egy kicsit az üzenet küldése előtt (idő kell az eszköznek a bootoláshoz).
                    setTimeout(function () {
                        // Eszköz azonosítójának a lekérdezése.
                        sp.write('getDeviceIDs\n', function (err, res) {
                            // Hiba esetén kilépünk.
                            if (err) {
                                Messages.error(err);
                                return;
                            }
                        });
                    }, timeout);
                });

            });
        });
    }

    /**
     * Eszközök tárolása különböző azonosítók szerint.
     * 
     * @param IDs azonosítók tömbje
     * @param device eszköz
     */
    private static storeDeviceByIDs(IDs: [string], device: Device): void {
        for (var key in IDs) {
            var ID: string = IDs[key];
            ID = ID.replace('\n', '');
            DeviceManager.devices.set(ID, device);
            Messages.log('Device stored with ID: ' + ID);
        }

        // Beállítjuk a későbbi munkához szükséges eseményt.
        device.getSerialPort().on('data', function (data) {
            console.log('result: ' + data);
        });
    }

    /**
     * Eszköz lekérdezése azonosító alapján.
     * 
     * @param ID azonosító
     */
    public static getDeviceByID(ID: string): Device {
        return DeviceManager.devices.get(ID);
    }

    /**
     * Parancs végrehajtása.
     * 
     * @param action parancs
     */
    public static doAction(action: DeviceAction): void {

        var device: Device = DeviceManager.getDeviceByID(action.getDeviceID());
        if (null == device) 
        {
            Messages.warn('No stored device found with ID: ' + action.getDeviceID());
            return;
        }

        var actionStr: string = action.toString() + '$' + ReusableCounter.generate() + '\n';

        device.getSerialPort().write(
            actionStr,
            function (err, res) {
                // Hiba esetén kilépünk.
                if (err) {
                    Messages.error(err);
                    return;
                }
            });

        console.log('doAction: ' + Date.now() + " " + actionStr.replace('\n', ''));
    }
}