import { firestore } from "lib/firestore";

const collection = firestore.collection("users")
export async function retrieveUserData(id){
    return (await collection.doc(id).get()).data()
}