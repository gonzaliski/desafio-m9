import type { NextApiRequest,NextApiResponse } from "next";
import { retrieveUserData } from "lib/controllers/user";
import { authMiddleware } from "lib/controllers/middleware";
import { generateOrder } from "lib/controllers/mercadopago";
import method from "micro-method-router"
import * as yup from 'yup'

const bodySchema = yup.object().shape({
    username: yup.string().required(),
})
const querySchema = yup.object().shape({
    username: yup.string().required(),
})


async function postHandler(req:NextApiRequest,res:NextApiResponse,result){
    try{
        await bodySchema.validate(req.body)
        await querySchema.validate(req.query)
    }catch(e){
        res.status(400).send(e)
    }
    try{

        const user = await retrieveUserData(result.id)
        const {productId} = req.query
        if(!productId){
            res.status(404).send("No se ha enviado un producto")
        }
        const mercadoPagoResponse = await generateOrder(productId,req.body,result.id,user.email)
        res.send(mercadoPagoResponse)    
    }catch(e){
        res.status(400).send(e)
    }
}

const handler = method({
    post:postHandler
})

export default authMiddleware(handler)