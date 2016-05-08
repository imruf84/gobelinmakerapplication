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
var Messages = (function () {
    function Messages() {
    }
    Messages.log = function (msg) {
        console.log(msg);
    };
    Messages.warn = function (msg) {
        console.warn('WARNING: ' + msg);
    };
    Messages.error = function (msg) {
        console.error('ERROR: ' + msg);
    };
    return Messages;
}());
var serialPort = require('serialport');
var SerialPort = require('serialport').SerialPort;
var DeviceManager = (function () {
    function DeviceManager() {
    }
    DeviceManager.scanDevices = function (callback, nofound) {
        Messages.log('Scanning devices...');
        var counter = 0;
        var found = 0;
        setTimeout(function () {
            if (!(found > 0))
                nofound();
        }, 5000);
        serialPort.list(function (err, ports) {
            if (err) {
                Messages.error(err);
                return;
            }
            counter = ports.length;
            ports.forEach(function (port) {
                if (port.comName.startsWith('ttyAMA'))
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
                        Messages.log('Device found at ' + sp.path + ' with ID: ' + deviceID);
                        DeviceManager.addDevice(new Device(deviceID, sp));
                        counter--;
                        found++;
                        if (!(counter > 0))
                            callback();
                    });
                    sp.on('error', function (err) {
                        Messages.error(err);
                        return;
                    });
                });
                sp.open(function (err) {
                    if (err) {
                        Messages.error(err);
                        return;
                    }
                    setTimeout(function () {
                        sp.write('getDeviceID\n', function (err, res) {
                            if (err) {
                                Messages.error('ERROR:' + err);
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
    DeviceManager.getDevicesCount = function () {
        var count = 0;
        for (var key in DeviceManager.getDevicesContainer())
            count++;
        return count;
    };
    DeviceManager.devices = {};
    return DeviceManager;
}());
DeviceManager.scanDevices(function () {
    Messages.log('Device scanning finished.');
}, function () {
    Messages.warn("No connected devices found.");
});
