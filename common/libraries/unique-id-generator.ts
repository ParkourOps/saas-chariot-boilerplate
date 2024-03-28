import {v4 as uuidv4} from "uuid";

class UniqueIDGenerator<
    Prefix extends string
> {
    private prefix : Prefix;
    constructor(prefix: Prefix) {
        this.prefix = prefix;
    }
    generateUniqueID() {
        const uuid = uuidv4();
        return `${this.prefix as Prefix}:${uuid}` as `${Prefix}:${string}`;
    }
}

export default UniqueIDGenerator;
