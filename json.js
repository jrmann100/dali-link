import { initializeApp, credential as _credential, firestore } from "firebase-admin";
import serviceAccount from "./service-key.json";
initializeApp({
  credential: _credential.cert(serviceAccount),
});
import { forEach } from "./dali.json";
forEach(firestore().collection("members").add);
