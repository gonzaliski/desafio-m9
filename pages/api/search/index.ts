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
            title: h["name"],
            description:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt facere animi, enim corrupti saepe, ad harum a voluptatum nostrum facilis dolorum unde non! Distinctio omnis commodi obcaecati iure, assumenda soluta",
            price: h["price"],
            imageUrl: h["imageUrl"],
            additionalImages: [
              h["additionalImageUrls_0"],
              h["additionalImageUrls_1"],
              h["additionalImageUrls_2"],
            ],
            stock: true,
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
