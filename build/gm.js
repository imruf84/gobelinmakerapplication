var Device = (function () {
    function Device(ID, serial) {
        this.ID = ID;
        this.serial = serial;
    }
    Device.prototype.getID = function () {
        return this.ID;
    };
    Device.prototype.getPortName = function () {
        return this.getSerialPort().path;
    };
    Device.prototype.getSerialPort = function () {
        return this.serial;
    };
    Device.prototype.toString = function () {
        return 'Device[ID: ' + this.getID() + ', portName: ' + this.getPortName() + ']';
    };
    return Device;
}());
var serialPort = require('serialport');
var SerialPort = require('serialport').SerialPort;
var DeviceManager = (function () {
    function DeviceManager() {
    }
    DeviceManager.scanDevices = function (callback) {
        console.log('Scanning devices...');
        var counter = 0;
        serialPort.list(function (err, ports) {
            if (err) {
                console.error(err);
                return;
            }
            counter = ports.length;
            ports.forEach(function (port) {
                if (port.comName == "ttyAMA0")
                    return;
                var sp = new SerialPort(port.comName, {
                    baudrate: 9600,
                    parser: serialPort.parsers.readline('\n')
                }, false);
                sp.on('open', function () {
                    sp.on('data', function (data) {
                        if (!data.toString().startsWith('deviceID:'))
                            return;
                        var deviceID = data.toString().replace('deviceID:', '');
                        console.log('Device found at ' + sp.path + ' with ID: ' + deviceID);
                        DeviceManager.addDevice(new Device(deviceID, sp));
                        counter--;
                        if (!(counter > 0))
                            callback();
                    });
                    sp.on('error', function (err) {
                        console.error(err);
                        return;
                    });
                });
                sp.open(function (err) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    setTimeout(function () {
                        sp.write('getDeviceID\n', function (err, res) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        });
                    }, 2000);
                });
            });
        });
    };
    DeviceManager.getDevicesContainer = function () {
        return DeviceManager.devices;
    };
    DeviceManager.addDevice = function (device) {
        DeviceManager.devices[device.getID()] = device;
    };
    DeviceManager.devices = {};
    return DeviceManager;
}());
DeviceManager.scanDevices(function () {
    console.log('Device scanning finished.');
});
