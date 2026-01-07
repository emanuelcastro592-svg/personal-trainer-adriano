import { NextRequest, NextResponse } from 'next/server'
import { generateOtpToken } from '@/lib/auth'
import { sendEmail, generateOtpEmail } from '@/lib/email'
import { z } from 'zod'

const requestOtpSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = requestOtpSchema.parse(body)

    const token = await generateOtpToken(email)
    const emailData = generateOtpEmail(email, token)
    await sendEmail(emailData)

    return NextResponse.json({ message: 'Link de acesso enviado por e-mail' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'E-mail inválido', details: error.errors }, { status: 400 })
    }
    console.error('Erro ao gerar OTP:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro ao gerar OTP' }, { status: 400 })
  }
}

