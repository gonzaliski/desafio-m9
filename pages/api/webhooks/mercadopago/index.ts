import type { NextApiRequest,NextApiResponse } from "next";
import methods from "micro-method-router"
import { processPayment } from "lib/controllers/orders";


export default methods({
    async post(req:NextApiRequest,res:NextApiResponse){
        const { id, topic} = req.query
        console.log("este es el webhook",id,topic);
        
        const result = await processPayment(id,topic)
        res.send(result)
    },

})
