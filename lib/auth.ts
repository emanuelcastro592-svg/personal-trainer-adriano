import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'adriano@personal.com'
const OTP_EXPIRATION_MINUTES = parseInt(process.env.OTP_EXPIRATION_MINUTES || '15')

export async function generateOtpToken(email: string): Promise<string> {
  // Verificar se é e-mail admin
  if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    throw new Error('Este e-mail não tem permissão de administrador')
  }

  // Gerar token aleatório
  const token = crypto.randomBytes(32).toString('hex')
  const hashedToken = await bcrypt.hash(token, 10)

  // Calcular expiração
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRATION_MINUTES)

  // Salvar no banco
  await prisma.otpToken.create({
    data: {
      email: email.toLowerCase(),
      token: hashedToken,
      expiresAt,
    },
  })

  return token
}

export async function verifyOtpToken(email: string, token: string): Promise<boolean> {
  const otpToken = await prisma.otpToken.findFirst({
    where: {
      email: email.toLowerCase(),
      used: false,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (!otpToken) {
    return false
  }

  const isValid = await bcrypt.compare(token, otpToken.token)

  if (isValid) {
    // Marcar como usado
    await prisma.otpToken.update({
      where: { id: otpToken.id },
      data: { used: true },
    })
  }

  return isValid
}

export function isAdminEmail(email: string): boolean {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
}

