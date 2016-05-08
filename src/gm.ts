/// <reference path="devices/DeviceManager.ts"/>

// Eszközök felderítése.
DeviceManager.scanDevices(
    function () {
        Messages.log('Device scanning finished.');

        // Vezérlők létrehozása, tárolása.

        // HTTP szerver létrehozása.
    },
    function () {
        // Ha adott idő után sem találunk eszközt, akkor jelezzük.
        Messages.warn("No connected devices found.");
    }
); //DeviceManager.scanDevices