import {type ZodType, type ZodTypeDef} from "zod";

class Validator<
    Output,
    Def extends ZodTypeDef,
    Input
> {
    private schema;
    constructor(schema: ZodType<Output, Def, Input>) {
        this.schema = schema;
    }
    public isValid(input: unknown) : boolean {
        const result = this.schema.safeParse(input);
        return result.success;
    }
}

export default Validator;
