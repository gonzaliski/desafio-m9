import {
  addItemToCart,
  deleteItemFromCart,
  retrieveShoppingCart,
} from "lib/controllers/user";
import { authMiddleware, handlerCORS } from "lib/middlewares/middleware";
import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

const bodySchema = yup.object().shape({
  product: yup
    .object()
    .shape({
      id: yup.string(),
      image: yup.string(),
      price: yup.number(),
      title: yup.string(),
    })
    .required(),
});
const querySchema = yup.object().shape({
  productId: yup.string().required(),
});

async function getHandler(req: NextApiRequest, res: NextApiResponse, result) {
  try {
    const newUser = await retrieveShoppingCart(result.userId);
    res.send(newUser);
  } catch (e) {
    res.status(400).send(e);
  }
}

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  result
) {
  try {
    await querySchema.validate(req.query);
    const { productId } = req.query;
    await deleteItemFromCart(productId as string, result.userId);
    res.status(200).send({ message: "ok" });
  } catch (e) {
    res.status(400).send(e);
  }
}

async function patchHandler(req: NextApiRequest, res: NextApiResponse, result) {
  try {
    await bodySchema.validate(req.body);
  } catch (e) {
    res.status(400).send("Error al enviar información del producto");
  }
  try {
    await addItemToCart(req.body.product, result.userId);
    res.status(200).send({ message: "ok" });
  } catch (e) {
    res.status(400).send(e);
  }
}
const handler = methods({
  get: getHandler,
  delete: deleteHandler,
  patch: patchHandler,
});

const authMiddlewareHandler = authMiddleware(handler);

export default handlerCORS(authMiddlewareHandler);
