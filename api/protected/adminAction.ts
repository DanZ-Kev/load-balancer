import { NextRequest, NextResponse } from 'next/server'
import { verifyJwt, verifyHmac } from '../security/middleware'

export async function POST(req: NextRequest){
  const auth = req.headers.get('authorization') || ''
  if(!auth.startsWith('Bearer ')) return NextResponse.json({error:'unauthenticated'},{status:401})
  const token = auth.split(' ')[1]
  const jwtRes = verifyJwt(token)
  if(!jwtRes.ok) return NextResponse.json({error:'invalid token'},{status:401})

  // verify hmac header for payload integrity
  const body = await req.text()
  const sig = req.headers.get('x-signature') || ''
  const ts = req.headers.get('x-timestamp') || ''
  if(!verifyHmac(body, sig, ts)) return NextResponse.json({error:'invalid signature'},{status:401})

  // audit log -- in production insert to DB
  console.log('Admin action', { actor: jwtRes.payload, ip: req.ip, body: body.slice(0,200) })

  return NextResponse.json({ok:true})
}
