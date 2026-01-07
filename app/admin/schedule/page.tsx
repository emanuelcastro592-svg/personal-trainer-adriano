'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatTime } from '@/lib/utils'
import { Calendar, Clock, Plus, Edit, Trash2, AlertCircle, X } from 'lucide-react'

interface TimeSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  duration: number
  isAvailable: boolean
  isBlocked: boolean
}

export default function AdminSchedulePage() {
  const router = useRouter()
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    duration: 60,
    isBlocked: false,
  })

  useEffect(() => {
    loadTimeSlots()
  }, [])

  async function loadTimeSlots() {
    try {
      const response = await fetch('/api/time-slots')
      const data = await response.json()
      setTimeSlots(data.timeSlots || [])
    } catch (error) {
      console.error('Erro ao carregar horários:', error)
      setMessage({ type: 'error', text: 'Erro ao carregar horários' })
    } finally {
      setLoading(false)
    }
  }

  function openDialog(slot?: TimeSlot) {
    if (slot) {
      setEditingSlot(slot)
      setFormData({
        date: slot.date,
        startTime: slot.startTime.substring(0, 5),
        endTime: slot.endTime.substring(0, 5),
        duration: slot.duration,
        isBlocked: slot.isBlocked,
      })
    } else {
      setEditingSlot(null)
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        duration: 60,
        isBlocked: false,
      })
    }
    setIsDialogOpen(true)
  }

  async function handleSave() {
    try {
      const url = editingSlot 
        ? `/api/time-slots/${editingSlot.id}`
        : '/api/time-slots'
      
      const method = editingSlot ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          startTime: `${formData.startTime}:00`,
          endTime: `${formData.endTime}:00`,
          isAvailable: !formData.isBlocked,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao salvar horário')
      }

      setMessage({ type: 'success', text: editingSlot ? 'Horário atualizado!' : 'Horário criado!' })
      setIsDialogOpen(false)
      loadTimeSlots()
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erro ao salvar horário' 
      })
    }
  }

  async function handleDelete(slotId: string) {
    if (!confirm('Tem certeza que deseja deletar este horário?')) return

    try {
      const response = await fetch(`/api/time-slots/${slotId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao deletar horário')
      }

      setMessage({ type: 'success', text: 'Horário deletado!' })
      loadTimeSlots()
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erro ao deletar horário' 
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciar Agenda</h1>
              <p className="text-gray-600">Adicione, edite ou remova horários disponíveis</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => openDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Horário
              </Button>
              <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
                Voltar ao Dashboard
              </Button>
            </div>
          </div>

          {message && (
            <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
              <AlertCircle className={`h-4 w-4 ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`} />
              <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Horários Disponíveis</CardTitle>
              <CardDescription>
                Gerencie os horários que aparecem na agenda pública
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center text-gray-500 py-8">Carregando...</p>
              ) : timeSlots.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nenhum horário cadastrado.</p>
              ) : (
                <div className="space-y-2">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-semibold">
                            {formatDate(slot.date)} - {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Duração: {slot.duration} minutos
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {slot.isAvailable && !slot.isBlocked && (
                            <Badge className="bg-green-600">Disponível</Badge>
                          )}
                          {slot.isBlocked && (
                            <Badge variant="destructive">Bloqueado</Badge>
                          )}
                          {!slot.isAvailable && !slot.isBlocked && (
                            <Badge variant="secondary">Agendado</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDialog(slot)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(slot.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSlot ? 'Editar Horário' : 'Novo Horário'}
            </DialogTitle>
            <DialogDescription>
              {editingSlot ? 'Atualize as informações do horário' : 'Adicione um novo horário à agenda'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Horário Início</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Horário Fim</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isBlocked"
                checked={formData.isBlocked}
                onChange={(e) => setFormData({ ...formData, isBlocked: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isBlocked">Bloquear horário (não aparecerá na agenda)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingSlot ? 'Salvar Alterações' : 'Criar Horário'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

