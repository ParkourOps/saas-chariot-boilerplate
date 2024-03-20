import posthog from "posthog-js";
import {
    type UserEventName_SPA,
    type UserEventArgs_SPA,
    userEventData_SPA
} from "@/_common_/features/user-feedback-and-analytics";

export function captureEvent<EventName extends UserEventName_SPA>(
    eventName: EventName,
    ...args: UserEventArgs_SPA<EventName>
) {
    const eventData = userEventData_SPA(eventName, ...args);
    const result = posthog.capture(eventName, eventData);
    console.debug(`Captured event: ${eventName}`, eventData, result);
}
