import useBusyStatus from "./busy-status";

export type ActionFn = ((()=>void) | (()=>Promise<void>));
export type ActionArg = ActionFn | ActionFn[];

async function enact(action?: ActionArg) {
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

export function makeEnacter(action?: ActionArg) {
    return () => enact(action);
}
