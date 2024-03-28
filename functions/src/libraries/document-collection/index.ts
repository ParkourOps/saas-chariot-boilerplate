// import firestore from "./firestore";
// import {/* z, */ type ZodRawShape, type UnknownKeysParam, type ZodTypeAny, objectOutputType, ZodObject} from "zod";
// import {type DeepPartial} from "@/_common_/types/deep-partial";

// /*
//     Document IDs may include any order of the following:

//     - lowercase letters
//     - uppercase letters
//     - numbers
//     - colon :
//     - semicolon ;
//     - address sign @
//     - question mark ?
//     - ampersand &
//     - equal sign =
//     - hash sign #
//     - percentage sign %
//     - plus sign +
//     - exclamation mark !
//     - dollar sign $
//     - asterisk sign *
//     - comma ,
//     - period .
//     - dash -
//     - hyphen _
//     - tilde ~
// */
// // const DocumentId = z.string().regex(/^([a-zA-Z1-9:;@?&=#%+!$*,.\-_~]+)$/);

// type CheckDocumentExistsThrowBehaviour = {
//     throwOn: "found" | "not-found",
//     message: string
// }

// type UpdateDocumentArraySpecification = {
//     type: "union" | "remove",
//     elements: Array<unknown>,
// }

// const DocumentPathTemplateRegex = /^(([a-z-]+)(\/{})((\/[a-z-]+)(\/{}))*)$/;

// // function checkIdsMatchCollectionPath(collectionPath: string, ids: string[]) {
// //     const numSlots = (collectionPath.match(/\{\}/g))?.length ?? 0;
// //     const matchNumSlots = (ids.length === numSlots);
// //     return matchNumSlots;
// // }

// export class DocumentCollection<
//     DocumentDataShape extends ZodRawShape,
//     DocumentDataUnknownKeys extends UnknownKeysParam,
//     DocumentDataCatchAll extends ZodTypeAny,
// > {
//     private collectionPathTemplate : string;
//     private dataSchema : ZodObject<DocumentDataShape, DocumentDataUnknownKeys, DocumentDataCatchAll>;

//     private constructor(
//         documentPathTemplate: string,
//         documentSchema: ZodObject<DocumentDataShape, DocumentDataUnknownKeys, DocumentDataCatchAll>
//     ) {
//         if (DocumentPathTemplateRegex.test(documentPathTemplate)) {
//             this.collectionPathTemplate = documentPathTemplate;
//         } else {
//             throw Error(`Invalid document path template: ${documentPathTemplate}`);
//         }
//         this.dataSchema = documentSchema;
//     }

//     public static declare<
//         DocumentDataShape extends ZodRawShape,
//         DocumentDataUnknownKeys extends UnknownKeysParam,
//         DocumentDataCatchAll extends ZodTypeAny,
//     >(
//         documentPathTemplate: string,
//         documentSchema: ZodObject<DocumentDataShape, DocumentDataUnknownKeys, DocumentDataCatchAll>
//     ) {
//         return new DocumentCollection(documentPathTemplate, documentSchema);
//     }

//     private getDocumentRef(correlationId: string | undefined, ids: string[]) {
//         let index = 0;
//         const collectionPath = this.collectionPathTemplate.replace(/\{\}/, ()=>{
//             const id = ids[index];
//             if (!id) {
//                 throw ServerlessFunctionError.create(
//                     correlationId,
//                     "not-found",
//                     "Could not locate document.",
//                     {
//                         inputVariables: {
//                             collectionPathTemplate: this.collectionPathTemplate,
//                             ids,
//                         },
//                     }
//                 );
//             } else {
//                 index++;
//                 return id;
//             }
//         });
//         const db = firestore.get();
//         return db.doc(collectionPath);
//     }

//     public getDocPath(correlationId: string | undefined, ids: string[]) {
//         let index = 0;
//         const collectionPath = this.collectionPathTemplate.replace(/\{\}/, ()=>{
//             const id = ids[index];
//             if (!id) {
//                 throw ServerlessFunctionError.create(
//                     correlationId,
//                     "not-found",
//                     "Could not locate document.",
//                     {
//                         inputVariables: {
//                             collectionPathTemplate: this.collectionPathTemplate,
//                             ids,
//                         },
//                     }
//                 );
//             } else {
//                 index++;
//                 return id;
//             }
//         });
//         return collectionPath;
//     }

