// Sistema de e-mail simplificado para desenvolvimento
// Em produção, substitua por Resend, SendGrid, etc.

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@personal.com'

export interface EmailData {
  to: string
  subject: string
  html: string
}

export async function sendEmail(data: EmailData): Promise<void> {
  // Em desenvolvimento, apenas loga no console
  // Em produção, use um serviço real de e-mail
  console.log('='.repeat(50))
  console.log('📧 E-MAIL ENVIADO')
  console.log('='.repeat(50))
  console.log('Para:', data.to)
  console.log('Assunto:', data.subject)
  console.log('Conteúdo HTML:')
  console.log(data.html)
  console.log('='.repeat(50))

  // TODO: Implementar envio real com Resend/SendGrid
  // if (process.env.EMAIL_PROVIDER_API_KEY) {
  //   // Implementar envio real
  // }
}

export function generateOtpEmail(email: string, token: string): EmailData {
  const loginUrl = `${APP_URL}/admin/verify?email=${encodeURIComponent(email)}&token=${token}`

  return {
    to: email,
    subject: 'Link de Acesso - Personal Trainer Adriano',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Link de Acesso - Admin</h2>
            <p>Olá,</p>
            <p>Você solicitou acesso ao painel administrativo. Clique no link abaixo para fazer login:</p>
            <a href="${loginUrl}" class="button">Acessar Painel Admin</a>
            <p>Este link expira em 15 minutos.</p>
            <p>Se você não solicitou este acesso, ignore este e-mail.</p>
            <div class="footer">
              <p>Personal Trainer Adriano</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function generateAppointmentConfirmationEmail(
  clientEmail: string,
  clientName: string | null,
  mainSlot: { date: string; startTime: string; endTime: string },
  altSlot: { date: string; startTime: string; endTime: string } | null
): EmailData {
  const appointmentsUrl = `${APP_URL}/appointments/${encodeURIComponent(clientEmail)}`

  return {
    to: clientEmail,
    subject: 'Agendamento Confirmado - Personal Trainer Adriano',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .slot { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Agendamento Confirmado! 🎉</h2>
            <p>Olá ${clientName || 'Cliente'},</p>
            <p>Seu agendamento foi confirmado com sucesso!</p>
            
            <div class="slot">
              <h3>Horário Principal</h3>
              <p><strong>Data:</strong> ${formatDate(mainSlot.date)}</p>
              <p><strong>Horário:</strong> ${mainSlot.startTime.substring(0, 5)} - ${mainSlot.endTime.substring(0, 5)}</p>
            </div>

            ${altSlot ? `
            <div class="slot">
              <h3>Horário Alternativo</h3>
              <p><strong>Data:</strong> ${formatDate(altSlot.date)}</p>
              <p><strong>Horário:</strong> ${altSlot.startTime.substring(0, 5)} - ${altSlot.endTime.substring(0, 5)}</p>
              <p><em>Este horário foi reservado como alternativa caso seja necessário reagendar.</em></p>
            </div>
            ` : ''}

            <p><a href="${appointmentsUrl}" class="button">Ver Meus Agendamentos</a></p>
            
            <div class="footer">
              <p>Personal Trainer Adriano</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function generateNewAppointmentNotificationEmail(
  adminEmail: string,
  clientEmail: string,
  clientName: string | null,
  mainSlot: { date: string; startTime: string; endTime: string },
  altSlot: { date: string; startTime: string; endTime: string } | null
): EmailData {
  return {
    to: adminEmail,
    subject: 'Novo Agendamento - Personal Trainer Adriano',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .slot { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .client-info { background: #e3f2fd; padding: 15px; margin: 10px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Novo Agendamento Recebido</h2>
            
            <div class="client-info">
              <h3>Dados do Cliente</h3>
              <p><strong>Nome:</strong> ${clientName || 'Não informado'}</p>
              <p><strong>E-mail:</strong> ${clientEmail}</p>
            </div>

            <div class="slot">
              <h3>Horário Principal</h3>
              <p><strong>Data:</strong> ${formatDate(mainSlot.date)}</p>
              <p><strong>Horário:</strong> ${mainSlot.startTime.substring(0, 5)} - ${mainSlot.endTime.substring(0, 5)}</p>
            </div>

            ${altSlot ? `
            <div class="slot">
              <h3>Horário Alternativo</h3>
              <p><strong>Data:</strong> ${formatDate(altSlot.date)}</p>
              <p><strong>Horário:</strong> ${altSlot.startTime.substring(0, 5)} - ${altSlot.endTime.substring(0, 5)}</p>
            </div>
            ` : ''}
          </div>
        </body>
      </html>
    `,
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

