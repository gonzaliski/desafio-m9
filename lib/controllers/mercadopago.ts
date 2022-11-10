import { Order } from "lib/models/order";


export async function generateOrder(id,data,userId,userEmail){
    const newOrder = await Order.createNewOrder({productId:id,data,userId,userEmail})
    try{
    const fetchMerchantOrder:any = await fetch('https://api.mercadopago.com/checkout/preferences',{
        method:'post',
        headers:{
            "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`,
            "Content-Type":"Application/json"
        },
        body: JSON.stringify(
            {
            items: [
              {
                title: "Gonzaliski Remera",
                description: "Gonzaliski description",
                picture_url: "http://www.myapp.com/myimage.jpg",
                category_id: "car_electronics",
                quantity: 1,
                currency_id: "ARS",
                unit_price: 10
              }
            ],
            external_reference: newOrder.id,
            // notification_url:`https://webhook.site/d2016677-6bbb-4e83-a859-39f6945cf782`
            notification_url:`https://desafio-m9-lovat.vercel.app/api/webhooks/mercadopago`
          }
          )
    })
    const merchantRes = await fetchMerchantOrder.json()
    console.log(merchantRes);
    
    return {url:merchantRes.init_point, orderId:newOrder.id}
  }catch(e){
    throw e
  }

}