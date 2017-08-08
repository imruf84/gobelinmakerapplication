/// <reference path="DeviceAction.ts"/>
/// <reference path="DeviceManager.ts"/>
/// <reference path="../utils/Map.ts"/>
/// <reference path="../utils/List.ts"/>


/**
 * Parancsok kezelője.
 */
class ActionManager {
    /**
     * Parancsok tárolója.
     */
    private static actions: List<DeviceAction> = new List<DeviceAction>();
    

    /**
     * Parancs tárolása.
     */
    public static storeAction(action: DeviceAction): DeviceAction {
        
        this.actions.append(action);
        DeviceManager.doAction(action);
        return action;
    }

}