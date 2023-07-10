import type { NextApiRequest, NextApiResponse } from "next";
import { searchProducts } from "lib/controllers/algolia";
import methods from "micro-method-router";
import * as yup from "yup";
import { handlerCORS } from "lib/middlewares/middleware";

const querySchema = yup.object().shape({
  search: yup.string(),
  rule: yup
    .string()
    .oneOf(["most-relevant", "lower-price", "higher-price"])
    .required(),
});

const handler = methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    try {
      await querySchema.validate(req.query);
    } catch (e) {
      res.status(400).send(e);
    }
    try {
      const { search, rule } = req.query;
      const searchRes = await searchProducts(search, rule, req);
      console.log(searchRes);
      res.send({
        results: searchRes.results.hits.map((h) => {
          return {
            id: h.objectID,
            title: h["name"],
            price: h["price"],
            imageUrl: h["imageUrl"],
            sizesAvaiable: h["sizesAvaiable"],
            stock: h["stock"],
          };
        }),
        pagination: {
          offset: searchRes.offset,
          limit: searchRes.limit,
          total: searchRes.results.nbHits,
        },
      });
    } catch (e) {
      res.status(404).send({ message: "Not found" });
    }
  },
});

export default handlerCORS(handler);
