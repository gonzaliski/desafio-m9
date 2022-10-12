import { firestore } from "lib/firestore";

const collection = firestore.collection("orders")
export class Order{
    ref: FirebaseFirestore.DocumentData;
    data: any;
    id:string;
    constructor(id){
        this.id=id
        this.ref = collection.doc(id)
    }
     async pull(){
        const snap = this.ref.get()
        this.data = snap.data()
    }
    async push(){
        this.ref.update(this.data)
    }
    static async findUserOrders(userId){
        const results = await collection.where("userId", "==", userId).get();
        if (results.docs.length) {
            //get
            const orders = results.docs.map((r)=> {
                const order = new Order(r.id)
                order.data = r.data()
                return order
            })
            return orders
        } else {
          //create
          return undefined
        }
    }

    static async createNewOrder(data){
        const newOrderSnap = await collection.add({...data,status:"pending"})        
        const newOrder = new Order(newOrderSnap.id)
        newOrder.data = data
        return newOrder
    }
}