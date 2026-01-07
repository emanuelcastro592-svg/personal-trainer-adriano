'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate, formatTime, formatDateTime } from '@/lib/utils'
import { Calendar, Clock, X, RefreshCw, AlertCircle } from 'lucide-react'

interface Appointment {
  id: string
  clientEmail: string
  clientName: string | null
  timeSlot: {
    id: string
    date: string
    startTime: string
    endTime: string
  }
  alternativeTimeSlot: {
    id: string
    date: string
    startTime: string
    endTime: string
  } | null
  status: string
  createdAt: string
}

export default function AppointmentsPage() {
  const params = useParams()
  const router = useRouter()
  const email = decodeURIComponent(params.email as string)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null)

  useEffect(() => {
    loadAppointments()
  }, [email])

  async function loadAppointments() {
    try {
      const response = await fetch(`/api/appointments?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
      setMessage({ type: 'error', text: 'Erro ao carregar agendamentos' })
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    if (!appointmentToCancel) return

    try {
      const response = await fetch(`/api/appointments/${appointmentToCancel.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao cancelar agendamento')
      }

      setMessage({ type: 'success', text: 'Agendamento cancelado com sucesso' })
      setCancelDialogOpen(false)
      setAppointmentToCancel(null)
      loadAppointments()
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erro ao cancelar agendamento' 
      })
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-green-600">Agendado</Badge>
      case 'rescheduled':
        return <Badge className="bg-blue-600">Reagendado</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>
      case 'completed':
        return <Badge variant="secondary">Concluído</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="outline" onClick={() => router.push('/')}>
              ← Voltar para Agenda
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Meus Agendamentos</CardTitle>
              <CardDescription>
                E-mail: {email}
              </CardDescription>
            </CardHeader>
          </Card>

          {message && (
            <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
              <AlertCircle className={`h-4 w-4 ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`} />
              <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {appointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 mb-4">Nenhum agendamento encontrado.</p>
                <Button onClick={() => router.push('/')}>
                  Fazer Novo Agendamento
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {formatDate(appointment.timeSlot.date)}
                      </CardTitle>
                      {getStatusBadge(appointment.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-blue-900">Horário Principal</span>
                        </div>
                        <p className="text-lg">
                          {formatTime(appointment.timeSlot.startTime)} - {formatTime(appointment.timeSlot.endTime)}
                        </p>
                      </div>

                      {appointment.alternativeTimeSlot && (
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-900">Horário Alternativo</span>
                          </div>
                          <p className="text-lg">
                            {formatDate(appointment.alternativeTimeSlot.date)} - {formatTime(appointment.alternativeTimeSlot.startTime)} - {formatTime(appointment.alternativeTimeSlot.endTime)}
                          </p>
                          <p className="text-sm text-green-700 mt-1">
                            Reservado como alternativa caso seja necessário reagendar
                          </p>
                        </div>
                      )}

                      {appointment.status !== 'cancelled' && (
                        <div className="flex gap-2 pt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // TODO: Implementar reagendamento
                              setMessage({ type: 'error', text: 'Funcionalidade de reagendamento em desenvolvimento' })
                            }}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reagendar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setAppointmentToCancel(appointment)
                              setCancelDialogOpen(true)
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Agendamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {appointmentToCancel && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold mb-1">
                {formatDate(appointmentToCancel.timeSlot.date)}
              </p>
              <p>
                {formatTime(appointmentToCancel.timeSlot.startTime)} - {formatTime(appointmentToCancel.timeSlot.endTime)}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Não, manter agendamento
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Sim, cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

