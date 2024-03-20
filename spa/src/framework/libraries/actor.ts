import useBusyStatus from "./busy-status";
import logger from "./logger";

export type ActionFn = (() => void) | (() => Promise<void>);
export type ActionArg = ActionFn | ActionFn[];

async function _act(action?: ActionArg) {
    if (!action) {
        console.debug("No action specified.");
        return;
    }
    const busyStatus = useBusyStatus();
    const token = busyStatus.registerPendingAction();
    if (Array.isArray(action)) {
        for (const p of action) {
            try {
                await p();
            } catch (e) {
                if (e instanceof Error) {
                    logger.error(e);
                }
            }
        }
    } else {
        try {
            await action();
        } catch (e) {
            if (e instanceof Error) {
                logger.error(e);
            }
        }
    }
    token.unregisterPendingAction();
}

function act(action?: ActionArg) {
    return () => _act(action);
}

export default {
    act
};
