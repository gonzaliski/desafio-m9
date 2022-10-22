import type { NextApiRequest,NextApiResponse } from "next";
import methods from "micro-method-router"
import { sendCode } from "lib/controllers/auth";
import * as yup from 'yup'

const bodySchema = yup.object().shape({
    email: yup.string().required(),
    username: yup.string().required(),
    address: yup.string().required(),
})

export default methods({
    async post(req:NextApiRequest,res:NextApiResponse){
        try{
            await bodySchema.validate(req.body)
        }catch(e){
            res.status(400).send(e)
        }
        try{
            const auth = await sendCode(req.body)
            res.send(auth)
        }catch(e){
            res.status(400).send(e)
        }
    },

})
