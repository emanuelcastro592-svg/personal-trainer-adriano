import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const updateAppointmentSchema = z.object({
  timeSlotId: z.string().uuid().optional(),
  status: z.enum(['scheduled', 'rescheduled', 'cancelled', 'completed']).optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { timeSlotId, status } = updateAppointmentSchema.parse(body)
    const clientEmail = body.clientEmail as string | undefined

    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        timeSlot: true,
        alternativeTimeSlot: true,
      },
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 })
    }

    // Verificar se é o cliente ou admin
    const isClient = clientEmail && appointment.clientEmail.toLowerCase() === clientEmail.toLowerCase()
    // Em produção, verificar autenticação admin aqui

    if (!isClient && status === 'cancelled') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    // Se está reagendando, buscar novo horário alternativo
    let alternativeTimeSlotId = appointment.alternativeTimeSlotId
    if (timeSlotId && timeSlotId !== appointment.timeSlotId) {
      const newTimeSlot = await prisma.timeSlot.findUnique({
        where: { id: timeSlotId },
      })

      if (newTimeSlot) {
        const alternativeSlot = await prisma.timeSlot.findFirst({
          where: {
            isAvailable: true,
            isBlocked: false,
            id: {
              not: timeSlotId,
            },
            date: {
              gte: newTimeSlot.date,
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

        alternativeTimeSlotId = alternativeSlot?.id || null
      }
    }

    // Atualizar agendamento
    const updatedAppointment = await prisma.appointment.update({
      where: { id: params.id },
      data: {
        timeSlotId: timeSlotId || appointment.timeSlotId,
        alternativeTimeSlotId,
        status: status || appointment.status,
      },
      include: {
        timeSlot: true,
        alternativeTimeSlot: true,
      },
    })

    // TODO: Enviar e-mails de notificação

    return NextResponse.json({ appointment: updatedAppointment })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    console.error('Erro ao atualizar agendamento:', error)
    return NextResponse.json({ error: 'Erro ao atualizar agendamento' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 })
    }

    // Marcar como cancelado
    await prisma.appointment.update({
      where: { id: params.id },
      data: {
        status: 'cancelled',
      },
    })

    // TODO: Enviar e-mail de cancelamento

    return NextResponse.json({ message: 'Agendamento cancelado' })
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error)
    return NextResponse.json({ error: 'Erro ao cancelar agendamento' }, { status: 500 })
  }
}

