import { Auth } from "lib/models/auth";
import { User } from "lib/models/user";
import addMinutes from "date-fns/addMinutes"
import gen from "random-seed"
import { sendEmail } from "./sendgrid";
import { generateToken } from "./jwt";

const seed = "asdasdasfgdfg"
const random = gen.create(seed)

export default async function findOrCreateAuth(email){
    const auth = await Auth.findByEmail(email)
    if(auth){
        //get
        return auth
    }else{
        //create
        const newUser = await User.createNewUser({
            email:email.trim().toLowerCase(),
            address:""
        })
        const newAuth = await Auth.createNewAuth({
            email:email.trim().toLowerCase(),
            userId: newUser.id,
            code:"",
            expires: new Date()
        })
        return newAuth
    }
}

export async function sendCode(email){
    const auth = await findOrCreateAuth(email)
    const code = random.intBetween(10000,99999)
    const now = new Date()
    const minutesFromNow = addMinutes(now,20)
    auth.data.code = code
    auth.data.expires = minutesFromNow
    await auth.push()
    sendEmail(email,code)
    return {
        code,expires:minutesFromNow
    }
}

export async function getToken(email,code){
    const auth = await Auth.findByEmail(email)
    console.log("auth",auth);
    const now = new Date()
    const codeIsExpired = auth ? auth.data.expires > now : false
    console.log("esta expirado", codeIsExpired);
    
    const codeIsCorrect = auth ? auth.data.code == code : false 
    console.log("esta correcto", codeIsCorrect);

    if(auth && !codeIsExpired && codeIsCorrect){
        const token = generateToken(auth.data.userId)
        return {token}
    }
    return {error:"Las credenciales no son validas"}
    
}