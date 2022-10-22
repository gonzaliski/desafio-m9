import type { NextApiRequest,NextApiResponse } from "next";
import { authMiddleware } from "lib/controllers/middleware";
import methods from "micro-method-router"
import { getUserOrders } from "lib/controllers/orders";


async function getHandler(req:NextApiRequest,res:NextApiResponse,result){
    const userOrders = await getUserOrders(result.id)
    if(!userOrders){
        res.status(404).send({message:"No se ha encontrado"})
    }
    res.send(userOrders)    
}


const handler = methods({
    get:getHandler,
})

export default authMiddleware(handler)
