import type { NextApiRequest, NextApiResponse } from "next";
import { getProductData, searchProducts } from "lib/controllers/algolia";
import methods from "micro-method-router"
import * as yup from 'yup'

const querySchema = yup.object().shape({
    productId: yup.string().required(),
})


export default methods({ 
  async get(req: NextApiRequest, res: NextApiResponse) {
    try{
      await querySchema.validate(req.query)
    }catch(e){
      res.status(400).send(e)
    }
    try{
    const {productId} = req.query
    const product = await getProductData(productId)
    res.status(200).send(product)
  }catch(e){
    res.status(404).send({message:"No"})
  }
}})