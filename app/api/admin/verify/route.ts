import { NextRequest, NextResponse } from 'next/server'
import { verifyOtpToken } from '@/lib/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const verifyOtpSchema = z.object({
  email: z.string().email(),
  token: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, token } = verifyOtpSchema.parse(body)

    const isValid = await verifyOtpToken(email, token)

    if (!isValid) {
      return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 })
    }

    // Em produção, criar sessão JWT aqui
    // Por enquanto, retornar sucesso
    return NextResponse.json({ 
      success: true,
      message: 'Autenticação realizada com sucesso',
      // Em produção, retornar token JWT
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    console.error('Erro ao verificar OTP:', error)
    return NextResponse.json({ error: 'Erro ao verificar token' }, { status: 500 })
  }
}

