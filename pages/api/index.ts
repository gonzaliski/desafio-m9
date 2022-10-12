import type { NextApiRequest,NextApiResponse } from "next";
import { User } from "lib/models/user";
import { firestore } from "lib/firestore";

export default async function(req:NextApiRequest,res:NextApiResponse){
    // const newUser = new User("2LeOecwNSy9Bx09jumnR").coll()
    res.send("Hola, estoy funcionando")
}