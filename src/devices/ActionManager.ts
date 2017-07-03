/// <reference path="DeviceAction.ts"/>
/// <reference path="../utils/Map.ts"/>
/// <reference path="../utils/List.ts"/>


/**
 * Parancsok kezelője.
 */
class ActionManager {
    /**
     * Parancsok tárolója parancsazonosító szerint.
     */
    private static actions: Map<number, List<DeviceAction>> = new Map<number, List<DeviceAction>>();
    /**
     * Parancsok tárolója egyedi azonosító szerint.
     */
    private static actionsByUID: Map<string, DeviceAction> = new Map<string, DeviceAction>();
    /**
     * Aktuálisan futó parancsazonosító.
     */
    private static currentActionID:number = 0;


    /**
     * Parancs tárolása.
     */
    public static storeAction(action: DeviceAction): DeviceAction {
        
        // Ha nincs megadva parancsazonosító, akkor kilépünk.
        if (0 == action.getActionID()) return action;

        // Ha nincs még ilyen parancsazonosítónk tárolva akkor létrehozzuk.
        if (!this.actions.has(action.getActionID())) {
            ActionManager.actions.set(action.getActionID(), new List<DeviceAction>());
        }

        // Parancs tárolása.
        ActionManager.actions.get(action.getActionID()).append(action);
        ActionManager.actionsByUID.set(action.getUniqueID.toString(), action);

        return action;
    }

    public static storeActionsGroup(): void {
    }

    /**
     * Soron következő parancs futtatása.
     * 
     * @param actionUID parancs egyedi azonosítója
     */
    public static doNextAction(actionUID: string) {

        // Parancs lekérdezése.

        // Ha találtunk ilyen parancsot, akkor befejezettre állítjuk a futását (running=true, finished=true).

        // Végig haladunk a parancs csoportján.
        // running=true finished=true -> már lefutott de a futás utáni esemény még nem futott le (esemény futása után running=false finished=true)
        // running=true finished=false -> még fut
        // running=false finished=true -> már lefutott
    }
}