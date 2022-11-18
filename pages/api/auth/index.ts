import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { sendCode } from "lib/controllers/auth";
import * as yup from "yup";
import { handlerCORS } from "lib/middlewares/middleware";

const bodySchema = yup.object().shape({
  email: yup.string().required(),
});

const handler = methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    try {
      await bodySchema.validate(req.body);
    } catch (e) {
      res.status(400).send(e);
    }
    try {
      await sendCode(req.body);
      res.send({
        message:
          "you will receive a code in your email, please check your inbox",
      });
    } catch (e) {
      res.status(400).send(e);
    }
  },
});

export default handlerCORS(handler);
