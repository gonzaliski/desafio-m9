import type { NextApiRequest,NextApiResponse } from "next";
import { retrieveUserData, updateUserAddress } from "lib/controllers/user";
import { authMiddleware } from "lib/controllers/middleware";
import methods from "micro-method-router"
import * as yup from 'yup'

const bodySchema = yup.object().shape({
    newAddress: yup.string().required(),
})


async function getHandler(req:NextApiRequest,res:NextApiResponse,result){
    try{
        const newUser = await retrieveUserData(result.id)
        res.send(newUser)    
    }catch(e){
        res.status(400).send(e)
    }
}

async function patchHandler(req:NextApiRequest,res:NextApiResponse,result){
    try{
        await bodySchema.validate(req.body)
    }catch(e){
        res.status(400).send(e)
    }    
    try{
        const updateUserRes = await updateUserAddress(req.body,result.id)
        res.send(updateUserRes)
    }catch(e){
        res.status(400).send(e)
    }
}
const handler = methods({
    get:getHandler,
    patch:patchHandler
})

export default authMiddleware(handler)
