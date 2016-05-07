/// <reference path="devices/DeviceManager.ts"/>

// Eszközök felderítése.
DeviceManager.scanDevices(function () {
    console.log('Device scanning finished.');
});