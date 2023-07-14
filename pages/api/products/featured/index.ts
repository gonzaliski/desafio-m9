import { searchFeatured } from "lib/controllers/algolia";
import { handlerCORS } from "lib/middlewares/middleware";
import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    try {
      const searchRes = await searchFeatured("");
      res.send({
        results: searchRes.results.hits.map((h) => {
          return {
            id: h.objectID,
            title: h["name"],
            price: h["price"],
            imageUrl: h["imageUrl"],
            stock: h["stock"],
          };
        }),
      });
    } catch (e) {
      res.status(404).send({ message: "Not found" });
    }
  },
});

export default handlerCORS(handler);
