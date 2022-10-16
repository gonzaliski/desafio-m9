import { getMerchantOrder } from "lib/mercadopago";
import { Order } from "lib/models/order";
import { sendPaymentNotif } from "./sendgrid";

export async function processPayment(id,topic){
    console.log(id,topic);
    
    if(topic == "merchant_order"){
        const order = await getMerchantOrder(id)
        if(order.order_status == "paid"){
            const orderId = order.external_reference
            const updateRes = await updateOrderOnDB(orderId,order.order_status)
            sendPaymentNotif(updateRes.email)      
            return updateRes
        }
    }
    return null
}

async function updateOrderOnDB(id,status){
    const order = new Order(id)
    order.pull()
    order.data.status = status
    order.push()
    return {email: order.data.userEmail}
}

export async function getUserOrders(id){
    const result = Order.findUserOrders(id)
    return result
}