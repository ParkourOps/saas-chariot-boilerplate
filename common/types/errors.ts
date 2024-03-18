export class ValidationError extends Error {
    constructor() {
        super("Data is invalid.");
    }
}