//     private parseDocumentData(correlationId: string | undefined, documentData: objectOutputType<DocumentDataShape, DocumentDataCatchAll, DocumentDataUnknownKeys>) {
//         const parseResult = this.dataSchema.safeParse(documentData);
//         if (!parseResult.success) {
//             throw ServerlessFunctionError.create(
//                 correlationId,
//                 "invalid-argument",
//                 "Could not parse document data.",
//                 {
//                     inputVariables: {
//                         documentData,
//                     },
//                     intermediateVariables: {
//                         parseResult: {
//                             error: parseResult.error.errors,
//                         },
//                     },
//                 }
//             );
//         } else {
//             return parseResult.data;
//         }
//     }

//     private parsePartialDocumentData(correlationId: string | undefined, documentData: DeepPartial<objectOutputType<DocumentDataShape, DocumentDataCatchAll, DocumentDataUnknownKeys>>) {
//         const parseResult = this.dataSchema.partial().safeParse(documentData);
//         if (!parseResult.success) {
//             throw ServerlessFunctionError.create(
//                 correlationId,
//                 "invalid-argument",
//                 "Could not parse partial document data.",
//                 {
//                     inputVariables: {
//                         documentData,
//                     },
//                     intermediateVariables: {
//                         parseResult: {
//                             error: parseResult.error.errors,
//                         },
//                     },
//                 }
//             );
//         } else {
//             return parseResult.data;
//         }
//     }

//     public async docExists(correlationId: string | undefined, ids: string[], throwBehaviour?: CheckDocumentExistsThrowBehaviour) {
//         const docRef = this.getDocumentRef(correlationId, ids);
//         const getResult = await docRef.get();
//         if (throwBehaviour?.throwOn === "not-found" && !getResult.exists) {
//             throw ServerlessFunctionError.create(
//                 correlationId,
//                 "not-found",
//                 throwBehaviour.message,
//                 {
//                     inputVariables: {
//                         docPath: docRef.path,
//                     },
//                 }
//             );
//         } else if (throwBehaviour?.throwOn === "found" && getResult.exists) {
//             throw ServerlessFunctionError.create(
//                 correlationId,
//                 "invalid-argument",
//                 throwBehaviour.message,
//                 {
//                     inputVariables: {
//                         docPath: docRef.path,
//                     },
//                 }
//             );
//         }
//         return getResult.exists;
//     }

//     public async createDoc(correlationId: string | undefined, ids: string[], documentData: objectOutputType<DocumentDataShape, DocumentDataCatchAll, DocumentDataUnknownKeys>) {
//         const docRef = this.getDocumentRef(correlationId, ids);
//         // ensure document does not exist
//         this.docExists(correlationId, ids, {
//             throwOn: "found",
//             message: "Could not create document in collection. A document with the same path already exists.",
//         });
//         // check document data for validity and create the document
//         const _documentData = this.parseDocumentData(correlationId, documentData);
//         try {
//             await docRef.create(_documentData);
//         } catch (e) {
//             throw ServerlessFunctionError.createFromException(
//                 correlationId,
//                 e,
//                 "internal",
//                 "Could not create document in collection.",
//                 {
//                     inputVariables: {
//                         documentData,
//                         docPath: docRef.path,
//                     },
//                 }
//             );
//         }
//     }

//     public async setDoc(correlationId: string | undefined, ids: string[], documentData: objectOutputType<DocumentDataShape, DocumentDataCatchAll, DocumentDataUnknownKeys>) {
//         const docRef = this.getDocumentRef(correlationId, ids);
//         // check document data for validity and set the document
//         const _documentData = this.parseDocumentData(correlationId, documentData);
//         try {
//             await docRef.set(_documentData);
//         } catch (e) {
//             throw ServerlessFunctionError.createFromException(
//                 correlationId,
//                 e,
//                 "internal",
//                 "Could not set document in collection.",
//                 {
//                     inputVariables: {
//                         docPath: docRef.path,
//                         documentData,
//                     },
//                     intermediateVariables: {
//                         parsedDocumentData: _documentData,
//                     },
//                 }
//             );
//         }
//     }

