import type { NextApiRequest,NextApiResponse } from "next";
import methods from "micro-method-router"
import { processPayment } from "lib/controllers/orders";
import { sendEmail, sendPaymentNotif } from "lib/controllers/sendgrid";


export default methods({
    async get(req:NextApiRequest,res:NextApiResponse){
        const { id, topic} = req.query
        console.log("este es el webhook",id,topic);
        
        const result = await processPayment(id,topic)
        if(!result){
            res.status(404).send({message:"No se ha podido concretar el pago"})
        }
        sendPaymentNotif(result.email)        
        res.send(result)
    },

})
