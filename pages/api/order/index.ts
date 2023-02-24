import type { NextApiRequest, NextApiResponse } from "next";
import { retrieveUserData } from "lib/controllers/user";
import { authMiddleware, handlerCORS } from "lib/middlewares/middleware";
import { generateOrder } from "lib/controllers/mercadopago";
import method from "micro-method-router";
import * as yup from "yup";

const bodySchema = yup.object().shape({
  envio: yup.string().required(),
  productData: yup.object().shape({
    title: yup.string(),
    desc: yup.string(),
    price: yup.number(),
    imgUrl: yup.string(),
  }),
});
const querySchema = yup.object().shape({
  productId: yup.string().required(),
});

async function postHandler(req: NextApiRequest, res: NextApiResponse, result) {
  try {
    await bodySchema.validate(req.body);
    await querySchema.validate(req.query);
  } catch (e) {
    res.status(400).send(e);
  }
  try {
    console.log(result);

    const user = await retrieveUserData(result.userId);
    const { productId } = req.query;
    const { address, productData } = req.body;
    const mercadoPagoResponse = await generateOrder(
      productId,
      req.body,
      result.userId,
      user.email,
      address,
      productData
    );
    res.send(mercadoPagoResponse);
  } catch (e) {
    res.status(400).send(e);
  }
}

const handler = method({
  post: postHandler,
});

const authMiddlewareHandler = authMiddleware(handler);

export default handlerCORS(authMiddlewareHandler);
