import {v4 as uuidv4} from "uuid";

class UniqueIdGenerator<
    TPrefix extends string | null
> {
    private prefix : TPrefix;
    constructor(prefix: TPrefix) {
        this.prefix = prefix;
    }
    generate() : string {
        const uuid = uuidv4();
        if (this.prefix) {
            return `${this.prefix}:${uuid}`;
        } else {
            return uuid;
        }
    }
}

export default UniqueIdGenerator;
