import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);

export const productIndex = client.initIndex("shoes");
export const productAscIndex = client.initIndex("products_asc_price");
export const productDescIndex = client.initIndex("products_desc_price");
productIndex
  .setSettings({
    attributesForFaceting: [
      "price",
      "filterOnly(sizesAvailable)", // or 'filterOnly(categories)' for filtering purposes only
      "filterOnly(featured)", // or 'filterOnly(categories)' for filtering purposes only
      "filterOnly(genre)", // or 'filterOnly(categories)' for filtering purposes only
    ],
  })
  .then(() => {
    // done
  });
