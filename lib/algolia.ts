import algoliasearch from "algoliasearch"

const client = algoliasearch("Q7IT8IVN8O", "730533086d8b04f621a940d603128c11");
export const productIndex = client.initIndex("products");