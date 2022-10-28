import { Auth } from "lib/models/auth";
import { User } from "lib/models/user";
import addMinutes from "date-fns/addMinutes"
import gen from "random-seed"
import { sendEmail } from "./sendgrid";
import { generateToken } from "./jwt";

const seed = process.env.RANDOM_SEED
const random = gen.create(seed)

export default async function findOrCreateAuth(data){
    const auth = await Auth.findByEmail(data.email)
    
    if(auth){
        //get
        return auth
    }
    
        //create
        const newUser = await User.createNewUser({
            email:data.email.trim().toLowerCase()
        })

        
        const newAuth = await Auth.createNewAuth({
            email:data.email.trim().toLowerCase(),
            userId: newUser.id,
            code:"",
            expires: new Date()
        })
        
        return newAuth
    
}

export async function sendCode(data){
    const auth = await findOrCreateAuth(data)
    const code = random.intBetween(10000,99999)
    const now = new Date()
    const minutesFromNow = addMinutes(now,20)
    auth.data.code = code
    auth.data.expires = minutesFromNow
    await auth.push()
    sendEmail(data.email,code)
}

export async function getToken(email,code){
    const auth = await Auth.findByEmail(email)
    const now = new Date()
    const codeIsExpired = auth ? auth.data.expires > now : false
    console.log("esta expirado", codeIsExpired);
    
    const codeIsCorrect = auth ? auth.data.code == code : false 
    console.log("esta correcto", codeIsCorrect);

    if(auth && !codeIsExpired && codeIsCorrect){
        const token = generateToken({userId:auth.data.userId})
        return {token}
    }
    return {error:"Las credenciales no son validas"}
    
}