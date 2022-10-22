import type { NextApiRequest,NextApiResponse } from "next";
import methods from "micro-method-router"
import { getToken } from "lib/controllers/auth";
import * as yup from 'yup'

const bodySchema = yup.object().shape({
    email: yup.string().required(),
    code: yup.string().required()
})

export default methods({
    async post(req:NextApiRequest,res:NextApiResponse){
        try{
            await bodySchema.validate(req.body)
        }catch(e){
            res.status(400).send(e)
        }

        try{
                const {email,code} = req.body
                const result = await getToken(email,code)
                res.send(result.token)
            }catch(e){
                res.status(400).send(e)
            }
      
    },

})
