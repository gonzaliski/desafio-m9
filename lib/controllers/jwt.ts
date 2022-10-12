import * as jwt from "jsonwebtoken"

const SECRET = process.env.SECRET

export function generateToken(param){
    return jwt.sign({id:param},SECRET)
}

export function decodeToken(token){
    return jwt.verify(token,SECRET)
}