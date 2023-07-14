import { base } from "lib/airtable";
import { getOffsetAndLimit } from "lib/requests";
import { productIndex, productAscIndex, productDescIndex } from "lib/algolia";

export function syncAlgolia(req) {
  const { limit } = getOffsetAndLimit(req, 100, 1000);
  base("shoes")
    .select({
      pageSize: limit,
    })
    .eachPage(
      async function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        const objects = records.map((r) => {
          return {
            objectID: r.id,
            ...r.fields,
          };
        });

        await productIndex.saveObjects(objects);

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          throw err;
        }
      }
    );
  return "ok";
}

export async function searchProducts(query, rule, req) {
  const { offset, limit } = getOffsetAndLimit(
    req.query.limit,
    req.query.offset
  );

  let index;
  if (rule == "most-relevant") {
    index = productIndex;
  }
  if (rule == "lower-price") {
    index = productAscIndex;
  }
  if (rule == "higher-price") {
    index = productDescIndex;
  }

  const results = await index.search(query as string, {
    hitsPerPage: offset,
    length: limit,
  });
  return { results, offset, limit };
}
export async function searchFeatured(q?) {
  const results = await productIndex.search(q as string, {
    filters: "featured:true",
    page: 0,
    hitsPerPage: 3,
  });
  console.log(results);

  return { results };
}

export async function getProductData(id) {
  return await productIndex.getObject(id);
}

export async function getProductsId() {
  let hits = [];
  await productIndex.browseObjects({
    batch: (batch) => {
      hits = hits.concat(batch);
    },
  });
  return hits.map((h) => h.objectID);
}
