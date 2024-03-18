import {type ZodType, type ZodTypeDef} from "zod";
import { ValidationError } from "../types/errors";

class DataValidator<
    Output,
    Def extends ZodTypeDef,
    Input
> {
    private schema;
    constructor(schema: ZodType<Output, Def, Input>) {
        this.schema = schema;
    }
    public checkValidity(input: unknown) {
        const result = this.schema.safeParse(input);
        return result.success;
    }
    public assertValidity(input: unknown) {
        const result = this.checkValidity(input);
        if (!result) {
            throw new ValidationError();
        }
    }
}

export default DataValidator;
