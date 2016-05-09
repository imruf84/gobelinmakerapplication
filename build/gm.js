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
var DeviceManager = (function () {
    function DeviceManager() {
    }
    DeviceManager.scanDevices = function (callback, nofound) {
        var serialPort = require('serialport');
        var SerialPort = require('serialport').SerialPort;
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
var Server = (function () {
    function Server(port, callback) {
        this.port = -1;
        this.port = port;
        var express = require('express');
        var app = express();
        app.get('/:param', function (req, res) {
            res.send('Hello World! ' + req.params.param);
        });
        app.listen(port, callback);
    }
    Server.prototype.getPort = function () {
        return this.port;
    };
    return Server;
}());
var Utils = (function () {
    function Utils() {
    }
    Utils.keys = function (obj) {
        var r = new Array();
        for (var k in obj)
            r.push(k);
        return r;
    };
    return Utils;
}());
var commandLineArgs = require('command-line-args');
var cli = commandLineArgs([
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'server', alias: 's', type: Boolean },
    { name: 'devices', alias: 'd', type: Boolean }
]);
var options = cli.parse(process.argv);
if (!(Utils.keys(options).length > 0) || options.help) {
    Messages.log(cli.getUsage());
    process.exit(1);
}
var isConnectToDevices = options.devices;
var isCreateHttpServer = options.server;
var isHttpServerCreated = false;
if (isConnectToDevices) {
    DeviceManager.scanDevices(function () {
        Messages.log('Device scanning finished.');
        createHttpServer();
    }, function () {
        Messages.warn("No connected devices found.");
        createHttpServer();
    });
}
var createHttpServer = function () {
    if (isCreateHttpServer) {
        var server = new Server(3000, function () {
            isHttpServerCreated = true;
            Messages.log('HTTP server listening on port ' + server.getPort() + '.');
        });
    }
};
if (isCreateHttpServer && !isConnectToDevices && !isHttpServerCreated)
    createHttpServer();
