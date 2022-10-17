import { getMerchantOrder } from "lib/mercadopago";
import { Order } from "lib/models/order";
import { sendPaymentNotif } from "./sendgrid";

export async function processPayment(id,topic){
    console.log(id,topic);
    
    if(topic == "merchant_order"){
        const merchantOrder = await getMerchantOrder(id)
        if(merchantOrder.order_status == "paid"){
            const orderId = merchantOrder.external_reference
            const updateRes = await updateOrderOnDB(orderId)
            sendPaymentNotif(updateRes.email)      
            return updateRes
        }
    }
    return null
}

async function updateOrderOnDB(id){
    const order = new Order(id)
    console.log(order);
    await order.pull()
    order.data.status = "paid"
    await order.push()
    return {email: order.data.userEmail}
}

export async function getUserOrders(id){
    const result = Order.findUserOrders(id)
    return result
}