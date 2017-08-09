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
                res.write('<td><input type="input" name="m' + i + '" value="+" size=1></td>');
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
var Vector = (function () {
    function Vector() {
    }
    Vector.add = function (a, b) {
        return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    };
    Vector.sub = function (a, b) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    };
    Vector.dot = function (a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        ;
    };
    Vector.mul = function (a, b) {
        return [a[0] * b, a[1] * b, a[2] * b];
        ;
    };
    Vector.len = function (a) {
        return Math.sqrt(Vector.dot(a, a));
    };
    Vector.nor = function (a) {
        return Vector.mul(a, 1.0 / Math.sqrt(Vector.dot(a, a)));
    };
    Vector.vec = function (a, b) {
        return [-a[2] * b[1] + a[1] * b[2], a[2] * b[0] - a[0] * b[2], -a[1] * b[0] + a[0] * b[1]];
        ;
    };
    Vector.copy = function (a) {
        return [a[0], a[1], a[2]];
    };
    Vector.ang = function (a, b) {
        var angle = 180.0 / Math.PI * Math.acos(Vector.dot(a, b) / (Vector.len(a) * Vector.len(b)));
        if (Vector.vec(a, b)[2] < .0)
            angle -= 360;
        return angle;
    };
    Vector.interpolate = function (a, b, t) {
        return [(1 - t) * a[0] + t * b[0], (1 - t) * a[1] + t * b[1], (1 - t) * a[2] + t * b[2]];
    };
    Vector.toSteps = function (angle) {
        return Math.floor(angle / 1.8);
    };
    return Vector;
})();
/// <reference path="../math/Vector.ts"/>
var Geom = (function () {
    function Geom() {
    }
    Geom.circleSphereIntersection = function (cx, cy, cz, cr, cnx, cny, cnz, sx, sy, sz, sr, vx, vy, vz) {
        var cc = [cx, cy, cz];
        var cn = [cnx, cny, cnz];
        cn = Vector.nor(cn);
        var sc = [sx, sy, sz];
        var pv = Vector.sub(Vector.sub(sc, cc), Vector.mul(cn, (Vector.dot(Vector.sub(sc, cc), cn) / Vector.dot(cn, cn))));
        var d = Vector.len(pv);
        var r = Math.sqrt(sr * sr - Vector.dot(Vector.sub(pv, Vector.sub(sc, cc)), Vector.sub(pv, Vector.sub(sc, cc))));
        var c = Vector.add(cc, pv);
        var cd = .5 * (cr * cr + d * d - r * r) / d;
        var F = Vector.add(cc, Vector.mul(Vector.nor(pv), cd));
        var h = Math.sqrt(cr * cr - cd * cd);
        var M = Vector.add(F, Vector.mul(Vector.nor(Vector.add(Vector.vec(cn, pv), Vector.mul(cn, Vector.dot(cn, pv)))), h));
        var v1 = [vx, vy, vz];
        var v2 = Vector.sub(M, cc);
        var angle = Vector.ang(v1, v2);
        return angle;
    };
    Geom.calcAngle = function (x0, y0, z0, x1, y1, z1, dm, lm, le, la, nx, ny, nz, ux, uy, uz, t) {
        var ex = (1 - t) * x0 + t * x1;
        var ey = (1 - t) * y0 + t * y1;
        var ez = (1 - t) * z0 + t * z1;
        return Geom.circleSphereIntersection(ux * dm / 2., uy * dm / 2., uz * dm / 2., lm, nx, ny, nz, ex + ux * le / 2., ey + uy * le / 2., ez + uz * le / 2., la, ux, uy, uz);
    };
    return Geom;
})();
/// <reference path="../math/Geom.ts"/>
var DeltaRobot = (function () {
    function DeltaRobot() {
        var x0 = .5;
        var y0 = -1.;
        var z0 = 3;
        var x1 = 1.5;
        var y1 = 1.;
        var z1 = 1;
        var dm = 5.;
        var lm = 2.;
        var le = 1.;
        var la = 3.;
        var prevSteps = [0, 0, 0, 0];
        for (var t = .0; t < 1.; t += .0001) {
            var angles = [
                Geom.calcAngle(x0, y0, z0, x1, y1, z1, dm, lm, le, la, 0, 1, 0, 1, 0, 0, t),
                Geom.calcAngle(x0, y0, z0, x1, y1, z1, dm, lm, le, la, -1, 0, 0, 0, 1, 0, t),
                Geom.calcAngle(x0, y0, z0, x1, y1, z1, dm, lm, le, la, 0, -1, 0, -1, 0, 0, t),
                Geom.calcAngle(x0, y0, z0, x1, y1, z1, dm, lm, le, la, 1, 0, 0, 0, -1, 0, t)
            ];
            var control = "";
            var hasControl = false;
            for (var i = 0; i < 4; i++) {
                if (isNaN(angles[i])) {
                    Messages.error("NaN detected!");
                    return;
                }
                var step = Vector.toSteps(angles[i]);
                if (step != prevSteps[i]) {
                    if (t > .0) {
                        control += "[" + (i + 1) + ":" + (step - prevSteps[i]) + "]";
                        hasControl = true;
                    }
                    prevSteps[i] = step;
                }
            }
            if (hasControl) {
                Messages.log(t + ":" + control);
            }
        }
    }
    return DeltaRobot;
})();
/// <reference path="devices/DeviceManager.ts"/>
/// <reference path="server/Server.ts"/>
/// <reference path="utils/Utils.ts"/>
/// <reference path="robot/DeltaRobot.ts"/>
var r = new DeltaRobot();
process.exit(1);
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
