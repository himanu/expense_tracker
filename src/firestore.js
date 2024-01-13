import {addDoc, collection} from "firebase/firestore";
import { fireStoreRef } from "./firebase.config";

export const addDocument = async (document) => {
    await addDoc(collection(fireStoreRef, "expenses"), {
        ...document
    });
}