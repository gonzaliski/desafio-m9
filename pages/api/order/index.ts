import type { NextApiRequest,NextApiResponse } from "next";
import { retrieveUserData } from "lib/controllers/user";
import { authMiddleware } from "lib/controllers/middleware";
import { generateOrder } from "lib/controllers/mercadopago";
import method from "micro-method-router"

async function postHandler(req:NextApiRequest,res:NextApiResponse,result){
    const user = await retrieveUserData(result.id)
    const {productId} = req.query
    if(!productId){
        res.status(404).send("No se ha enviado un producto")
    }
    const mercadoPagoResponse = await generateOrder(productId,req.body,result.id,user.email)
    res.send(mercadoPagoResponse)    
}

const handler = method({
    post:postHandler
})

export default authMiddleware(handler)