# Guia Rápido de Configuração

## Passo a Passo

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados
```bash
# Gerar cliente Prisma
npx prisma generate

# Criar banco de dados
npx prisma db push
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
ADMIN_EMAIL=adriano@personal.com
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Iniciar o Servidor
```bash
npm run dev
```

### 5. Acessar a Aplicação
- **Página Pública**: http://localhost:3000
- **Login Admin**: http://localhost:3000/admin/login

## Testando o Sistema

### Como Cliente:
1. Acesse http://localhost:3000
2. Selecione uma data
3. Clique em um horário disponível
4. Preencha seu e-mail e nome (opcional)
5. Confirme o agendamento
6. Verifique o console do servidor para ver o e-mail de confirmação

### Como Admin:
1. Acesse http://localhost:3000/admin/login
2. Digite o e-mail configurado em `ADMIN_EMAIL`
3. Verifique o console do servidor para ver o link OTP
4. Copie o link do console e cole no navegador
5. Você será redirecionado para o dashboard

## Criar Horários de Teste

Após fazer login como admin:
1. Vá para "Gerenciar Agenda"
2. Clique em "Novo Horário"
3. Preencha:
   - Data (ex: 2024-12-25)
   - Horário Início (ex: 08:00)
   - Horário Fim (ex: 09:00)
   - Duração: 60 minutos
4. Salve

## Notas Importantes

- **E-mails**: Em desenvolvimento, todos os e-mails são logados no console do servidor
- **Banco de Dados**: SQLite é usado por padrão (arquivo `prisma/dev.db`)
- **OTP**: Links OTP aparecem no console quando você solicita acesso admin

## Problemas Comuns

### Erro: "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### Erro: "Database does not exist"
```bash
npx prisma db push
```

### Erro: "Invalid DATABASE_URL"
Verifique se o arquivo `.env` existe e tem `DATABASE_URL="file:./dev.db"`

