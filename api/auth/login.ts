import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Pool } from 'pg'
// Redis client would be used for rate limiting & lockouts; placeholder here

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const PRIVATE_KEY = process.env.JWT_SIGNING_PRIVATE_KEY || 'CHANGE_ME'

export async function POST(req: NextRequest){
  const { email, password } = await req.json()
  if(!email || !password) return NextResponse.json({error:'missing'},{status:400})
  const r = await pool.query('SELECT id,password_hash FROM users WHERE email=$1', [email])
  const user = r.rows[0]
  if(!user) return NextResponse.json({error:'invalid credentials'},{status:401})
  const ok = await bcrypt.compare(password, user.password_hash)
  if(!ok){
    // increment lockout counter in Redis (not implemented)
    return NextResponse.json({error:'invalid credentials'},{status:401})
  }
  const token = jwt.sign({ sub: user.id, email }, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: '15m' })
  return NextResponse.json({ token })
}
