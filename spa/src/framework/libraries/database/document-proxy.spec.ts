// @vitest-environment node
import { describe, it, expect } from "vitest";
import { UserProfile } from "@/_common_/features/user-data/documents";
import { login } from "@/tests/utilities";
import DocumentProxy from "@/framework/libraries/database/document-proxy";
import setTimeoutPromise from "@/framework/utilities/set-timeout-promise";

describe("Document", async ()=>{
    it("Delete", async ()=>{
        const userID = await login();
        const doc = new DocumentProxy(`user/${userID}`, UserProfile, true);
        await doc.delete();
    });

    it("Create", async ()=>{
        const userID = await login();
        const doc = new DocumentProxy(`user/${userID}`, UserProfile, true);
        
        await setTimeoutPromise(500, ()=>{
            console.debug("Value before creation:\n", doc.document);
            expect(doc.document).toBe(undefined);
        });

        await doc.set({
            email: "tejbirring@gmail.com",
            emailVerified: false,
        });

        await setTimeoutPromise(500, ()=>{
            console.debug("Value after creation:\n", doc.document);
            expect(doc.document).toBeTypeOf("object");
        });
    });

    it("Update", async ()=>{
        const userID = await login();
        const doc = new DocumentProxy(`user/${userID}`, UserProfile, true);

        await setTimeoutPromise(500, ()=>{
            console.debug("Value before creation:\n", doc.document);
            expect(doc.document).toBeTypeOf("object");
        });

        await doc.update({
            emailVerified: true,
        })

        await setTimeoutPromise(500, ()=>{
            console.debug("Value after creation:\n", doc.document);
            expect(doc.document).toBeTypeOf("object");
        });        
    })
});
