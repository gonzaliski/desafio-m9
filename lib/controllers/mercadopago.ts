import { Order } from "lib/models/order";

type productData = {
  id: string;
  title: string;
  desc: string;
  price: string;
  imgUrl: string;
};
export async function generateOrder(
  data: string,
  userId: string,
  userEmail: string,
  address: string,
  products: productData[]
) {
  const newOrder = await Order.createNewOrder({
    productsId: products.map((p) => p.id),
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
          items: products.map((p) => {
            return {
              title: p.title || "Gonzaliski Item",
              description: "Prenda de e-commerce",
              picture_url: p.imgUrl,
              category_id: "clothes",
              quantity: 1,
              currency_id: "ARS",
              unit_price: p.price,
            };
          }),

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
