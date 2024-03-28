import type { DocumentSchema, DocumentSpecification } from "@/_common_/libraries/document-specification-factory";
import type { ZodRawShape, z, ZodObject } from "zod";
import errors from "./types/errors";
import { deleteDoc, doc, getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import type { Unsubscribe } from "firebase/auth";
import firestore from "@/framework/libraries/_firebase_/firestore";

class DocumentProxy<
    TypePrefix extends string,
    TypeName extends string,
    DataShape extends ZodRawShape,
> {
    private readonly path;
    private readonly documentRef;
    private readonly documentSpecification;
    document: DocumentSchema<DataShape> | undefined;

    constructor(path: string, documentSpecification: DocumentSpecification<TypePrefix, TypeName, DataShape>, startSync?: boolean) {
        // 
        this.path = path;
        this.documentRef = doc(firestore, path);
        // 
        this.documentSpecification = documentSpecification;
        // 
        if (startSync) {
            this.startSync();
        }
    }

    unsubscribe: Unsubscribe | undefined;
    startSync() {
        this.unsubscribe = onSnapshot(this.documentRef, (snapshot)=>{
            const exists = snapshot.exists();
            if (!exists) return;
            const data = snapshot.data() as DocumentSchema<DataShape>;
            const dataParseResult = this.documentSpecification.parseDocument(data);
            if (dataParseResult.success) {
                this.document = data;
            } else if (!dataParseResult.success) {
                throw errors.receivedDocumentInvalid(this.path, data, dataParseResult.error.errors);
            }
        });
    }

    stopSync() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = undefined;
        }
    }

    reset() {
        this.document = undefined;
    }

    async set(data: z.infer<ZodObject<DataShape>>) {
        const id = this.documentSpecification.generateDocumentID();
        const _data = {
            id,
            type: this.documentSpecification.typeName,
            createdAt: serverTimestamp(),
            lastUpdatedAt: null,
            data,
        } satisfies DocumentSchema<DataShape>;
        const dataParseResult = this.documentSpecification.parseDocument(_data);
        if (dataParseResult.success) {
            const ref = doc(firestore, this.path);
            await setDoc(ref, _data);
        } else {
            throw errors.documentInvalid(this.path, data, dataParseResult.error.errors);
        }
    }

    async delete() {
        const doc = await getDoc(this.documentRef);
        if (!doc.exists()) {
            return;
        }
        await deleteDoc(this.documentRef);
    }

    async update(data: Partial<z.infer<ZodObject<DataShape>>>) {
        const doc = await getDoc(this.documentRef);
        if ((Object.keys(data).length < 1) || !doc.exists()) { 
            return;
        }
        const dataParseResult = this.documentSpecification.parseData(data, true);
        if (dataParseResult.success) {
            await setDoc(
                this.documentRef,
                {
                    data,
                    lastUpdatedAt: serverTimestamp()
                },
                {
                    merge: true,
                }
            );
        } else {
            throw errors.documentInvalid(this.path, data, dataParseResult.error.errors);
        }
    }
}

export default DocumentProxy;
