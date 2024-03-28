// @vitest-environment node
import { describe, expect, it } from "vitest";
import { login } from "@/tests/utilities";
import DocumentCollectionProxy from "./document-collection-proxy";
import setTimeoutPromise from "@/framework/utilities/set-timeout-promise";
import { NonEmptyString } from "@/_common_/models";
import { z } from "zod";
import documentSpecificationFactory from "@/_common_/libraries/document-specification-factory";

export const JournalEntry = documentSpecificationFactory.createDocumentSpecification("journal-entry", "Journal Entry", z.object({
    title: NonEmptyString,
    entry: z.string().nullish()
}));

describe("Document Collection", async ()=>{
    it("Syncs Data", async ()=>{
        const userID = await login();
        const coll = new DocumentCollectionProxy(`user/${userID}/journal-entry/`, JournalEntry, true);

        await setTimeoutPromise(500, async () => { await coll.deleteDocuments() });

        await setTimeoutPromise(500, ()=>{
            console.debug("Items before creation:\n", coll.documents.length);
            expect(coll.documents.length).toBe(0);
        });

        await coll.createDocument({
            title: "Sample Journal Entry",
            entry: "Something...",
        });

        await setTimeoutPromise(500, ()=>{
            console.debug("Items after creation:\n", coll.documents.length);
            expect(coll.documents.length).toBe(1);
        });
    });
});
