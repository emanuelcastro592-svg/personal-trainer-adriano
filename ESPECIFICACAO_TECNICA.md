# Especificação Técnica - Sistema de Agendamento Personal Trainer

## Visão Geral
Sistema web para agendamento de sessões com o personal trainer Adriano, desenvolvido em Next.js, React e Shadcn UI.

---

## Stack Tecnológica

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Componentes**: Shadcn UI
- **Autenticação**: OTP via e-mail (Magic Link)
- **Banco de Dados**: (A definir - sugerido: PostgreSQL com Prisma ou Supabase)
- **E-mail**: (A definir - sugerido: Resend, SendGrid ou Nodemailer)
- **ORM**: (A definir - sugerido: Prisma)

---

## Personas e Permissões

### 1. Cliente (Usuário Público)
- **Acesso**: Público, sem autenticação obrigatória
- **Identificação**: E-mail (opcional na primeira visualização)
- **Permissões**:
  - Visualizar agenda disponível do Adriano
  - Fazer agendamentos
  - Ver seus próprios agendamentos (via e-mail)
  - Reagendar seus próprios agendamentos
  - Cancelar seus próprios agendamentos
  - **NÃO pode ver**: Quem mais agendou, dados de outros clientes

### 2. Adriano (Administrador)
- **Acesso**: Autenticado via OTP (Magic Link)
- **E-mail Admin**: Configurável (ex: adriano@personal.com)
- **Permissões**:
  - Gerenciar agenda (criar, editar, deletar horários)
  - Visualizar todos os agendamentos
  - Ver dados dos clientes que agendaram
  - Receber notificações de novos agendamentos
  - Cancelar qualquer agendamento

---

## Regras de Negócio

### RB-01: Visualização da Agenda
- A agenda é pública e pode ser visualizada por qualquer pessoa
- Exibe apenas horários disponíveis e ocupados (sem mostrar dados do cliente)
- Horários ocupados aparecem como "Agendado" (sem identificação do cliente)

### RB-02: Agendamento
- Qualquer pessoa pode agendar usando seu e-mail
- **Primeira vez**: Não requer OTP, apenas informar e-mail
- **Horário alternativo obrigatório**: Ao agendar um horário, o sistema deve automaticamente sugerir e reservar um horário alternativo
- O horário alternativo serve como backup caso o Adriano precise reagendar
- Cliente recebe confirmação por e-mail com ambos os horários

### RB-03: Horário Alternativo
- Quando um cliente agenda um horário principal, o sistema deve:
  1. Verificar o próximo horário disponível mais próximo
  2. Reservar automaticamente esse horário como alternativo
  3. Informar o cliente sobre ambos os horários
  4. Permitir que o cliente troque entre os horários se desejar

### RB-04: Reagendamento
- Cliente pode reagendar seus próprios agendamentos
- Ao reagendar, o sistema deve:
  - Liberar o horário anterior
  - Sugerir novo horário alternativo
  - Notificar o Adriano sobre a mudança

### RB-05: Cancelamento
- Cliente pode cancelar seus próprios agendamentos
- Adriano pode cancelar qualquer agendamento
- Ao cancelar, o horário volta a ficar disponível
- Notificações são enviadas para ambas as partes

### RB-06: Gerenciamento de Agenda (Admin)
- Adriano pode:
  - Adicionar novos horários disponíveis
  - Editar horários existentes (data, hora, duração)
  - Deletar horários (com validação se houver agendamentos)
  - Bloquear horários (tornar indisponível temporariamente)

### RB-07: Notificações por E-mail
- **Cliente recebe**:
  - Confirmação de agendamento (com horário principal e alternativo)
  - Lembrete antes do agendamento (ex: 24h antes)
  - Confirmação de reagendamento
  - Confirmação de cancelamento
  
- **Adriano recebe**:
  - Novo agendamento (com dados do cliente)
  - Reagendamento (com dados do cliente e horários)
  - Cancelamento (com dados do cliente)

### RB-08: Autenticação Admin (OTP)
- Adriano acessa com e-mail específico configurado
- Sistema envia link mágico (Magic Link) por e-mail
- Link expira após tempo determinado (ex: 15 minutos)
- Após clicar no link, Adriano tem sessão autenticada
- Sessão pode ter expiração configurável

---

## Estrutura de Dados

