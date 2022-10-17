import { firestore } from "lib/firestore";

type authData = {
  code:number,
  email:string,
  expires:Date,
  userId:string
}

const collection = firestore.collection("auth");
export class Auth {
  ref: FirebaseFirestore.DocumentData;
  data: authData;
  id:string;
  constructor(id:string) {
    this.id = id
    this.ref = collection.doc(id);
  }
  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }
  async push() {
    this.ref.update(this.data);
  }

  static async findByEmail(email: string) {
    const lowerCasedEmail = email.trim().toLowerCase();
    const results = await collection.where("email", "==", lowerCasedEmail).get();
    if (results.docs.length) {
        //get
        const first = results.docs[0]
        const newAuth = new Auth(first.id)
        newAuth.data = first.data() as authData
        return newAuth
    } else {
      //create
      return undefined
    }
  }
  static async createNewAuth(data){
    const newAuthSnap = await collection.add(data)
    const newAuth = new Auth(newAuthSnap.id)
    newAuth.data = data
    return newAuth
}
}
