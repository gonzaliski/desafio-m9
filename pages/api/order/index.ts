import type { NextApiRequest, NextApiResponse } from "next";
import { retrieveUserData } from "lib/controllers/user";
import { authMiddleware, handlerCORS } from "lib/middlewares/middleware";
import { generateOrder } from "lib/controllers/mercadopago";
import method from "micro-method-router";
import * as yup from "yup";

const bodySchema = yup.object().shape({
  envio: yup.string().required(),
  products: yup.array().of(
    yup.object().shape({
      title: yup.string(),
      size: yup.string(),
      price: yup.number(),
      imgUrl: yup.string(),
    })
  ),
});

async function postHandler(req: NextApiRequest, res: NextApiResponse, result) {
  try {
    await bodySchema.validate(req.body);
  } catch (e) {
    res.status(400).send(e);
  }
  try {
    const user = await retrieveUserData(result.userId);
    const { address, products } = req.body;
    const mercadoPagoResponse = await generateOrder(
      req.body,
      result.userId,
      user.email,
      address,
      products
    );
    res.send(mercadoPagoResponse);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
}

const handler = method({
  post: postHandler,
});

const authMiddlewareHandler = authMiddleware(handler);

export default handlerCORS(authMiddlewareHandler);
