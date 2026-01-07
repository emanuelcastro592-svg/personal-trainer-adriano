'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatDate, formatTime, formatDateTime } from '@/lib/utils'
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

interface TimeSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  duration: number
  isAvailable: boolean
  isBlocked: boolean
}

export default function Home() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [clientEmail, setClientEmail] = useState('')
  const [clientName, setClientName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })

  useEffect(() => {
    loadTimeSlots()
  }, [selectedDate])

  async function loadTimeSlots() {
    try {
      const response = await fetch(`/api/time-slots?date=${selectedDate}`)
      const data = await response.json()
      setTimeSlots(data.timeSlots || [])
    } catch (error) {
      console.error('Erro ao carregar horários:', error)
    }
  }

  async function handleAppointment() {
    if (!selectedSlot || !clientEmail) {
      setMessage({ type: 'error', text: 'Preencha seu e-mail para continuar' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail,
          clientName: clientName || undefined,
          timeSlotId: selectedSlot.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar agendamento')
      }

      setMessage({ 
        type: 'success', 
        text: 'Agendamento realizado com sucesso! Verifique seu e-mail para mais detalhes.' 
      })
      setIsDialogOpen(false)
      setClientEmail('')
      setClientName('')
      setSelectedSlot(null)
      loadTimeSlots()
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erro ao criar agendamento' 
      })
    } finally {
      setLoading(false)
    }
  }

  function handleSlotClick(slot: TimeSlot) {
    if (!slot.isAvailable) return
    setSelectedSlot(slot)
    setIsDialogOpen(true)
  }

  const availableSlots = timeSlots.filter(s => s.isAvailable)
  const bookedSlots = timeSlots.filter(s => !s.isAvailable && !s.isBlocked)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                💪 Personal Trainer Adriano
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Transforme seu corpo, transforme sua vida
              </p>
            </div>
            <a 
              href="/admin/login" 
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Admin →
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-6 shadow-lg">
              <Calendar className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Agende Sua Sessão
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Escolha o melhor horário para sua sessão de treino personalizado
            </p>
          </div>

          {message && (
            <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
              <AlertCircle className={`h-4 w-4 ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`} />
              <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <Card className="mb-6 shadow-xl border-0 glass-effect">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="h-6 w-6" />
                Selecionar Data
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="text-lg py-3"
              />
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 glass-effect">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="h-6 w-6" />
                Horários Disponíveis
              </CardTitle>
              <CardDescription className="text-white/90">
                {formatDate(selectedDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {timeSlots.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Nenhum horário disponível para esta data.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {timeSlots.map((slot) => {
                    const isAvailable = slot.isAvailable
                    const isBooked = !isAvailable && !slot.isBlocked

                    return (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotClick(slot)}
                        disabled={!isAvailable}
                        className={`
                          p-5 rounded-xl border-2 transition-all text-left transform hover:scale-105
                          ${isAvailable 
                            ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-green-50 hover:border-emerald-500 hover:shadow-lg cursor-pointer shadow-md' 
                            : isBooked
                            ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60'
                            : 'border-red-300 bg-red-50 cursor-not-allowed opacity-60'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-lg">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </span>
                          {isAvailable && (
                            <Badge variant="default" className="bg-green-600">
                              Disponível
                            </Badge>
                          )}
                          {isBooked && (
                            <Badge variant="secondary">
                              Agendado
                            </Badge>
                          )}
                          {slot.isBlocked && (
                            <Badge variant="destructive">
                              Bloqueado
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Duração: {slot.duration} minutos
                        </p>
                      </button>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              © 2024 Personal Trainer Adriano - Todos os direitos reservados
            </p>
            <p className="text-sm text-gray-500">
              Sistema de agendamento desenvolvido com ❤️
            </p>
          </div>
        </div>
      </footer>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Agendamento</DialogTitle>
            <DialogDescription>
              Preencha seus dados para confirmar o agendamento
            </DialogDescription>
          </DialogHeader>
          
          {selectedSlot && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-1">Horário Selecionado</p>
                <p className="text-lg font-semibold">
                  {formatDateTime(selectedSlot.date, selectedSlot.startTime)}
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Um horário alternativo será reservado automaticamente
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome (opcional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAppointment} disabled={loading}>
              {loading ? 'Agendando...' : 'Confirmar Agendamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

