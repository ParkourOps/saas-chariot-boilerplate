import {getFirestore, FieldValue} from "firebase-admin/firestore";

let db : FirebaseFirestore.Firestore | undefined;

function get() {
    if (!db) {
        db = getFirestore();
        db.settings({ignoreUndefinedProperties: true});
    }
    return db;
}

export default {
    get,
    FieldValue,
};

export {type SetOptions} from "firebase-admin/firestore";
