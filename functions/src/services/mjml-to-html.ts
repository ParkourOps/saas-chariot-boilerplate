import serviceFactory from "@/libraries/service-factory";
import mjml2html from "mjml";
import {MJMLParseResults} from "mjml-core";
import htmlMinifier from "html-minifier";
import ServiceFunctionError from "@/libraries/service-factory/service-function-error";

const mjmlToHtmlService = serviceFactory.createService(
    "MjmlToHtml",
    "A service for translating Mail Jet Markup Language (MJML) to Hyper Text Markup Language (HTML).",
    ()=>mjml2html,
);

export const translateMjmlToHtml = mjmlToHtmlService.createServiceFunction(
    async (service, correlationId, mjml: string)=>{

        let parseResult : MJMLParseResults;
        try {
            parseResult = service.provider()(mjml);
        } catch (e) {
            throw ServiceFunctionError.createFromException(
                service.name,
                service.description,
                correlationId,
                e,
                "internal",
                "Could not translate Mail Jet Markup Language (MJML) to Hyper Text Markup Language (HTML)",
                {
                    mjml
                }
            );
        }

        if (parseResult.errors.length > 0) {
            throw ServiceFunctionError.create(
                service.name,
                service.description,
                correlationId,
                "invalid-argument",
                "Could not translate Mail Jet Markup Language (MJML) to Hyper Text Markup Language (HTML)",
                {
                    mjml,
                    parseResult
                }
            )
        } else {
            let html = parseResult.html;
            // if (isProductionEnv()) {
                html = htmlMinifier.minify(html, {
                    collapseWhitespace: true,
                    minifyCSS: false,
                    caseSensitive: true,
                    removeEmptyAttributes: true,
                });
            // }
            return html;
        }
    });
