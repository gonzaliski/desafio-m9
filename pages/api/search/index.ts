import type { NextApiRequest, NextApiResponse } from "next";
import { searchProducts } from "lib/controllers/algolia";
import methods from "micro-method-router";
import * as yup from "yup";
import { handlerCORS } from "lib/middlewares/middleware";

const querySchema = yup.object().shape({
  search: yup.string().required(),
});

const handler = methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    try {
      await querySchema.validate(req.query);
    } catch (e) {
      res.status(400).send(e);
    }
    try {
      const { search } = req.query;
      const searchRes = await searchProducts(search, req);
      res.send({
        results: searchRes.results.hits.map((h) => {
          return {
            objectID: h.objectID,
            title: h["Name"],
            description: h["Description"],
            price: h["Unit cost"],
            images: h["Images"].map((img: any) => img.url),
            stock: h["In stock"],
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
