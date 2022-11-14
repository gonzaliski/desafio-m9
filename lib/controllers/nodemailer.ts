import { transporter } from "lib/nodemailer";

export async function sendEmail(email, code) {
  try {
    await transporter.sendMail({
      from: `Gonzaliski's Ecommerce <${process.env.GMAIL_USER}>`, // sender address
      to: email, // list of receivers
      subject: "Tu codigo de ingreso ✔", // Subject line
      text: `Hola!, te dejamos tu codigo de ingreso a la web. ${code}`, // plain text body
      html: `<h2>Hola!, te dejamos tu codigo de ingreso a la web.</h2>
      <p>Tu Codigo:</p><b>${code}</b>`, // html body
    });
    console.log(email,code);
    
  } catch (e) {
    throw e;
  }
}

export async function sendPaymentNotif(email) {
    try {
        await transporter.sendMail({
          from: `Gonzaliski's Ecommerce <${process.env.GMAIL_USER}>`, // sender address
          to: email, // list of receivers
          subject: "Pago con exito ✔", // Subject line
          text: `Hola!, te informamos que se ha realizado con exito tu pago.`, // plain text body
          html: "<b>Hola!, te informamos que se ha realizado con exito tu pago.</b>", // html body
        });
      } catch (e) {
        throw e;
}
}
