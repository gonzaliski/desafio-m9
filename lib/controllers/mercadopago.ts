import { Order } from "lib/models/order";
import address from "pages/api/me/address";

export async function generateOrder(
  id,
  data,
  userId,
  userEmail,
  address,
  productData
) {
  const newOrder = await Order.createNewOrder({
    productId: id,
    data,
    userId,
    userEmail,
  });
  try {
    const fetchMerchantOrder: any = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "post",
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          items: [
            {
              title: productData.title || "Gonzaliski Item",
              description: productData.desc || "Gonzaliski Item_description",
              picture_url:
                productData.imgUrl || "http://www.myapp.com/myimage.jpg",
              category_id: "furniture",
              quantity: 1,
              currency_id: "ARS",
              unit_price: productData.price || 10,
            },
          ],
          shipments: {
            free_methods: [
              {
                mode: "me2",
              },
            ],
            receiver_address: {
              street_name: address,
            },
          },
          external_reference: newOrder.id,
          notification_url: `https://desafio-m9-lovat.vercel.app/api/webhooks/mercadopago`,
          back_urls: {
            success: "https://desafio-m10-one.vercel.app/thank-you",
          },
        }),
      }
    );
    const merchantRes = await fetchMerchantOrder.json();
    console.log(merchantRes);

    return { url: merchantRes.init_point, orderId: newOrder.id };
  } catch (e) {
    throw e;
  }
}
