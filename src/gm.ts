/// <reference path="devices/DeviceManager.ts"/>
/// <reference path="server/Server.ts"/>

// Parancssori argumentumok lekérdezése.
var commandLineArgs = require('command-line-args');
 
var cli = commandLineArgs([
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'src', type: String, multiple: true, defaultOption: true },
  { name: 'timeout', alias: 't', type: Number }
]);
console.log(cli.getUsage());

// Csatlakozás eszközökhöz.
var isConnectToDevices: boolean = !true;
// HTTP szerver indítása.
var isCreateHttpServer: boolean = !true;
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
        var server: Server = new Server(3000, function () {
            isHttpServerCreated = true;
            Messages.log('HTTP server listening on port ' + server.getPort() + '.');
        });
    }
};

// HTTP szerver létrehozása.
if (isCreateHttpServer && !isConnectToDevices && !isHttpServerCreated) createHttpServer();