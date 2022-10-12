import { sgMail } from "lib/sendgrid";

export function sendEmail(email,code){
    try{

        const msg = {
            to: `${email}`,
            from: 'petfinder.apx@gmail.com', // Use the email address or domain you verified above
            subject: `Tu codigo de ingreso`,
            text: `
            Codigo: ${code}
            `,
        };
        console.log(msg);
        
        sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            throw error
        })
    }catch(e){
        throw e
    }
}

export function sendPaymentNotif(email){
    try{

        const msg = {
            to: `${email}`,
            from: 'petfinder.apx@gmail.com', // Use the email address or domain you verified above
            subject: `Estado de tu pago`,
            text: `
            Su pago se ha realizado exitosamente
            `,
        };
        console.log(msg);
        
        sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            throw error
        })
    }catch(e){
        throw e
    }
}