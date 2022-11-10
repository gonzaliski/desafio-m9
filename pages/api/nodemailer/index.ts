import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router"
import * as nodemailer from "nodemailer"


export default methods({ 
  async get(req: NextApiRequest, res: NextApiResponse) {
    const {email} = req.body
    const  transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.GMAIL_USER, // generated ethereal user
          pass: process.env.GMAIL_PASS, // generated ethereal password
        },
      });
      transporter.verify().then(()=>{
        console.log('Ready for send emails');
        
      })
      try{await transporter.sendMail({
        from: `Fred Foo 👻 <${process.env.GMAIL_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      })}catch(e){
        res.send(e)
      }
    
    res.status(200)
}})
