/// <reference path="Device.ts"/>
/// <reference path="../messages/Messages.ts"/>

declare function require(s: string);

/**
 * Eszközök tárolójának típusa.
 */
interface DevicesContainer {
    [ID: string]: Device;
}

/**
 * Eszközök kezelője.
 */
class DeviceManager {

    /**
     * Eszközök tárolója.
     */
    private static devices: DevicesContainer = {};


    /**
     * Eszközök keresése.
     * 
     * @param callback keresés befejezésének az eseménye
     * @param nofound keresés befejezésének az eseménye
     */
    public static scanDevices(callback: () => void, nofound: () => void) {

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
                        if (!data.toString().startsWith('deviceID:')) return;

                        // Egyébként tároljuk az eszközt.
                        var deviceID = data.toString().replace('deviceID:', '');
                        Messages.log('Device found at ' + sp.path + ' with ID: ' + deviceID);
                        DeviceManager.addDevice(new Device(deviceID, sp));

                        // Csökkentjük a felderítendő eszközök számát.
                        counter--;
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
                    if (err) {
                        Messages.error(err);
                        return;
                    }

                    // Várunk egy kicsit az üzenet küldése előtt (idő kell az eszköznek a bootoláshoz).
                    setTimeout(function () {
                        // Eszköz azonosítójának a lekérdezése.
                        sp.write('getDeviceID\n', function (err, res) {
                            // Hiba esetén kilépünk.
                            if (err) {
                                Messages.error('ERROR:' + err);
                                return;
                            }
                        });
                    }, 2000);
                });

            });
        });
    }

    /**
     * Eszközök tárolójának a lekérdezése.
     * 
     * @return eszközök tárolója
     */
    public static getDevicesContainer(): DevicesContainer {
        return DeviceManager.devices;
    }

    /**
     * Eszköz hozzáadása.
     * 
     * @param device eszköz
     */
    public static addDevice(device: Device) {
        DeviceManager.devices[device.getID()] = device;
    }

    public static getDevicesCount(): number {
        var count: number = 0;
        for (var key in DeviceManager.getDevicesContainer()) count++;

        return count;
    }
}