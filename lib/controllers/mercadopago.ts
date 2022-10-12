import { Order } from "lib/models/order";


export async function generateOrder(id,data,userId,userEmail){
    const newOrder = await Order.createNewOrder({productId:id,data,userId,userEmail})
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
            notification_url:process.env.NOTIFICATION_URL
          }
          )
    })
    const merchantRes = await fetchMerchantOrder.json()
    console.log(merchantRes);
    
    return {url:merchantRes.init_point, orderId:newOrder.id}
}