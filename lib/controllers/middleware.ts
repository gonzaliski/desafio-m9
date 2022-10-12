import type { NextApiRequest,NextApiResponse } from "next";
import parseToken from "parse-bearer-token"
import { decodeToken } from "lib/controllers/jwt";

export function authMiddleware(callback){
    return function(req:NextApiRequest,res:NextApiResponse){
        const token = parseToken(req)
        if(!token){
            res.status(401).send({error:"no hay token"})
        }
        const decoded = decodeToken(token)

        if(decoded){
            callback(req,res,decoded)
        }else{
            res.status(401).send({error:"token incorrecto"})
        }
    }
}