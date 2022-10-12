import type { NextApiRequest,NextApiResponse } from "next";
import methods from "micro-method-router"
import { getToken } from "lib/controllers/auth";


export default methods({
    async post(req:NextApiRequest,res:NextApiResponse){
        const {email,code} = req.body
            const result = await getToken(email,code)
            if(result.token){
                res.send(result.token)
            }else{
                res.status(401).send(result.error)
            }
      
    },

})
