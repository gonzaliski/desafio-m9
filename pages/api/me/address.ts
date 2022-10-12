import type { NextApiRequest,NextApiResponse } from "next";
import { retrieveUserData } from "lib/controllers/user";
import { authMiddleware } from "lib/controllers/middleware";
import methods from "micro-method-router"

async function getHandler(req:NextApiRequest,res:NextApiResponse,result){
    const newUser = await retrieveUserData(result.id)
    res.send(newUser)    
}

async function patchHandler(req:NextApiRequest,res:NextApiResponse){
    res.send("")
}

const handler = methods({
    get:getHandler,
    patch:patchHandler
})

export default authMiddleware(handler)
