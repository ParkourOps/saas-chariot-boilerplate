import useBusyStatus from "./busy-status";

export type ActionFn = ((()=>void) | (()=>Promise<void>));
export type ActionArg = ActionFn | ActionFn[];

class Actor {
    private static async _act(action?: ActionArg) {
        if (!action) return;
        const busyStatus = useBusyStatus();
        const token = busyStatus.registerPendingAction();
        if (Array.isArray(action)) {
            for (const p of action) {
                await p();
            }
        } else {
            await action();
        }
        token.unregisterPendingAction();
    }
    static act(action?: ActionArg) {
        return () => this._act(action);
    }
}

export default Actor;
