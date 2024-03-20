import userEvents_SPA from "./data/user-events_spa";
import userEvents_Functions from "./data/user-events_functions";

export type UserEvents_SPA = typeof userEvents_SPA;
export type UserEventName_SPA = keyof UserEvents_SPA;
export type UserEventArgs_SPA<EventName extends UserEventName_SPA> = Parameters<UserEvents_SPA[EventName]>;
export type UserEventProps_SPA<EventName extends UserEventName_SPA> = ReturnType<UserEvents_SPA[EventName]>;

export type UserEvents_Functions = typeof userEvents_Functions;
export type UserEventName_Functions = keyof UserEvents_Functions;
export type UserEventArgs_Functions<EventName extends UserEventName_Functions> = Parameters<UserEvents_Functions[EventName]>;
export type UserEventProps_Functions<EventName extends UserEventName_Functions> = ReturnType<UserEvents_Functions[EventName]>;

export function userEventData_SPA<EventName extends UserEventName_SPA>(eventName: EventName, ...eventArgs: UserEventArgs_SPA<EventName>) {
    const eventDataFunction = userEvents_SPA[eventName] as ((...args: unknown[]) => UserEventProps_SPA<EventName>);
    const eventData = eventDataFunction(...eventArgs) ?? {};
    return {
        name: eventName,
        source: "SPA",
        ...eventData,
    };
}

export function userEventData_Functions<EventName extends UserEventName_Functions>(eventName: EventName, ...eventArgs: UserEventArgs_Functions<EventName>) {
    const eventDataFunction = userEvents_Functions[eventName] as ((...args: unknown[]) => UserEventProps_Functions<EventName>);
    const eventData = eventDataFunction(...eventArgs) ?? {};
    return {
        name: eventName,
        source: "Functions",
        ...eventData,
    };
}
