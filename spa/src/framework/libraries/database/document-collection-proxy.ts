import firestore from "@/framework/libraries/_firebase_/firestore";
import type { Unsubscribe } from "firebase/auth";
import { collection, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import {z, type ZodObject, type ZodRawShape} from "zod";
import {DocumentSpecification, type DocumentSchema} from "@/_common_/libraries/document-specification-factory";
import errors from "./types/errors";
import DocumentProxy from "./document-proxy";

class DocumentCollectionProxy<
    TypePrefix extends string,
    TypeName extends string,
    DataShape extends ZodRawShape,
> {
    private readonly path;
    private readonly collectionRef;
    private readonly documentSpecification;
    documents: (DocumentProxy<TypePrefix, TypeName, DataShape>)[];

    constructor(path: string, documentSpecification: DocumentSpecification<TypePrefix, TypeName, DataShape>, startSync?: boolean) {
        // 
        this.path = path;
        this.collectionRef = collection(firestore, path);
        // 
        this.documentSpecification = documentSpecification;
        this.documents = [];
        // 
        if (startSync) {
            this.startSync();
        }
    }

    unsubscribe: Unsubscribe | undefined;
    startSync() {
        this.unsubscribe = onSnapshot(this.collectionRef, (snapshot)=>{
            const docs = snapshot.docs;
            this.reset();
            for (const doc of docs) {
                const exists = doc.exists();
                if (!exists) {
                    continue;
                }
                const data = doc.data() as DocumentSchema<DataShape>;
                const dataParseResult = this.documentSpecification.parseDocument(data);
                if (dataParseResult.success) {
                    this.documents.push(new DocumentProxy(this.path + data.id, this.documentSpecification, true));
                } else if (!dataParseResult.success) {
                    throw errors.receivedDocumentInvalid(this.path, data, dataParseResult.error.errors);
                }
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
        this.documents = [];
    }

    async createDocument(data: z.infer<ZodObject<DataShape>>) {
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
            const ref = doc(firestore, this.path + id);
            await setDoc(ref, _data);            
        } else {
            throw errors.documentInvalid(this.path, data, dataParseResult.error.errors);
        }
    }

    async deleteDocuments() {
        const work : Promise<void>[] = [];
        for (const doc of this.documents) {
            work.push(doc.delete());
        }
        await Promise.all(work);
    }
}

export default DocumentCollectionProxy;
