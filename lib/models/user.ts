import { firestore } from "lib/firestore";

type userData = {
    email:string,
  }

const collection = firestore.collection("users")
export class User{
    ref: FirebaseFirestore.DocumentData;
    data: any;
    id:string;
    constructor(id){
        this.id=id
        this.ref = collection.doc(id)
    }
     async pull(){
        const snap = await this.ref.get()
        this.data = snap.data()
    }
    async push(){
        this.ref.update(this.data)
    }
    static async createNewUser(data){
        const newUserSnap = await collection.add(data)
        const newUser = new User(newUserSnap.id)
        newUser.data = data
        newUser.push()
        return newUser
    }
}