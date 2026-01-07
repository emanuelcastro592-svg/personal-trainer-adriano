'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatTime, formatDateTime } from '@/lib/utils'
import { Calendar, Clock, Users, Settings } from 'lucide-react'

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

export default function AdminDashboardPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAppointments()
  }, [])

  async function loadAppointments() {
    try {
      const response = await fetch('/api/appointments?admin=true')
      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
    } finally {
      setLoading(false)
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

  const activeAppointments = appointments.filter(a => a.status !== 'cancelled')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-600">Painel de controle - Personal Trainer Adriano</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push('/admin/schedule')}>
                <Settings className="h-4 w-4 mr-2" />
                Gerenciar Agenda
              </Button>
              <Button variant="outline" onClick={() => router.push('/')}>
                Ver Site Público
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Total de Agendamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{activeAppointments.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {activeAppointments.filter(a => {
                    const today = new Date().toISOString().split('T')[0]
                    return a.timeSlot.date === today
                  }).length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Esta Semana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {activeAppointments.filter(a => {
                    const appointmentDate = new Date(a.timeSlot.date)
                    const today = new Date()
                    const weekFromNow = new Date(today)
                    weekFromNow.setDate(today.getDate() + 7)
                    return appointmentDate >= today && appointmentDate <= weekFromNow
                  }).length}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agendamentos</CardTitle>
              <CardDescription>
                Lista de todos os agendamentos com dados dos clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center text-gray-500 py-8">Carregando...</p>
              ) : appointments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nenhum agendamento encontrado.</p>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <Card key={appointment.id} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {appointment.clientName || 'Cliente sem nome'}
                            </CardTitle>
                            <CardDescription>
                              {appointment.clientEmail}
                            </CardDescription>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="font-semibold text-blue-900">Horário Principal</span>
                            </div>
                            <p className="text-lg">
                              {formatDate(appointment.timeSlot.date)}
                            </p>
                            <p className="text-lg font-semibold">
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
                                {formatDate(appointment.alternativeTimeSlot.date)}
                              </p>
                              <p className="text-lg font-semibold">
                                {formatTime(appointment.alternativeTimeSlot.startTime)} - {formatTime(appointment.alternativeTimeSlot.endTime)}
                              </p>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-4">
                          Agendado em: {new Date(appointment.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

