import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, generateAppointmentConfirmationEmail, generateNewAppointmentNotificationEmail } from '@/lib/email'
import { isAdminEmail } from '@/lib/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const createAppointmentSchema = z.object({
  clientEmail: z.string().email(),
  clientName: z.string().optional(),
  timeSlotId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientEmail, clientName, timeSlotId } = createAppointmentSchema.parse(body)

    // Verificar se o horário está disponível
    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id: timeSlotId },
    })

    if (!timeSlot) {
      return NextResponse.json({ error: 'Horário não encontrado' }, { status: 404 })
    }

    if (!timeSlot.isAvailable || timeSlot.isBlocked) {
      return NextResponse.json({ error: 'Horário não está disponível' }, { status: 400 })
    }

    // Verificar se já existe agendamento neste horário
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        timeSlotId,
        status: {
          not: 'cancelled',
        },
      },
    })

    if (existingAppointment) {
      return NextResponse.json({ error: 'Horário já está agendado' }, { status: 400 })
    }

    // Buscar próximo horário disponível para alternativo
    const alternativeSlot = await prisma.timeSlot.findFirst({
      where: {
        isAvailable: true,
        isBlocked: false,
        id: {
          not: timeSlotId,
        },
        date: {
          gte: timeSlot.date,
        },
        appointments: {
          none: {
            status: {
              not: 'cancelled',
            },
          },
        },
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    })

    // Criar agendamento
    const appointment = await prisma.appointment.create({
      data: {
        clientEmail: clientEmail.toLowerCase(),
        clientName,
        timeSlotId,
        alternativeTimeSlotId: alternativeSlot?.id,
        status: 'scheduled',
      },
      include: {
        timeSlot: true,
        alternativeTimeSlot: true,
      },
    })

    // Enviar e-mails
    const mainSlot = {
      date: appointment.timeSlot.date,
      startTime: appointment.timeSlot.startTime,
      endTime: appointment.timeSlot.endTime,
    }

    const altSlot = appointment.alternativeTimeSlot ? {
      date: appointment.alternativeTimeSlot.date,
      startTime: appointment.alternativeTimeSlot.startTime,
      endTime: appointment.alternativeTimeSlot.endTime,
    } : null

    // E-mail para cliente
    await sendEmail(generateAppointmentConfirmationEmail(
      clientEmail,
      clientName || null,
      mainSlot,
      altSlot
    ))

    // E-mail para admin
    const adminEmail = process.env.ADMIN_EMAIL || 'adriano@personal.com'
    await sendEmail(generateNewAppointmentNotificationEmail(
      adminEmail,
      clientEmail,
      clientName || null,
      mainSlot,
      altSlot
    ))

    return NextResponse.json({ appointment }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    console.error('Erro ao criar agendamento:', error)
    return NextResponse.json({ error: 'Erro ao criar agendamento' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')
    const isAdmin = searchParams.get('admin') === 'true'

    // Verificar autenticação admin
    if (isAdmin) {
      const adminEmail = process.env.ADMIN_EMAIL || 'adriano@personal.com'
      // Em produção, verificar sessão/token aqui
      
      const appointments = await prisma.appointment.findMany({
        where: {
          status: {
            not: 'cancelled',
          },
        },
        include: {
          timeSlot: true,
          alternativeTimeSlot: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return NextResponse.json({ appointments })
    }

    // Cliente vê apenas seus agendamentos
    if (email) {
      const appointments = await prisma.appointment.findMany({
        where: {
          clientEmail: email.toLowerCase(),
          status: {
            not: 'cancelled',
          },
        },
        include: {
          timeSlot: true,
          alternativeTimeSlot: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return NextResponse.json({ appointments })
    }

    return NextResponse.json({ error: 'E-mail necessário' }, { status: 400 })
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    return NextResponse.json({ error: 'Erro ao buscar agendamentos' }, { status: 500 })
  }
}

