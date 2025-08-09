/**
 * Security middleware helpers for Next.js Serverless API routes
 * - verify JWT RS256 tokens
 * - verify request HMAC signatures (X-Signature + X-Timestamp)
 * - rate limit placeholder (use Redis in production)
 */

import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const PUBLIC_KEY = process.env.JWT_SIGNING_PUBLIC_KEY || 'CHANGE_ME'
const NODE_SECRET = process.env.NODE_REGISTRATION_SECRET || 'CHANGE_ME'

export function verifyJwt(token:string){
  try{
    const payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] })
    return { ok:true, payload }
  }catch(err:any){
    return { ok:false, error: String(err) }
  }
}

export function verifyHmac(body:string, providedSig:string, timestamp:string){
  if(!providedSig) return false
  // timestamp freshness check (60s)
  const ts = parseInt(timestamp || '0', 10)
  const now = Math.floor(Date.now()/1000)
  if(Math.abs(now - ts) > 60) return false
  const expected = crypto.createHmac('sha512', NODE_SECRET).update(body + '|' + timestamp).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected,'hex'), Buffer.from(providedSig,'hex'))
}
