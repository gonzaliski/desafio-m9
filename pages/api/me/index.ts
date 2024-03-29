import type { NextApiRequest, NextApiResponse } from "next";
import {
  retrieveUserData,
  updateUser,
  updateUserAddress,
} from "lib/controllers/user";
import { authMiddleware, handlerCORS } from "lib/middlewares/middleware";
import methods from "micro-method-router";
import * as yup from "yup";

const bodySchema = yup.object().shape({
  username: yup.string(),
  telephone: yup.number(),
  default: undefined,
});

async function getHandler(req: NextApiRequest, res: NextApiResponse, result) {
  const newUser = await retrieveUserData(result.userId);
  res.send(newUser);
}

async function patchHandler(req: NextApiRequest, res: NextApiResponse, result) {
  try {
    await bodySchema.validate(req.body);
  } catch (e) {
    res.status(400).send(e);
  }
  try {
    if (JSON.stringify(req.body) == "{}") {
      return res.send("no data sent");
    }
    const updateUserRes = await updateUser(req.body, result.userId);
    res.send(updateUserRes);
  } catch (e) {
    res.status(400).send(e);
  }
}

const handler = methods({
  get: getHandler,
  patch: patchHandler,
});

const authMiddlewareHandler = authMiddleware(handler);

export default handlerCORS(authMiddlewareHandler);