### Tabela: `users`
```typescript
{
  id: string (UUID)
  email: string (unique)
  name?: string
  role: 'client' | 'admin'
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Tabela: `time_slots` (Horários Disponíveis)
```typescript
{
  id: string (UUID)
  date: Date
  startTime: Time
  endTime: Time
  duration: number (minutos)
  isAvailable: boolean
  isBlocked: boolean (bloqueado pelo admin)
  createdBy: string (userId - admin)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Tabela: `appointments` (Agendamentos)
```typescript
{
  id: string (UUID)
  clientEmail: string
  clientName?: string
  timeSlotId: string (horário principal)
  alternativeTimeSlotId?: string (horário alternativo)
  status: 'scheduled' | 'rescheduled' | 'cancelled' | 'completed'
  notes?: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Tabela: `otp_tokens` (Tokens OTP)
```typescript
{
  id: string (UUID)
  email: string
  token: string (hashed)
  expiresAt: DateTime
  used: boolean
  createdAt: DateTime
}
```

---

## Fluxos Principais

### Fluxo 1: Cliente Visualiza Agenda
1. Cliente acessa a página pública
2. Sistema exibe agenda do Adriano
3. Horários disponíveis aparecem como "Disponível"
4. Horários ocupados aparecem como "Agendado" (sem dados do cliente)

### Fluxo 2: Cliente Faz Agendamento (Primeira Vez)
1. Cliente seleciona horário disponível
2. Cliente informa seu e-mail (não requer OTP)
3. Sistema valida e-mail
4. Sistema busca próximo horário disponível para horário alternativo
5. Sistema cria agendamento com horário principal e alternativo
6. Sistema envia e-mail de confirmação ao cliente
7. Sistema envia notificação ao Adriano
8. Cliente vê confirmação na tela

### Fluxo 3: Cliente Reagenda
1. Cliente acessa com seu e-mail
2. Sistema lista agendamentos do cliente
3. Cliente seleciona agendamento para reagendar
4. Sistema mostra novos horários disponíveis
5. Cliente seleciona novo horário
6. Sistema atualiza agendamento e sugere novo horário alternativo
7. Sistema envia notificações (cliente e Adriano)

### Fluxo 4: Admin Faz Login (OTP)
1. Adriano acessa página de admin
2. Informa e-mail admin
3. Sistema valida se é e-mail admin
4. Sistema gera token OTP e envia link por e-mail
5. Adriano clica no link recebido
6. Sistema valida token e cria sessão
7. Adriano é redirecionado para dashboard admin

### Fluxo 5: Admin Gerencia Agenda
1. Adriano acessa dashboard (autenticado)
2. Visualiza todos os agendamentos com dados dos clientes
3. Pode adicionar novos horários
4. Pode editar horários existentes
5. Pode deletar horários (com validação)
6. Pode bloquear/desbloquear horários

---

## Páginas e Componentes

### Páginas Públicas
1. **`/`** - Home/Agenda Pública
   - Visualização da agenda
   - Formulário de agendamento
   - Modal para seleção de horário alternativo

2. **`/appointments/[email]`** - Meus Agendamentos
   - Lista agendamentos do cliente
   - Opções para reagendar/cancelar

### Páginas Admin
1. **`/admin/login`** - Login Admin (OTP)
   - Formulário de e-mail
   - Mensagem de confirmação após envio

2. **`/admin/verify`** - Verificação OTP
   - Página que recebe token do link
   - Valida e autentica

3. **`/admin/dashboard`** - Dashboard Admin
   - Lista de todos os agendamentos
   - Dados dos clientes
   - Estatísticas

4. **`/admin/schedule`** - Gerenciar Agenda
   - Calendário para adicionar/editar/deletar horários
   - Lista de horários disponíveis

---

## Componentes Shadcn Necessários

- `Button` - Botões de ação
- `Calendar` - Calendário para seleção de datas
- `Card` - Cards de agendamento
- `Dialog` - Modais de confirmação
- `Form` - Formulários
- `Input` - Campos de entrada
- `Label` - Labels de formulário
- `Select` - Seleção de horários
- `Table` - Tabela de agendamentos (admin)
- `Badge` - Status de agendamentos
- `Alert` - Alertas e notificações
- `Skeleton` - Loading states

---

## Configurações e Variáveis de Ambiente

```env
# Admin
ADMIN_EMAIL=adriano@personal.com

# Database
DATABASE_URL=

# Email Provider
EMAIL_PROVIDER_API_KEY=
EMAIL_FROM=noreply@personal.com

# OTP
OTP_EXPIRATION_MINUTES=15
SESSION_EXPIRATION_HOURS=24

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Funcionalidades de E-mail

### Templates Necessários

1. **Confirmação de Agendamento (Cliente)**
   - Horário principal
   - Horário alternativo
   - Link para visualizar/gerenciar agendamento

2. **Lembrete de Agendamento (Cliente)**
   - Data e hora do agendamento
   - Informações de contato

3. **Notificação de Novo Agendamento (Admin)**
   - Dados do cliente
   - Horário agendado
   - Horário alternativo

4. **Link de Login OTP (Admin)**
   - Link mágico para autenticação
   - Tempo de expiração

5. **Confirmação de Reagendamento**
   - Novo horário
   - Horário anterior (cancelado)

6. **Confirmação de Cancelamento**
   - Horário cancelado
   - Motivo (se informado)

---

## Validações

### Validação de E-mail
- Formato válido de e-mail
- E-mail único por agendamento (pode ter múltiplos agendamentos, mas não no mesmo horário)

### Validação de Horários
- Não permitir agendamento em horários já ocupados
- Não permitir agendamento em horários bloqueados
- Validar que horário alternativo seja diferente do principal
- Validar que horário alternativo esteja disponível

### Validação de Admin
- Verificar se e-mail é o e-mail admin configurado
- Validar token OTP antes de autenticar
- Verificar expiração do token

---

## Segurança

- Tokens OTP devem ser hasheados no banco
- Sessões devem ter expiração
- Validação de CORS para APIs
- Rate limiting para envio de e-mails
- Sanitização de inputs
- Proteção contra SQL Injection (usar ORM)

---

## Melhorias Futuras (Opcional)

- Sistema de avaliações
- Histórico de agendamentos
- Relatórios para admin
- Integração com calendário (Google Calendar, Outlook)
- Notificações push
- Chat entre cliente e personal trainer
- Sistema de pagamentos

---

## Checklist de Implementação

### Fase 1: Setup e Estrutura
- [ ] Configurar Next.js com App Router
- [ ] Instalar e configurar Shadcn UI
- [ ] Configurar banco de dados
- [ ] Configurar ORM
- [ ] Configurar provedor de e-mail
- [ ] Criar estrutura de pastas

### Fase 2: Autenticação
- [ ] Implementar sistema OTP
- [ ] Criar páginas de login admin
- [ ] Implementar verificação de token
- [ ] Criar middleware de autenticação

### Fase 3: Agenda Pública
- [ ] Criar página de agenda pública
- [ ] Implementar visualização de horários
- [ ] Criar formulário de agendamento
- [ ] Implementar lógica de horário alternativo

### Fase 4: Gerenciamento de Agendamentos
- [ ] Criar página de meus agendamentos
- [ ] Implementar reagendamento
- [ ] Implementar cancelamento
- [ ] Criar validações

### Fase 5: Dashboard Admin
- [ ] Criar dashboard admin
- [ ] Implementar visualização de agendamentos
- [ ] Criar página de gerenciamento de agenda
- [ ] Implementar CRUD de horários

### Fase 6: Notificações
- [ ] Configurar templates de e-mail
- [ ] Implementar envio de e-mails
- [ ] Criar jobs de lembretes
- [ ] Testar todos os fluxos de e-mail

### Fase 7: Testes e Ajustes
- [ ] Testar todos os fluxos
- [ ] Ajustar UI/UX
- [ ] Otimizar performance
- [ ] Deploy

---

## Observações Importantes

1. **Primeira vez sem OTP**: Clientes que acessam pela primeira vez não precisam de OTP, apenas informar e-mail para agendar.

2. **Horário Alternativo**: Sempre que um agendamento é feito, o sistema deve automaticamente reservar um horário alternativo próximo.

3. **Privacidade**: Clientes não podem ver dados de outros clientes, apenas que o horário está "Agendado".

4. **Admin**: Apenas Adriano (via e-mail admin) pode ver dados completos dos clientes e gerenciar a agenda.

5. **OTP Admin**: Apenas o e-mail admin configurado pode receber link OTP para acesso administrativo.

---

## Exemplo de Interface

### Página Pública - Agenda
```
┌─────────────────────────────────────┐
│  Agenda - Personal Trainer Adriano  │
├─────────────────────────────────────┤
│                                     │
│  📅 Calendário                      │
│                                     │
│  Horários Disponíveis:             │
│  ☐ 08:00 - Disponível              │
│  ☐ 09:00 - Disponível              │
│  ☑ 10:00 - Agendado                │
│  ☐ 11:00 - Disponível              │
│                                     │
│  [Selecionar Horário]               │
│                                     │
└─────────────────────────────────────┘
```

### Modal de Agendamento
```
┌─────────────────────────────────────┐
│  Agendar Sessão                     │
├─────────────────────────────────────┤
│  Horário Principal: 10:00          │
│  Horário Alternativo: 11:00        │
│                                     │
│  E-mail: [________________]         │
│                                     │
│  [Confirmar Agendamento]            │
└─────────────────────────────────────┘
```

---

**Fim da Especificação Técnica**

