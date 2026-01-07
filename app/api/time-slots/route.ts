import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createTimeSlotSchema = z.object({
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  duration: z.number().optional(),
  isBlocked: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Em produção, verificar autenticação admin aqui
    const body = await request.json()
    const { date, startTime, endTime, duration = 60, isBlocked = false } = createTimeSlotSchema.parse(body)

    // Criar usuário admin se não existir
    const adminEmail = process.env.ADMIN_EMAIL || 'adriano@personal.com'
    let adminUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          role: 'admin',
        },
      })
    }

    const timeSlot = await prisma.timeSlot.create({
      data: {
        date,
        startTime,
        endTime,
        duration,
        isAvailable: !isBlocked,
        isBlocked,
        createdBy: adminUser.id,
      },
    })

    return NextResponse.json({ timeSlot }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    console.error('Erro ao criar horário:', error)
    return NextResponse.json({ error: 'Erro ao criar horário' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')

    const where: any = {}
    if (date) {
      where.date = date
    }

    const timeSlots = await prisma.timeSlot.findMany({
      where,
      include: {
        appointments: {
          where: {
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

    // Para clientes, não mostrar dados dos agendamentos
    const publicTimeSlots = timeSlots.map(slot => ({
      id: slot.id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration: slot.duration,
      isAvailable: slot.isAvailable && !slot.isBlocked && slot.appointments.length === 0,
      isBlocked: slot.isBlocked,
    }))

    return NextResponse.json({ timeSlots: publicTimeSlots })
  } catch (error) {
    console.error('Erro ao buscar horários:', error)
    return NextResponse.json({ error: 'Erro ao buscar horários' }, { status: 500 })
  }
}

