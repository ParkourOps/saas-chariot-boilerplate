import {z, type ZodType, type ZodTypeDef} from "zod";
import {type DeepReadonly} from "../types/deep-readonly";
import {ValidationError} from "../types/errors";

class DataInstantiator<
    Output,
    Def extends ZodTypeDef,
    Input
> {
    private schema;
    constructor(schema: ZodType<Output, Def, Input>) {
        this.schema = schema;
    }
    createConst(input: z.infer<ZodType<Output, Def, Input>>) {
        const data = Object.freeze(this.schema.parse(input)) as DeepReadonly<z.infer<ZodType<Output, Def, Input>>>;
        const result = this.schema.safeParse(data);
        if (!result.success) {
            throw new ValidationError();
        } else {
            return data;
        }
    }
    static createConst<
        Output,
        Def extends ZodTypeDef,
        Input
    >(schema: ZodType<Output, Def, Input>, input: z.infer<ZodType<Output, Def, Input>>) {
        const instantiator = new DataInstantiator(schema);
        return instantiator.createConst(input);
    }
}

export default DataInstantiator;
