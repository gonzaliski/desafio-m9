import type { NextApiRequest, NextApiResponse } from "next";
import { searchProducts } from "lib/controllers/algolia";
import methods from "micro-method-router"

export default methods({ 
  async get(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.query.search);
  const {search} = req.query
  try{
    const searchRes = await searchProducts(search, req)
    res.send({
      results: searchRes.results,
      pagination: {
        offset: searchRes.offset,
        limit: searchRes.limit,
        total: searchRes.results.nbHits
      }
    })
  }catch(e){
    res.status(404).send({message:"Not found"})
  }
}})
