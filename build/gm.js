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
var KeyValuePair = (function () {
    function KeyValuePair(key, value) {
        this.key = key;
        this.value = value;
    }
    return KeyValuePair;
}());
var Map = (function () {
    function Map() {
        this.keyAndValues = [];
    }
    Map.prototype.getKeysOfValue = function (value) {
        var keysToReturn = [];
        var valueToFind = value;
        this.keyAndValues.forEach(function (value, index, array) {
            if (value.value === valueToFind) {
                keysToReturn.push(value.key);
            }
        });
        return keysToReturn;
    };
    Map.prototype.clear = function () {
        this.keyAndValues = [];
    };
    Map.prototype.delete = function (key) {
        var found = false;
        this.keyAndValues.forEach(function (value, index, array) {
            if (found)
                return;
            if (key === value.key) {
                array = array.slice(0, index).concat(array.slice(index + 1));
                found = true;
            }
        });
        return found;
    };
    Map.prototype.forEach = function (callbackfn, thisArg) {
        this.keyAndValues.forEach(function (value, index, array) {
            callbackfn.apply(thisArg, [value.value, value.key, this]);
        }, this);
    };
    Map.prototype.get = function (key) {
        var valueToReturn = undefined;
        this.keyAndValues.forEach(function (value, index, array) {
            if (valueToReturn !== undefined)
                return;
            if (key === value.key) {
                valueToReturn = value.value;
            }
        });
        return valueToReturn;
    };
    Map.prototype.has = function (key) {
        var found = false;
        this.keyAndValues.forEach(function (value, index, array) {
            if (found)
                return;
            if (key === value.key) {
                found = true;
            }
        });
        return found;
    };
    Map.prototype.set = function (key, value) {
        var found = false;
        var valueToSet = value;
        this.keyAndValues.forEach(function (value, index, array) {
            if (found)
                return;
            if (key === value.key) {
                found = true;
                value.value = valueToSet;
            }
        });
        if (!found) {
            this.keyAndValues.push(new KeyValuePair(key, valueToSet));
        }
        return this;
    };
    Object.defineProperty(Map.prototype, "size", {
        get: function () {
            return this.keyAndValues.length;
        },
        enumerable: true,
        configurable: true
    });
    return Map;
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
                        if (!data.toString().startsWith('deviceIDs:'))
                            return;
                        var deviceID = data.toString().replace('deviceIDs:', '');
                        Messages.log('Device(s) found at ' + sp.path + ' with IDs: ' + deviceID);
                        DeviceManager.devices.set(deviceID, new Device(deviceID, sp));
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
                    counter--;
                    if (err) {
                        Messages.error(err);
                        return;
                    }
                    setTimeout(function () {
                        sp.write('getDeviceIDs\n', function (err, res) {
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
    DeviceManager.devices = new Map();
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
    RequestHandler.prototype.redirect = function (res, path) {
        res.write('<script type="text/javascript">document.location="' + path + '"</script>');
    };
    RequestHandler.prototype.refresh = function (res) {
        this.redirect(res, this.getPath());
    };
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
var MotorControlHandler = (function (_super) {
    __extends(MotorControlHandler, _super);
    function MotorControlHandler(parent) {
        _super.call(this, '/motorcontrol', 'Motorvezérlő', parent);
    }
    MotorControlHandler.prototype.handle = function (req, res) {
        if (Utils.keys(req.body).length > 0) {
            this.refresh(res);
            return;
        }
        res.write('<br><br>');
        res.write('<form action="' + this.getPath() + '" method="post">' +
            ' X: <input type="number" name="MOTOR_X" value="0">' +
            ' <br><br><input type="submit" value="Elküld">' +
            '</form>');
    };
    ;
    return MotorControlHandler;
}(RequestHandler));
var Server = (function () {
    function Server(port) {
        this.port = -1;
        this.expressApp = null;
        this.port = port;
        var express = require('express');
        var bodyParser = require("body-parser");
        this.expressApp = express();
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
        this.expressApp.use(bodyParser.json());
    }
    Server.prototype.getPort = function () {
        return this.port;
    };
    Server.prototype.getExpressApp = function () {
        return this.expressApp;
    };
    Server.prototype.registerHandler = function (handler) {
        this.expressApp.get(handler.getPath(), function (req, res) { handler.getHandler(req, res); });
        this.expressApp.post(handler.getPath(), function (req, res) { handler.getHandler(req, res); });
        return handler;
    };
    Server.prototype.start = function (callback) {
        this.expressApp.listen(this.getPort(), callback);
    };
    return Server;
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
        server.registerHandler(new MotorControlHandler(mmh));
        server.start(function () {
            isHttpServerCreated = true;
            Messages.log('HTTP server listening on port ' + server.getPort() + '.');
        });
    }
};
if (isCreateHttpServer && !isConnectToDevices && !isHttpServerCreated)
    createHttpServer();
