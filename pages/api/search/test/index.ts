import { searchFeatured } from "lib/controllers/algolia";
import { handlerCORS } from "lib/middlewares/middleware";
import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

const querySchema = yup.object().shape({
  search: yup.string(),
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
      const searchRes = await searchFeatured(search);
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
      });
    } catch (e) {
      res.status(404).send({ message: "Not found" });
    }
  },
});

export default handlerCORS(handler);
