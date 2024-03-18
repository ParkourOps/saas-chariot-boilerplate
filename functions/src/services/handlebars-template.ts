import serviceFactory from "@/libraries/service-factory";
import ServiceFunctionError from "@/libraries/service-factory/service-function-error";
import * as fs from "fs-extra";
import handlebars from "handlebars";

type Handlebars = typeof handlebars;

const handlebarsTemplateService = serviceFactory.createService(
    "Handlebars Template",
    "A service for producing text content using semantic templates.",
    ()=>handlebars
);

function compileHandlebarsTemplate(
    handlebars: Handlebars,
    template: string,
    templateSubstitutions: Record<string, unknown>
) {
    // TODO: Fix helper functions:
    // handlebars.registerHelper({
    //     eq(arg1, arg2, arg3, arg4, arg5, arg6, options) {
    //         const args = [arg1, arg2, arg3, arg4, arg5, arg6].filter((arg)=>(typeof arg === "string"));
    //         const result = (arg1 === arg2);
    //         console.log(args, result, options?.data);
    //         return (result ? options?.fn(this) : options?.inverse(this));
    //     },
    //     ne(arg1, arg2, arg3, arg4, arg5, arg6, options) {
    //         const args = [arg1, arg2, arg3, arg4, arg5, arg6].filter((arg)=>(typeof arg === "string"));
    //         const result = (arg1 !== arg2);
    //         console.log(args, result);
    //         return (result ? options?.fn(this) : options?.inverse(this));
    //     },
    //     lt(arg1, arg2, arg3, arg4, arg5, arg6, options) {
    //         const args = [arg1, arg2, arg3, arg4, arg5, arg6].filter((arg)=>(typeof arg === "string"));
    //         const result = (arg1 < arg2);
    //         console.log(args, result);
    //         return (result ? options?.fn(this) : options?.inverse(this));
    //     },
    //     gt(arg1, arg2, arg3, arg4, arg5, arg6, options) {
    //         const args = [arg1, arg2, arg3, arg4, arg5, arg6].filter((arg)=>(typeof arg === "string"));
    //         const result = (arg1 > arg2);
    //         console.log(args, result);
    //         return (result ? options?.fn(this) : options?.inverse(this));
    //     },
    //     lte(arg1, arg2, arg3, arg4, arg5, arg6, options) {
    //         const args = [arg1, arg2, arg3, arg4, arg5, arg6].filter((arg)=>(typeof arg === "string"));
    //         const result = (arg1 <= arg2);
    //         console.log(args, result);
    //         return (result ? options?.fn(this) : options?.inverse(this));
    //     },
    //     gte(arg1, arg2, arg3, arg4, arg5, arg6, options) {
    //         const args = [arg1, arg2, arg3, arg4, arg5, arg6].filter((arg)=>(typeof arg === "string"));
    //         const result = (arg1 >= arg2);
    //         console.log(args, result);
    //         return (result ? options?.fn(this) : options?.inverse(this));
    //     },
    //     and(arg1, arg2, arg3, arg4, arg5, arg6, options) {
    //         const args = [arg1, arg2, arg3, arg4, arg5, arg6].filter((arg)=>(typeof arg === "string"));
    //         const result = args.every((arg)=>!!arg);
    //         console.log(args, result);
    //         return (result ? options?.fn(this) : options?.inverse(this));
    //     },
    //     or(arg1, arg2, arg3, arg4, arg5, arg6, options) {
    //         const args = [arg1, arg2, arg3, arg4, arg5, arg6].filter((arg)=>(typeof arg === "string"));
    //         const result = args.some((arg)=>!!arg);
    //         console.log(args, result);
    //         return (result ? options?.fn(this) : options?.inverse(this));
    //     },
    // });
    const compiled = handlebars.compile(template)(templateSubstitutions);
    return compiled;
}

export const substitutePreinstalledTemplate = handlebarsTemplateService.createServiceFunction(
    async (service, correlationId, templatePath: string, templateSubstitutions: Record<string, unknown>)=>{
        // check if file exists
        const _templatePath = `${__dirname}/../data/${templatePath}`;
        const exists = await fs.pathExists(_templatePath);
        if (!exists) {
            throw ServiceFunctionError.create(
                service.name,
                service.description,
                correlationId,
                "invalid-argument",
                `Template has not been installed: ${templatePath}`,
                {
                    templatePath,
                    templateExistsAtPath: exists
                }
            );
        }
        // read template file
        let template : string;
        try {
            template = await fs.readFile(_templatePath, "utf-8");
        } catch (e) {
            throw ServiceFunctionError.createFromException(
                service.name,
                service.description,
                correlationId,
                e,
                "internal",
                `Could not read template: ${templatePath}`,
                {
                    templatePath,
                }
            )
        }
        // compile and substitute template
        let output : string;
        try {
            output = compileHandlebarsTemplate(service.provider(), template, templateSubstitutions);
            return output;
        } catch (e) {
            throw ServiceFunctionError.createFromException(
                service.name,
                service.description,
                correlationId,
                e,
                "internal",
                `Could not substitute template: ${templatePath}`,
                {
                    templatePath,
                    template,
                    templateSubstitutions,
                }
            )
        }
    }
);
