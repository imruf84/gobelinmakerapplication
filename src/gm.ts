/// <reference path="devices/DeviceManager.ts"/>
/// <reference path="server/Server.ts"/>
/// <reference path="utils/Utils.ts"/>

declare var process;

// Parancssori argumentumok lekérdezése.
var commandLineArgs = require('command-line-args');
var getUsage = require('command-line-usage')

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

// Csatlakozás eszközökhöz.
var isConnectToDevices: boolean = options.devices;
// HTTP szerver indítása.
var isCreateHttpServer: boolean = options.server;
// HTTP szerver létrehozása sikeres volt-e?
var isHttpServerCreated: boolean = false;

// Eszközök felderítése.
if (isConnectToDevices) {
    DeviceManager.scanDevices(2000,
        function () {
            Messages.log('Device scanning finished.');

            // Vezérlők létrehozása, tárolása.

            // HTTP szerver létrehozása.
            createHttpServer();
        },
        function () {
            // Ha adott idő után sem találunk eszközt, akkor jelezzük.
            Messages.warn("No connected devices found.");
            // HTTP szerver létrehozása.
            createHttpServer();
        }
    ); //DeviceManager.scanDevices
}

// HTTP szerver létrehozásának függvénye.
var createHttpServer = function () {
    if (isCreateHttpServer) {

        // Szerver létrehozása.
        var server: Server = new Server(3000);

        // Kezelők regisztrálása.
        var mmh: MainMenuHandler = new MainMenuHandler();
        server.registerHandler(mmh);
        server.registerHandler(new MotorControlHandler(mmh));

        // Szerver indítása.
        server.start(
            function () {
                isHttpServerCreated = true;
                Messages.log('HTTP server listening on port ' + server.getPort() + '.');
            });
    }
};

// HTTP szerver létrehozása.
if (isCreateHttpServer && !isConnectToDevices && !isHttpServerCreated) createHttpServer();