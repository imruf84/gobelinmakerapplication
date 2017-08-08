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
})();
var UniqueIdentifier = (function () {
    function UniqueIdentifier() {
        this.ID = 0;
        this.counter = 0;
        this.ID = Math.round(+new Date() / 1000);
        UniqueIdentifier.lastCounter = (this.ID == UniqueIdentifier.lastUID ? ++UniqueIdentifier.lastCounter : 0);
        this.counter = UniqueIdentifier.lastCounter;
        UniqueIdentifier.lastUID = this.ID;
    }
    ;
    UniqueIdentifier.prototype.equals = function (uid) {
        return this.ID.toString() === uid.toString();
    };
    UniqueIdentifier.prototype.toString = function () {
        return this.ID + '_' + this.counter;
    };
    UniqueIdentifier.lastUID = 0;
    UniqueIdentifier.lastCounter = 0;
    return UniqueIdentifier;
})();
/// <reference path="../utils/UniqueIdentifier.ts"/>
var DeviceAction = (function () {
    function DeviceAction(deviceID, command) {
        this.command = '';
        this.deviceID = deviceID;
        this.command = command;
    }
    DeviceAction.prototype.getDeviceID = function () {
        return this.deviceID;
    };
    DeviceAction.prototype.getCommand = function () {
        return this.command;
    };
    return DeviceAction;
})();
var KeyValuePair = (function () {
    function KeyValuePair(key, value) {
        this.key = key;
        this.value = value;
    }
    return KeyValuePair;
})();
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
        for (var i = this.keyAndValues.length - 1; i >= 0; i--) {
            var kvp = this.keyAndValues[i];
            if (kvp.key === key) {
                found = true;
                this.keyAndValues = this.keyAndValues.slice(0, i).concat(this.keyAndValues.slice(i + 1));
            }
        }
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
})();
var List = (function () {
    function List() {
        this.items = [];
    }
    List.prototype.size = function () {
        return this.items.length;
    };
    List.prototype.append = function (value) {
        this.items.push(value);
    };
    List.prototype.isEmpty = function () {
        return (this.size() == 0);
    };
    List.prototype.get = function (index) {
        return this.items[index];
    };
    List.prototype.remove = function (index) {
        if (index > -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    };
    return List;
})();
/// <reference path="DeviceAction.ts"/>
/// <reference path="DeviceManager.ts"/>
/// <reference path="../utils/Map.ts"/>
/// <reference path="../utils/List.ts"/>
var ActionManager = (function () {
    function ActionManager() {
    }
    ActionManager.storeAction = function (action) {
        this.actions.append(action);
        DeviceManager.doAction(action);
        return action;
    };
    ActionManager.actions = new List();
    return ActionManager;
})();
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
})();
var ReusableCounter = (function () {
    function ReusableCounter() {
    }
    ReusableCounter.generate = function () {
        var key = 1;
        while (ReusableCounter.keys.has(key))
            key++;
        ReusableCounter.keys.set(key, key);
        return key;
    };
    ReusableCounter.delete = function (key) {
        return ReusableCounter.keys.delete(key);
    };
    ReusableCounter.keys = new Map();
    return ReusableCounter;
})();
/// <reference path="Device.ts"/>
/// <reference path="DeviceAction.ts"/>
/// <reference path="ActionManager.ts"/>
/// <reference path="../messages/Messages.ts"/>
/// <reference path="../utils/Map.ts"/>
/// <reference path="../utils/ReusableCounter.ts"/>
var DeviceManager = (function () {
    function DeviceManager() {
    }
    DeviceManager.scanDevices = function (timeout, callback, nofound) {
        var SerialPort = require('serialport');
        Messages.log('Scanning devices...');
        var counter = 0;
        var found = 0;
        setTimeout(function () {
            if (!(found > 0)) {
                nofound();
            }
            else {
                callback();
            }
        }, 5000);
        SerialPort.list(function (err, ports) {
            if (err) {
                Messages.error(err);
                return;
            }
            counter = ports.length;
            ports.forEach(function (port) {
                if (port.comName.startsWith('ttyAMA'))
                    return;
                var sp = new SerialPort(port.comName, {
                    autoOpen: false,
                    baudrate: 9600,
                    parser: SerialPort.parsers.readline('\n')
                });
                sp.on('open', function () {
                    sp.on('data', function (data) {
                        if (!data.toString().startsWith('deviceIDs:'))
                            return;
                        var deviceID = data.toString().replace('deviceIDs:', '');
                        deviceID = deviceID.substring(0, deviceID.length - 1);
                        Messages.log('Device(s) found at ' + sp.path + ' with IDs: ' + deviceID);
                        DeviceManager.storeDeviceByIDs(deviceID.split(';'), new Device(deviceID, sp));
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
                    Messages.log('Opening port ' + sp.path);
                    counter--;
                    if (err) {
                        Messages.error(err);
                        return;
                    }
                    setTimeout(function () {
                        sp.write('getDeviceIDs\n', function (err, res) {
                            if (err) {
                                Messages.error(err);
                                return;
                            }
                        });
                    }, timeout);
                });
            });
        });
    };
    DeviceManager.storeDeviceByIDs = function (IDs, device) {
        for (var key in IDs) {
            var ID = IDs[key];
            ID = ID.replace('\n', '');
            DeviceManager.devices.set(ID, device);
            Messages.log('Device stored with ID: ' + ID);
        }
        device.getSerialPort().on('data', function (data) {
            if (data.startsWith('mFinished')) {
                console.log('m oksi');
            }
            console.log('result: ' + data);
        });
    };
    DeviceManager.getDeviceByID = function (ID) {
        return DeviceManager.devices.get(ID);
    };
    DeviceManager.getDevicesIDs = function () {
        var IDs = [];
        DeviceManager.devices.forEach(function (v, k, m) {
            IDs.push(k);
        });
        return IDs;
    };
    DeviceManager.doAction = function (action) {
        var device = DeviceManager.getDeviceByID(action.getDeviceID());
        if (null == device) {
            Messages.warn('No stored device found with ID: ' + action.getDeviceID());
            return;
        }
        device.getSerialPort().write(action.getCommand() + '\n', function (err, res) {
            if (err) {
                Messages.error(err);
                return;
            }
        });
        console.log('doAction: ' + action.getCommand());
    };
    DeviceManager.devices = new Map();
    return DeviceManager;
})();
var RequestHandler = (function () {
    function RequestHandler(path, title, parent) {
        this.handlers = [];
        this.parent = null;
        this.path = path;
        this.title = title;
        this.setParent(parent);
    }
    RequestHandler.prototype.refresh = function (res) {
        res.redirect(this.getPath());
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
        if (Utils.keys(req.body).length > 0) {
            if (!this.postDataProcess(req, res, req.body)) {
                this.refresh(res);
                return;
            }
        }
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
        res.write('<a href="' + this.getParent().getPath() + '">< Back</a>');
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
    RequestHandler.prototype.postDataProcess = function (req, res, data) { return false; };
    ;
    return RequestHandler;
})();
/// <reference path="RequestHandler.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
})(RequestHandler);
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
})();
/// <reference path="RequestHandler.ts"/>
/// <reference path="../utils/Utils.ts"/>
/// <reference path="../devices/DeviceAction.ts"/>
/// <reference path="../devices/DeviceManager.ts"/>
var MotorControlHandler = (function (_super) {
    __extends(MotorControlHandler, _super);
    function MotorControlHandler(parent) {
        _super.call(this, '/motorcontrol', 'Motor control', parent);
    }
    MotorControlHandler.prototype.postDataProcess = function (req, res, data) {
        // Motorok vezérlése.
        /*for (var key of ['MB', 'MBN']) {
            // Ha van adat az elküldött űrlapon, akkor feldolgozzuk.
            if (data[key]) {
                var value: number = Number(data[key]);
                // Érvénytelen adatokat nem küldünk.
                if (!isNaN(value) && 0 != value) {
                    // Parancs tárolása.
                    //DeviceManager.doAction(
                    ActionManager.storeAction(
                        new DeviceAction(
                            key,
                            ReusableCounter.generate(),
                            'angle',
                            [value],
                            function () {
                                console.log(this.getDeviceID() + ' is finished.');
                            }
                        )
                    );
                }
            }
        }*/
        ActionManager.storeAction(new DeviceAction('ARM1', 'm+123-456'));
        return false;
    };
    ;
    MotorControlHandler.prototype.handle = function (req, res) {
        res.write('<br><br>');
        res.write('<center>' +
            '<form action="' + this.getPath() + '" method="post">' +
            '<table border="0">');
        for (var _i = 0, _a = DeviceManager.getDevicesIDs(); _i < _a.length; _i++) {
            var s = _a[_i];
            res.write(' <tr><td>' + s + ':</td><td><input type="number" name="MB" value="10"></td></tr>');
        }
        res.write(' <tr><td colspan="2" align="center"><br><input type="submit" value="Send"></td></tr>' +
            '</table>' +
            '</form>' +
            '</center>');
    };
    ;
    return MotorControlHandler;
})(RequestHandler);
/// <reference path="RequestHandler.ts"/>
/// <reference path="../utils/Utils.ts"/>
/// <reference path="../devices/DeviceAction.ts"/>
/// <reference path="../devices/DeviceManager.ts"/>
var ArmHandler = (function (_super) {
    __extends(ArmHandler, _super);
    function ArmHandler(parent) {
        _super.call(this, '/armcontrol', 'Arm control', parent);
        this.motorsCount = 3;
    }
    ArmHandler.prototype.postDataProcess = function (req, res, data) {
        // Motorok vezérlése.
        /*for (var key of ['MB', 'MBN']) {
            // Ha van adat az elküldött űrlapon, akkor feldolgozzuk.
            if (data[key]) {
                var value: number = Number(data[key]);
                // Érvénytelen adatokat nem küldünk.
                if (!isNaN(value) && 0 != value) {
                    // Parancs tárolása.
                    //DeviceManager.doAction(
                    ActionManager.storeAction(
                        new DeviceAction(
                            key,
                            ReusableCounter.generate(),
                            'angle',
                            [value],
                            function () {
                                console.log(this.getDeviceID() + ' is finished.');
                            }
                        )
                    );
                }
            }
        }*/
        if (data['m']) {
            ActionManager.storeAction(new DeviceAction('ARM1', 'm+123-456'));
        }
        return false;
    };
    ;
    ArmHandler.prototype.handle = function (req, res) {
        // Megjelenítjük az űrlapokat. 
        for (var _i = 0, _a = DeviceManager.getDevicesIDs(); _i < _a.length; _i++) {
            var deviceID = _a[_i];
            res.write('<br><br>');
            res.write('<center>' +
                deviceID +
                '<form action="' + this.getPath() + '" method="post">' +
                '<table border="1">' +
                ' <thead>' +
                '  <tr>');
            for (var i = 0; i < this.motorsCount; i++) {
                res.write('<th>' + i + '</th>');
            }
            res.write('  </tr>');
            res.write(' </thead>');
            res.write(' <tbody>');
            res.write(' <tr>');
            for (var i = 0; i < this.motorsCount; i++) {
                res.write('<td><input type="input" name="m' + i + '" value="x" size=1></td>');
            }
            res.write(' </tr>');
            res.write(' <tr><td colspan="' + this.motorsCount + '" align="center"><input type="submit" value="Send"></td></tr>' +
                ' </tbody>' +
                '</table>' +
                '</form>' +
                '</center>');
        }
    };
    ;
    return ArmHandler;
})(RequestHandler);
/// <reference path="MainMenuHandler.ts"/>
/// <reference path="MotorControlHandler.ts"/>
/// <reference path="ArmControlHandler.ts"/>
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
})();
/// <reference path="devices/DeviceManager.ts"/>
/// <reference path="server/Server.ts"/>
/// <reference path="utils/Utils.ts"/>
var commandLineArgs = require('command-line-args');
var getUsage = require('command-line-usage');
var optionParts = [
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'server', alias: 's', type: Boolean },
    { name: 'devices', alias: 'd', type: Boolean }
];
var options = commandLineArgs(optionParts);
if (!(Utils.keys(options).length > 0) || options.help) {
    Messages.log(getUsage([{
            header: 'Gobelin maker control application.',
            content: 'Controls the gobelin maker machine..'
        },
        {
            header: 'Options',
            optionList: optionParts
        }
    ]));
    process.exit(1);
}
var isConnectToDevices = options.devices;
var scanDeviceFinished = false;
var isCreateHttpServer = options.server;
var isHttpServerCreated = false;
if (isConnectToDevices) {
    DeviceManager.scanDevices(2000, function () {
        if (scanDeviceFinished)
            return;
        scanDeviceFinished = true;
        Messages.log('Device scanning finished.');
        createHttpServer();
    }, function () {
        if (scanDeviceFinished)
            return;
        scanDeviceFinished = true;
        Messages.warn("No connected devices found.");
        createHttpServer();
    });
}
var createHttpServer = function () {
    if (isCreateHttpServer && !isHttpServerCreated) {
        var server = new Server(3000);
        var mmh = new MainMenuHandler();
        server.registerHandler(mmh);
        server.registerHandler(new MotorControlHandler(mmh));
        server.registerHandler(new ArmHandler(mmh));
        server.start(function () {
            isHttpServerCreated = true;
            Messages.log('HTTP server listening on port ' + server.getPort() + '.');
        });
    }
};
if (isCreateHttpServer && !isConnectToDevices && !isHttpServerCreated)
    createHttpServer();
