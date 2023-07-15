import { searchByGenre, searchFeatured } from "lib/controllers/algolia";
import { handlerCORS } from "lib/middlewares/middleware";
import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

const querySchema = yup.object().shape({
  genre: yup.string().oneOf(["men", "female"]).required(),
  rule: yup.string().oneOf(["most-relevant", "lower-price", "higher-price"]),
});

const handler = methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    try {
      await querySchema.validate(req.query);
    } catch (e) {
      res.status(400).send(e);
    }
    try {
      const { genre, rule } = req.query;
      const searchRes = await searchByGenre(
        genre as string,
        rule as string,
        req
      );
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
