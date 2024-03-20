import type { EventsDictionary } from "../types/events-dictionary";

export default {
    ["user-signed-in"]: (userID: string) => ({userID}),
    ["user-signed-out"]: (userID: string) => ({userID}),
} satisfies EventsDictionary;
