import { hash } from "bcryptjs";

export const doHash = async (value:any,salt:any )=>{
    const hashedPassword = hash(value,salt)
    return hashedPassword
}