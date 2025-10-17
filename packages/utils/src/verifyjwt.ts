import jwt from "jsonwebtoken"

export async function verifyJwt(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string)
  } catch {
    return null
  }
}