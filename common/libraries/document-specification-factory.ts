import { z, ZodObject, type ZodRawShape } from "zod";
import idGenerator from "./unique-id-generator";
import { NonEmptyString, NonNegativeDecimal } from "../models";

const Timestamp = NonNegativeDecimal.or(z.object({}));
// const UserID = NonEmptyString;
// const UserPermission = z.union([
//     z.literal("read-only"),
//     z.literal("read-write"),
//     z.literal("read-write-delete"),
// ]);
// const UserPermissions = z.record(UserID, UserPermission);

const BaseDocumentSchema = <
    TypePrefix extends string,
    TypeName extends string,
>(
    typePrefix: TypePrefix,
    typeName: TypeName
) => z.object({
    // document identification
    id: NonEmptyString.startsWith(typePrefix  + ":"),
    type: NonEmptyString.regex(new RegExp(typeName)), //z.literal(typeName),
    // timestamps
    createdAt: Timestamp.nullish(),
    lastUpdatedAt: Timestamp.nullish(),
});

type BaseDocumentSchema = z.infer<ReturnType<typeof BaseDocumentSchema<any, any>>>;
export type DocumentSchema<DataShape extends ZodRawShape> = BaseDocumentSchema & { data: z.infer<ZodObject<DataShape>> };

export class DocumentSpecification<
    TypePrefix extends string,
    TypeName extends string,
    DataShape extends ZodRawShape,
> {
    readonly typePrefix;
    readonly typeName;
    readonly documentSchema;
    readonly dataSchema;

    constructor(typePrefix: TypePrefix, typeName: TypeName, schema: ZodObject<DataShape>) {
        this.typePrefix = typePrefix;
        this.typeName = typeName;
        this.documentSchema = BaseDocumentSchema(typePrefix, typeName).merge(z.object({
            data: schema,
        }));
        this.dataSchema = schema;
    }

    parseDocument(input: unknown) {
        return this.documentSchema.safeParse(input);
    }

    parseData(input: unknown, partial?: boolean) {
        if (partial) {
            return this.dataSchema.partial().safeParse(input);
        } else {
            return this.dataSchema.safeParse(input);
        }
    }

    generateDocumentID() {
        return new idGenerator(this.typePrefix).generateUniqueID();
    }
}

export default {
    createDocumentSpecification: <
        TypePrefix extends string,
        TypeName extends string,
        DataShape extends ZodRawShape,
    >(
        typePrefix: TypePrefix,
        typeName: TypeName,
        schema: ZodObject<DataShape>
    ) => new DocumentSpecification(typePrefix, typeName, schema),
}
