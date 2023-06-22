import { getProductData } from "lib/controllers/algolia";
import { handlerCORS } from "lib/middlewares/middleware";
import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

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
        id: product.objectID,
        title: product["name"],
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt facere animi, enim corrupti saepe, ad productarum a voluptatum nostrum facilis dolorum unde non! Distinctio omnis commodi obcaecati iure, assumenda soluta",
        price: product["price"],
        images: [
          product["imageUrl"],
          product["additionalImageUrls_0"],
          product["additionalImageUrls_1"],
          product["additionalImageUrls_2"],
        ],
        stock: true,
      });
    } catch (e) {
      res.status(404).send({ message: "No product found" });
    }
  },
});

export default handlerCORS(handler);
