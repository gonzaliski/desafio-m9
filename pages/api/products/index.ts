import type { NextApiRequest, NextApiResponse } from "next";
import { getProductData, searchProducts } from "lib/controllers/algolia";
import methods from "micro-method-router"

export default methods({ 
  async get(req: NextApiRequest, res: NextApiResponse) {
  const {productId} = req.query
  try{
    const product = await getProductData(productId)
    res.status(200).send(product)
  }catch(e){
    res.status(404).send({message:"No"})
  }
}})