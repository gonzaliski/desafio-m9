import * as jwt from "jsonwebtoken"

const SECRET = process.env.SECRET

export function generateToken(param){
    return jwt.sign(param,SECRET)
}

export function decodeToken(token:string){
    return jwt.verify(token,SECRET)
}