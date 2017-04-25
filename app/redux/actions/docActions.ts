import { Doc } from "../../models";
import { IMPORT_DOC, SWITCH_DOC, NEW_DOC, DELETE_DOC, RENAME_DOC } from "../ActionTypes";

export default {
    new(name: string) {
        return { type: NEW_DOC, payload: { name } };
    },
    switch(docId: string) {
        return { type: SWITCH_DOC, payload: docId };
    },
    import(doc: Doc) {
        return { type: IMPORT_DOC, payload: doc };
    },
    delete(docId: string) {
        return { type: DELETE_DOC, payload: docId };
    },
    rename(docId: string, newName: string) {
        return { type: RENAME_DOC, payload: { docId, newName } };
    }
};