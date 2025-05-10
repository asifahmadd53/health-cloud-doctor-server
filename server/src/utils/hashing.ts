import { compare, hash } from "bcryptjs";
import { createHmac } from "crypto";

export const doHash = async (password: string, saltRounds: number): Promise<string> => {
    return await hash(password, saltRounds);
  };
  
  // Compare a password with a hash
  export const doCompare = async (password: string, hash: string): Promise<boolean> => {
    return await compare(password, hash);
  };
  
  // Generate HMAC for tokens
  export const hmacProcess = (data: string, secret: string): string => {
    return createHmac("sha256", secret).update(data).digest("hex");
  };
