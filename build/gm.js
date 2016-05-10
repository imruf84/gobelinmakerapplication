var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var RequestHandler = (function () {
    function RequestHandler(path, title, parent) {
        this.handlers = [];
        this.parent = null;
        this.path = path;
        this.title = title;
        this.setParent(parent);
    }
    RequestHandler.prototype.addHandler = function (rh) {
        this.handlers.push(rh);
    };
    RequestHandler.prototype.setParent = function (p) {
        this.parent = p;
        if (p)
            p.addHandler(this);
    };
    RequestHandler.prototype.getParent = function () {
        return this.parent;
    };
    RequestHandler.prototype.getPath = function () {
        return this.path;
    };
    RequestHandler.prototype.getTitle = function () {
        return this.title;
    };
    RequestHandler.prototype.getHandler = function (req, res) {
        this.writeBeforeHandle(req, res);
        this.handle(req, res);
        this.writeAfterHandle(req, res);
    };
    RequestHandler.prototype.writeBeforeHandle = function (req, res) {
        res.set({ 'Content-Type': 'text/html' });
        res.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><STYLE type="text/css">a {color:blue;text-decoration: underline;font-weight: bold;}</STYLE><title>' + this.getTitle() + '</title></head>');
        res.write('<body style="font-family: Arial">');
        this.writeBackLink(req, res);
    };
    RequestHandler.prototype.writeAfterHandle = function (req, res) {
        res.write('</body></html>');
        res.end();
    };
    RequestHandler.prototype.writeBackLink = function (req, res) {
        if (!this.getParent())
            return;
        res.write('<a href="' + this.getParent().getPath() + '">< Vissza</a>');
    };
    RequestHandler.prototype.writeTitle = function (req, res) {
        res.write('<center><h1>' + this.getTitle() + '</h1></center><br>');
    };
    RequestHandler.prototype.writeLink = function (req, res) {
        res.write('<a href="' + this.getPath() + '">' + this.getTitle() + '</a>');
    };
    RequestHandler.prototype.writeSubHandlersLink = function (req, res) {
        res.write('<center>');
        for (var rh in this.handlers) {
            this.handlers[rh].writeLink(req, res);
            res.write('<br><br>');
        }
        res.write('</center>');
    };
    RequestHandler.prototype.handle = function (req, res) { };
    ;
    return RequestHandler;
}());
var MainMenuHandler = (function (_super) {
    __extends(MainMenuHandler, _super);
    function MainMenuHandler() {
        _super.call(this, '/', 'GOBELIN MAKER', null);
    }
    MainMenuHandler.prototype.handle = function (req, res) {
        this.writeTitle(req, res);
        this.writeSubHandlersLink(req, res);
    };
    ;
    return MainMenuHandler;
}(RequestHandler));
var Server = (function () {
    function Server(port) {
        this.port = -1;
        this.expressApp = null;
        this.port = port;
        var express = require('express');
        this.expressApp = express();
    }
    Server.prototype.getPort = function () {
        return this.port;
    };
    Server.prototype.getExpressApp = function () {
        return this.expressApp;
    };
    Server.prototype.registerHandler = function (handler) {
        this.expressApp.get(handler.getPath(), function (req, res) { handler.getHandler(req, res); });
    };
    Server.prototype.start = function (callback) {
        this.expressApp.listen(this.getPort(), callback);
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
        var server = new Server(3000);
        var mmh = new MainMenuHandler();
        server.registerHandler(mmh);
        server.registerHandler(new RequestHandler('/m1', 'Teszt menü 1', mmh));
        server.registerHandler(new RequestHandler('/m2', 'Teszt menü 2', mmh));
        server.registerHandler(new RequestHandler('/m3', 'Teszt menü 3', mmh));
        server.start(function () {
            isHttpServerCreated = true;
            Messages.log('HTTP server listening on port ' + server.getPort() + '.');
        });
    }
};
if (isCreateHttpServer && !isConnectToDevices && !isHttpServerCreated)
    createHttpServer();
