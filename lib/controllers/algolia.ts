import { base } from "lib/airtable";
import { getOffsetAndLimit } from "lib/requests";
import { productIndex } from "lib/algolia";

export function syncAlgolia(req){
    const { limit } = getOffsetAndLimit(req, 100, 1000);
      base("Furniture")
        .select({
          pageSize: limit,
        })
        .eachPage(
          async function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
            const objects = records.map(r=>{
                return {
                    objectID:r.id,
                    ...r.fields
                }
            })
            
            await productIndex.saveObjects(objects)
            
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
        return "ok"
}

export async function searchProducts(query, req){
  const { offset, limit } = getOffsetAndLimit(req.query.limit, req.query.offset);
  const results =  await productIndex.search(query as string, {
    hitsPerPage: offset,
    length: limit,
    })
    return {results,offset,limit}
}

export async function getProductData(id){
  return await productIndex.getObject(id)
}

export async function getProductsId(){
  let hits = [];
  await productIndex.browseObjects({
    batch: batch => {
      hits = hits.concat(batch);
    }
  })
  return hits.map(h=>h.objectID)
}