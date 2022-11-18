import { getProductsId } from "lib/controllers/algolia";
import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    try {
      const products = await getProductsId();
      res.status(200).send(products);
    } catch (e) {
      res.status(404).send({ message: "No product found" });
    }
  },
});
