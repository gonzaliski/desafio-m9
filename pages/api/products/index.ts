import type { NextApiRequest, NextApiResponse } from "next";
import { getProductData, searchProducts } from "lib/controllers/algolia";
import methods from "micro-method-router";
import * as yup from "yup";
import { handlerCORS } from "lib/middlewares/middleware";

const querySchema = yup.object().shape({
  productId: yup.string().required(),
});

const handler = methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    try {
      await querySchema.validate(req.query);
    } catch (e) {
      res.status(400).send(e);
    }
    try {
      const { productId } = req.query;
      const product = await getProductData(productId);
      res.status(200).send({
        objectID: product.objectID,
        title: product["Name"],
        description: product["Description"],
        price: product["Unit cost"],
        images: product["Images"].map((img: any) => img.url),
        stock: product["In stock"],
      });
    } catch (e) {
      res.status(404).send({ message: "No product found" });
    }
  },
});

export default handlerCORS(handler);
