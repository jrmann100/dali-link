import { get, writable } from "svelte/store";
import type { Writable } from "svelte/store";
import { initializeApp, getApps } from "firebase/app";
import type { User } from "firebase/auth";
import { doc, getDoc, getFirestore, onSnapshot, setDoc, collection, query, deleteDoc } from "firebase/firestore";
import type { DocumentData, DocumentReference } from "firebase/firestore";
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

// Undefined is unset, null is logged out.
export let user: Writable<User | undefined | null> = writable(undefined);

auth.onAuthStateChanged(user.set);

// Google sign-in is a separate API from Firebase. This links the two.
(window as any).google.accounts.id.initialize({
    client_id:
        "1078229731902-t6vpjd4v1deeq295n4ibbo0bic8lka96.apps.googleusercontent.com",
    callback: async (c: any) =>
        await signInWithCredential(
            auth,
            GoogleAuthProvider.credential(c.credential)
        )
});

export async function profileExists() {
    return (await getDoc(getProfileDoc())).exists();
}

export async function createProfile() {
    return await setDoc(getProfileDoc(), {
        "name": get(user)!.displayName,
        "year": "",
        "picture": "",
        "gender": "Other",
        "American Indian or Alaska Native": "",
        "Asian": "",
        "Black or African American": "",
        "Hispanic or Latino": "",
        "Middle Eastern": "",
        "Native Hawaiian or Other Pacific Islander": "",
        "White": "",
        "Other": "",
        "major": "",
        "minor": "",
        "modification": "",
        "birthday": "1/1/2000",
        "role": "",
        "home": "",
        "quote": "",
        "favoriteShoe": "",
        "favoriteArtist": "",
        "favoriteColor": "Blue",
        "phoneType": "Other"
    })
}

function getProfileDoc(uid = get(user)!.uid) {
    return doc(db, "users", uid);
}

export async function deleteProfile() {
    return await deleteDoc(getProfileDoc());
}

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
        update,
    };
}

export function getProfile(uid = get(user)!.uid) {
    return docToStore(doc(db, "users", uid));
}

export function getAllProfiles(): Writable<{ [id: string]: DocumentData; }> {

    const { subscribe, set } = writable<{ [id: string]: DocumentData; }>(
        {}
    );
    onSnapshot(query(collection(db, "users")), (pullDocs) => {
        let docs: { [id: string]: DocumentData; } = {};
        pullDocs.forEach((doc: DocumentData) => docs[doc.id] = doc.data());
        set(docs);
    })
    return {
        subscribe,
        set: () => { throw new Error("Store is writable only internally.") },
        update: () => { throw new Error("Store is writable only internally.") }
    };
}

// Could be used with getProfile() to defer loading.
export function getAllProfilesID(): Writable<string[]> {

    const { subscribe, set } = writable<string[]>([]);
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