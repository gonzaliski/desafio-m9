import test from "ava"
import { decodeToken, generateToken } from "./jwt"


test("dado un id, se genera un token y al decodificarlo obtenemos ese id",(t)=>{
    const id = "12324test"
    const testToken = generateToken({id})
    const idFromToken = decodeToken(testToken)
    t.deepEqual(id,idFromToken)
})
