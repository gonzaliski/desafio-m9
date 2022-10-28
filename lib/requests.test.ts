import test from "ava"
import { getOffsetAndLimit } from "./requests"


test("el offset si se pasa de 1000 es 0",(t)=>{
    const res = getOffsetAndLimit(10,20000)
    console.log(res)
    t.deepEqual(res.offset,0)
})
test("el limit si se pasa de 200 es 100",(t)=>{
    const res = getOffsetAndLimit(300,100)
    console.log(res)
    t.deepEqual(res.limit,100)
})