import test from "ava"
import { decodeToken, generateToken } from "./jwt"


test("dado un id, se genera un token y al decodificarlo obtenemos ese id",(t)=>{
    const id = {marce:true}
    const testToken = generateToken(id)
    const idFromToken = decodeToken(testToken)
    delete idFromToken.iat 
    t.deepEqual(id,idFromToken)
})
