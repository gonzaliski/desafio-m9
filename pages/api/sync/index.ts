import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router"
import { syncAlgolia } from "lib/controllers/algolia";

export default methods({
   get(req: NextApiRequest, res: NextApiResponse) {
    try{
      const syncRes = syncAlgolia(req)
      res.status(200).send({message:syncRes})
    }catch(e){
      res.status(503).send({message:"not working"})
    }
  },
})
