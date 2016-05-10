/// <reference path="devices/DeviceManager.ts"/>
/// <reference path="server/Server.ts"/>
/// <reference path="utils/Utils.ts"/>

declare var process;

// Parancssori argumentumok lekérdezése.
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

// Csatlakozás eszközökhöz.
var isConnectToDevices: boolean = options.devices;
// HTTP szerver indítása.
var isCreateHttpServer: boolean = options.server;
// HTTP szerver létrehozása sikeres volt-e?
var isHttpServerCreated: boolean = false;

// Eszközök felderítése.
if (isConnectToDevices) {
    DeviceManager.scanDevices(
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
        var mmh:MainMenuHandler = new MainMenuHandler();
        server.registerHandler(mmh);
        server.registerHandler(new RequestHandler('/m1', 'Teszt menü 1', mmh));
        server.registerHandler(new RequestHandler('/m2', 'Teszt menü 2', mmh));
        server.registerHandler(new RequestHandler('/m3', 'Teszt menü 3', mmh));

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
