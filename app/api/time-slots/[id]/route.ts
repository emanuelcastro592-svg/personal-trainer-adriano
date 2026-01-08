import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const updateTimeSlotSchema = z.object({
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  duration: z.number().optional(),
  isAvailable: z.boolean().optional(),
  isBlocked: z.boolean().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Em produção, verificar autenticação admin aqui
    const body = await request.json()
    const data = updateTimeSlotSchema.parse(body)

    const timeSlot = await prisma.timeSlot.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json({ timeSlot })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    console.error('Erro ao atualizar horário:', error)
    return NextResponse.json({ error: 'Erro ao atualizar horário' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Em produção, verificar autenticação admin aqui
    
    // Verificar se há agendamentos
    const appointments = await prisma.appointment.findFirst({
      where: {
        OR: [
          { timeSlotId: params.id },
          { alternativeTimeSlotId: params.id },
        ],
        status: {
          not: 'cancelled',
        },
      },
    })

    if (appointments) {
      return NextResponse.json(
        { error: 'Não é possível deletar horário com agendamentos ativos' },
        { status: 400 }
      )
    }

    await prisma.timeSlot.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Horário deletado' })
  } catch (error) {
    console.error('Erro ao deletar horário:', error)
    return NextResponse.json({ error: 'Erro ao deletar horário' }, { status: 500 })
  }
}

