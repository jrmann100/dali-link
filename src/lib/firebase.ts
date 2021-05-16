import { get, writable } from "svelte/store";
import type { Writable } from "svelte/store";
import { initializeApp, getApps } from "firebase/app";
import type { User } from "firebase/auth";
import { doc, getFirestore, onSnapshot, setDoc, collection, query } from "firebase/firestore";
import type { DocumentData, DocumentReference, } from "firebase/firestore";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithCredential,
} from "firebase/auth";

import config from "./firebase-config"

if (getApps().length === 0)
    initializeApp(config);

export let auth = getAuth();
export let db = getFirestore();
export let user: Writable<User | undefined | null> = writable(undefined);

auth.onAuthStateChanged(user.set);

(window as any).google.accounts.id.initialize({
    client_id:
        "1078229731902-t6vpjd4v1deeq295n4ibbo0bic8lka96.apps.googleusercontent.com",
    callback: async (c: any) =>
        await signInWithCredential(
            auth,
            GoogleAuthProvider.credential(c.credential)
        )
});

function docToStore(doc: DocumentReference): Writable<DocumentData | undefined> {
    const { subscribe, set, update } = writable<DocumentData | undefined>(
        undefined
    );
    onSnapshot(doc, (pullDoc) => set(pullDoc.data()));
    return {
        subscribe,
        set: (pushDoc: DocumentReference) => {
            setDoc(doc, pushDoc);
            set(pushDoc);
        },
        update
    };
}

export function getProfile(uid = get(user)!.uid) {
    return docToStore(doc(db, "users", uid));
}

export function getAllProfiles(): Writable<{ [id: string]: DocumentData; }> {

    const { subscribe, set, update } = writable<{ [id: string]: DocumentData; }>(
        {}
    );
    onSnapshot(query(collection(db, "users")), (pullDocs) => {
        let docs: { [id: string]: DocumentData; } = {};
        pullDocs.forEach(doc => docs[doc.id] = doc.data());
        set(docs);
    })
    return {
        subscribe,
        set: () => { throw new Error("Store is writable only internally.") },
        update: () => { throw new Error("Store is writable only internally.") }
    };
}

export function getAllProfilesID(): Writable<string[]> {

    const { subscribe, set, update } = writable<string[]>([]);
    onSnapshot(query(collection(db, "users")), (pullDocs) => {
        let docs: string[] = [];
        pullDocs.forEach(doc => docs.push(doc.id));
        set(docs);
    })
    return {
        subscribe,
        set: () => { throw new Error("Store is writable only internally.") },
        update: () => { throw new Error("Store is writable only internally.") }
    };
}

