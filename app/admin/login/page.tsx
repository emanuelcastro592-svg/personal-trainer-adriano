'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

  async function handleRequestOtp() {
    if (!email) {
      setMessage({ type: 'error', text: 'Por favor, informe seu e-mail' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar link de acesso')
      }

      setMessage({ 
        type: 'success', 
        text: 'Link de acesso enviado para seu e-mail! Verifique sua caixa de entrada e clique no link para fazer login.' 
      })
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erro ao enviar link de acesso' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Área do Administrador</CardTitle>
          <CardDescription>
            Acesse o painel administrativo do Personal Trainer Adriano
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert className={message.type === 'error' ? 'border-red-500' : 'border-green-500'}>
              {message.type === 'error' ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-mail Administrativo</Label>
            <Input
              id="email"
              type="email"
              placeholder="adriano@personal.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRequestOtp()
                }
              }}
            />
            <p className="text-xs text-gray-500">
              Um link de acesso será enviado para este e-mail
            </p>
          </div>

          <Button 
            onClick={handleRequestOtp} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Enviando...' : 'Enviar Link de Acesso'}
          </Button>

          <div className="text-center">
            <a 
              href="/" 
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              ← Voltar para a página inicial
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

