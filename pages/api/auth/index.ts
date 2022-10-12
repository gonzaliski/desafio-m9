import type { NextApiRequest,NextApiResponse } from "next";
import methods from "micro-method-router"
import { sendCode } from "lib/controllers/auth";


export default methods({
    async post(req:NextApiRequest,res:NextApiResponse){
        const auth = await sendCode(req.body.email)
        res.send(auth)
    },

})
