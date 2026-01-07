# Sistema de Agendamento - Personal Trainer Adriano

Sistema completo de agendamento desenvolvido com Next.js, React e Shadcn UI.

## 🚀 Funcionalidades

### Para Clientes
- ✅ Visualizar agenda pública com horários disponíveis
- ✅ Fazer agendamentos sem necessidade de cadastro (apenas e-mail)
- ✅ Ver seus próprios agendamentos
- ✅ Cancelar agendamentos
- ✅ Horário alternativo automático em cada agendamento

### Para Administrador (Adriano)
- ✅ Autenticação via OTP (Magic Link por e-mail)
- ✅ Dashboard com todos os agendamentos e dados dos clientes
- ✅ Gerenciar agenda (criar, editar, deletar horários)
- ✅ Bloquear/desbloquear horários
- ✅ Receber notificações de novos agendamentos

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🛠️ Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:
```env
ADMIN_EMAIL=adriano@personal.com
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Configurar banco de dados:**
```bash
npx prisma generate
npx prisma db push
```

4. **Iniciar servidor de desenvolvimento:**
```bash
npm run dev
```

5. **Acessar a aplicação:**
- Página pública: http://localhost:3000
- Login admin: http://localhost:3000/admin/login

## 📧 Sistema de E-mail

Por padrão, o sistema está configurado para **desenvolvimento** e os e-mails são apenas logados no console.

Para produção, você pode integrar com:
- **Resend** (recomendado)
- **SendGrid**
- **Nodemailer** com SMTP

Edite o arquivo `lib/email.ts` para implementar o envio real de e-mails.

## 🔐 Autenticação Admin

1. Acesse `/admin/login`
2. Informe o e-mail admin configurado em `ADMIN_EMAIL`
3. Um link será enviado por e-mail (no console em desenvolvimento)
4. Clique no link para fazer login
5. Você será redirecionado para o dashboard

**Nota:** Em desenvolvimento, o link aparecerá no console do servidor.

## 📁 Estrutura do Projeto

```
├── app/
│   ├── api/              # API Routes
│   ├── admin/            # Páginas admin
│   ├── appointments/     # Páginas de agendamentos
│   ├── globals.css       # Estilos globais
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página inicial (agenda pública)
├── components/
│   └── ui/               # Componentes Shadcn UI
├── lib/
│   ├── auth.ts           # Funções de autenticação
│   ├── email.ts          # Sistema de e-mail
│   ├── prisma.ts         # Cliente Prisma
│   └── utils.ts          # Utilitários
└── prisma/
    └── schema.prisma     # Schema do banco de dados
```

## 🎨 Componentes Shadcn UI

O projeto utiliza os seguintes componentes:
- Button
- Card
- Dialog
- Input
- Label
- Badge
- Alert
- Select

## 📝 Regras de Negócio Implementadas

1. **Horário Alternativo Automático**: Todo agendamento reserva automaticamente um horário alternativo
2. **Privacidade**: Clientes não veem dados de outros clientes, apenas "Agendado"
3. **Primeira Vez Sem OTP**: Clientes não precisam de OTP na primeira vez
4. **Admin OTP**: Apenas e-mail admin pode receber link OTP
5. **Validações**: Horários ocupados não podem ser agendados novamente

## 🔄 Próximos Passos (Melhorias Futuras)

- [ ] Implementar sessão JWT para admin
- [ ] Adicionar funcionalidade de reagendamento completa
- [ ] Integrar serviço real de e-mail
- [ ] Adicionar lembretes automáticos (24h antes)
- [ ] Sistema de avaliações
- [ ] Histórico completo de agendamentos
- [ ] Relatórios para admin

## 🐛 Troubleshooting

### Erro ao gerar Prisma
```bash
npx prisma generate
```

### Erro no banco de dados
```bash
npx prisma db push --force-reset
```

### Limpar banco de dados
```bash
rm prisma/dev.db
npx prisma db push
```

## 📄 Licença

Este projeto foi desenvolvido para o Personal Trainer Adriano.

---

**Desenvolvido com ❤️ usando Next.js, React e Shadcn UI**

