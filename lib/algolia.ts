import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);

export const productIndex = client.initIndex("shoes");
productIndex
  .setSettings({
    attributesForFaceting: [
      "filterOnly(sizesAvailable)", // or 'filterOnly(categories)' for filtering purposes only
      "filterOnly(featured)", // or 'filterOnly(categories)' for filtering purposes only
    ],
  })
  .then(() => {
    // done
  });
