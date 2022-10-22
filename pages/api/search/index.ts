import type { NextApiRequest, NextApiResponse } from "next";
import { searchProducts } from "lib/controllers/algolia";
import methods from "micro-method-router"
import * as yup from 'yup'

const querySchema = yup.object().shape({
    search: yup.string().required(),
})

export default methods({ 
  async get(req: NextApiRequest, res: NextApiResponse) {
    try{
      await querySchema.validate(req.query)
    }catch(e){
    res.status(400).send(e)

    }
    try{
    const {search} = req.query
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
