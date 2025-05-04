import { compare, hash } from "bcryptjs";

export const doHash = async (value:any,salt:any )=>{
    const hashedPassword = hash(value,salt)
    return hashedPassword
}

export const doCompare = async(value:any, hashedPassword:any)=>{
    const isMatch = compare(value, hashedPassword)
    return isMatch;
}