//     public async mergeDoc(correlationId: string | undefined, ids: string[], documentData: DeepPartial<objectOutputType<DocumentDataShape, DocumentDataCatchAll, DocumentDataUnknownKeys>>) {
//         const docRef = this.getDocumentRef(correlationId, ids);
//         // check document data for validity and set the document
//         const _documentData = this.parsePartialDocumentData(correlationId, documentData);
//         try {
//             await docRef.set(_documentData, {merge: true});
//         } catch (e) {
//             throw ServerlessFunctionError.createFromException(
//                 correlationId,
//                 e,
//                 "internal",
//                 "Could not merge document in collection.",
//                 {
//                     inputVariables: {
//                         docPath: docRef.path,
//                         documentData,
//                     },
//                     intermediateVariables: {
//                         parsedDocumentData: _documentData,
//                     },
//                 }
//             );
//         }
//     }

//     public async deleteDoc(correlationId: string | undefined, ids: string[]) {
//         const docRef = this.getDocumentRef(correlationId, ids);
//         // check exists
//         this.docExists(correlationId, ids, {
//             throwOn: "not-found",
//             message: "Could not delete document from collection. The document does not exist.",
//         });
//         // delete the document
//         try {
//             await docRef.delete();
//         } catch (e) {
//             throw ServerlessFunctionError.createFromException(
//                 correlationId,
//                 e,
//                 "internal",
//                 "Could not delete document from collection.",
//                 {
//                     inputVariables: {
//                         docPath: docRef.path,
//                     },
//                 }
//             );
//         }
//     }

//     public async readDoc(correlationId: string | undefined, ids: string[]) {
//         const docRef = this.getDocumentRef(correlationId, ids);
//         // read data
//         let rawDocumentData : FirebaseFirestore.DocumentData | undefined;
//         try {
//             rawDocumentData = (await docRef.get()).data();
//             if (!rawDocumentData) {
//                 throw ServerlessFunctionError.create(
//                     correlationId,
//                     "not-found",
//                     "Could not read document from collection. Document does not exist.",
//                     {
//                         inputVariables: {
//                             docPath: docRef.path,
//                         },
//                     }
//                 );
//             }
//         } catch (e) {
//             throw ServerlessFunctionError.createFromException(
//                 correlationId,
//                 e,
//                 "internal",
//                 "Could not read document from collection.",
//                 {
//                     inputVariables: {
//                         docPath: docRef.path,
//                     },
//                 }
//             );
//         }
//         return this.parseDocumentData(correlationId, rawDocumentData as any);
//     }

//     // Warning: This function does not validate data!
//     public async appendToArrayInDoc(
//         correlationId: string | undefined,
//         ids: string[],
//         updateData: Record<PathsToProps<objectOutputType<DocumentDataShape, DocumentDataCatchAll, DocumentDataUnknownKeys>, Array<unknown>>, UpdateDocumentArraySpecification>,
//     ) {
//         // parse document ID
//         const docRef = this.getDocumentRef(correlationId, ids);
//         // check if document exists
//         this.docExists(correlationId, ids, {
//             throwOn: "not-found",
//             message: "Could not update document in collection. The document does not exist.",
//         });
//         // update the document
//         const _updateData : Record<string, unknown> = {};
//         Object.keys(updateData).forEach((key) => {
//             const _key = key as keyof typeof updateData;
//             if (updateData[_key].type === "union") {
//                 _updateData[key] = firestore.FieldValue.arrayUnion(...updateData[_key].elements);
//             } else if (updateData[_key].type === "remove") {
//                 _updateData[key] = firestore.FieldValue.arrayRemove(...updateData[_key].elements);
//             }
//         });
//         try {
//             await docRef.update(_updateData);
//         } catch (e) {
//             throw ServerlessFunctionError.createFromException(
//                 correlationId,
//                 e,
//                 "internal",
//                 "Could not update document in collection.",
//                 {
//                     inputVariables: {
//                         docPath: docRef.path,
//                         updateData,
//                     },
//                 }
//             );
//         }
//     }
// }
