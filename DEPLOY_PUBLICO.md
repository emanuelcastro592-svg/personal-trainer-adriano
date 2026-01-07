# 🌐 Deixar Sistema Público - Guia Passo a Passo

## 🎯 Objetivo
Fazer o sistema ficar acessível publicamente na internet, funcionando em qualquer dispositivo (celular, tablet, computador).

---

## 📋 Pré-requisitos

1. **Conta no GitHub** (gratuita)
   - Acesse: https://github.com
   - Crie uma conta se não tiver

2. **Conta na Vercel** (gratuita)
   - Acesse: https://vercel.com
   - Faça login com GitHub

---

## 🚀 Passo a Passo Completo

### PASSO 1: Preparar o Código

#### 1.1. Criar arquivo `.gitignore` (se não existir)

Certifique-se de que o `.gitignore` contém:
```
node_modules/
.env
.env.local
.next/
out/
dev.db
```

#### 1.2. Criar arquivo `vercel.json` (opcional, mas recomendado)

Crie um arquivo `vercel.json` na raiz do projeto:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

---

### PASSO 2: Criar Repositório no GitHub

#### 2.1. Criar novo repositório

1. Acesse: https://github.com/new
2. **Repository name**: `personal-trainer-adriano` (ou qualquer nome)
3. **Description**: "Sistema de agendamento Personal Trainer"
4. Marque como **Public** (público)
5. **NÃO** marque "Add README" (já temos)
6. Clique em **"Create repository"**

#### 2.2. Fazer upload do código

**Opção A: Pelo GitHub Desktop (Mais Fácil)**

1. Baixe: https://desktop.github.com
2. Instale e faça login
3. Clique em "File" → "Clone Repository"
4. Escolha "URL" e cole: `https://github.com/SEU_USUARIO/personal-trainer-adriano.git`
5. Escolha uma pasta local
6. Copie TODOS os arquivos do seu projeto para essa pasta
7. No GitHub Desktop:
   - Escreva uma mensagem: "Initial commit"
   - Clique em "Commit to main"
   - Clique em "Push origin"

**Opção B: Pelo Terminal (Git)**

```bash
# 1. Instalar Git (se não tiver)
# Windows: https://git-scm.com/download/win

# 2. Na pasta do seu projeto, execute:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/personal-trainer-adriano.git
git push -u origin main
```

**Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub!**

---

### PASSO 3: Configurar Banco de Dados (Supabase)

**⚠️ IMPORTANTE:** SQLite não funciona na Vercel! Precisa de banco remoto.

#### 3.1. Criar conta no Supabase

1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub
4. Clique em "New Project"
5. Preencha:
   - **Name**: `personal-trainer-db`
   - **Database Password**: Crie uma senha forte (anote!)
   - **Region**: Escolha a mais próxima (ex: South America)
6. Clique em "Create new project"
7. Aguarde 2-3 minutos para criar

#### 3.2. Obter Connection String

1. No Supabase, vá em **Settings** (ícone de engrenagem)
2. Clique em **Database**
3. Role até **Connection string**
4. Escolha **URI**
5. Copie a string (algo como: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
6. **Substitua `[PASSWORD]` pela senha que você criou**

#### 3.3. Atualizar Schema do Prisma

Edite o arquivo `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Mudar de "sqlite" para "postgresql"
  url      = env("DATABASE_URL")
}
```

#### 3.4. Testar localmente (opcional)

1. Atualize seu `.env` local:
   ```
   DATABASE_URL="postgresql://postgres:SUA_SENHA@db.xxxxx.supabase.co:5432/postgres"
   ```

2. Execute:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

---

### PASSO 4: Deploy na Vercel

#### 4.1. Conectar com GitHub

1. Acesse: https://vercel.com
2. Clique em **"Sign Up"** ou **"Login"**
3. Escolha **"Continue with GitHub"**
4. Autorize a Vercel

#### 4.2. Importar Projeto

1. Clique em **"Add New Project"**
2. Clique em **"Import"** ao lado do seu repositório
3. Configure:
   - **Project Name**: `personal-trainer-adriano` (ou qualquer nome)
   - **Framework Preset**: Next.js (já detecta)
   - **Root Directory**: `./` (deixe padrão)
   - **Build Command**: `npm run build` (já vem)
   - **Output Directory**: `.next` (já vem)

#### 4.3. Configurar Variáveis de Ambiente

Antes de clicar em "Deploy", clique em **"Environment Variables"** e adicione:

```
ADMIN_EMAIL
```
Valor: `adriano@personal.com` (ou seu e-mail)

```
DATABASE_URL
```
Valor: A connection string do Supabase (com a senha substituída)

```
NEXT_PUBLIC_APP_URL
```
Valor: Deixe vazio por enquanto (será preenchido depois)

```
EMAIL_FROM
```
Valor: `noreply@personal.com`

```
OTP_EXPIRATION_MINUTES
```
Valor: `15`

```
SESSION_EXPIRATION_HOURS
```
Valor: `24`

```
NEXTAUTH_SECRET
```
Valor: Gere uma chave aleatória:
- No terminal: `openssl rand -base64 32`
- Ou use: https://generate-secret.vercel.app/32

```
NEXTAUTH_URL
```
Valor: Deixe vazio por enquanto

#### 4.4. Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde 2-5 minutos
3. Quando terminar, você verá uma URL: `https://seu-projeto.vercel.app`

#### 4.5. Atualizar URLs

Depois do deploy:

1. Na Vercel, vá em **Settings** → **Environment Variables**
2. Atualize:
   - `NEXT_PUBLIC_APP_URL`: Cole a URL do seu projeto (ex: `https://seu-projeto.vercel.app`)
   - `NEXTAUTH_URL`: Cole a mesma URL
3. Vá em **Deployments** → Clique nos 3 pontinhos → **Redeploy**

---

### PASSO 5: Configurar E-mail Real (Opcional mas Recomendado)

#### 5.1. Criar conta no Resend

1. Acesse: https://resend.com
2. Clique em "Get Started"
3. Faça login com GitHub
4. Vá em **"API Keys"**
5. Clique em **"Create API Key"**
6. Nome: `personal-trainer`
7. Copie a chave (começa com `re_`)

#### 5.2. Adicionar na Vercel

1. Na Vercel, vá em **Settings** → **Environment Variables**
2. Adicione:
   ```
   EMAIL_PROVIDER_API_KEY
   ```
   Valor: A chave do Resend (`re_xxxxx`)

#### 5.3. Atualizar código de e-mail

Edite `lib/email.ts` e adicione no topo:

```typescript
// Se tiver EMAIL_PROVIDER_API_KEY, usar Resend
let resend: any = null
if (process.env.EMAIL_PROVIDER_API_KEY) {
  const { Resend } = require('resend')
  resend = new Resend(process.env.EMAIL_PROVIDER_API_KEY)
}
```

E atualize a função `sendEmail`:

```typescript
export async function sendEmail(data: EmailData): Promise<void> {
  if (resend && process.env.EMAIL_PROVIDER_API_KEY) {
    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: data.to,
        subject: data.subject,
        html: data.html,
      })
      return
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error)
    }
  }
  
  // Fallback: log no console (desenvolvimento)
  console.log('📧 E-MAIL:', data)
}
```

#### 5.4. Instalar Resend

No `package.json`, adicione na seção `dependencies`:

```json
"resend": "^3.0.0"
```

Depois faça commit e push:

```bash
git add package.json lib/email.ts
git commit -m "Adicionar suporte a Resend"
git push
```

A Vercel fará deploy automático!

---

### PASSO 6: Criar Horários Iniciais

1. Acesse: `https://seu-projeto.vercel.app/admin/login`
2. Digite o e-mail admin
3. Verifique seu e-mail (Resend enviará o link)
4. Faça login
5. Crie horários de teste

---

## ✅ Checklist Final

- [ ] Código no GitHub
- [ ] Projeto na Vercel
- [ ] Banco Supabase configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado
- [ ] URLs atualizadas
- [ ] E-mail configurado (opcional)
- [ ] Testado no celular
- [ ] Testado no computador

---

## 📱 Testar em Dispositivos

### No Celular:
1. Abra o navegador
2. Digite a URL: `https://seu-projeto.vercel.app`
3. Teste fazer um agendamento

### No Computador:
1. Abra qualquer navegador
2. Digite a URL
3. Teste todas as funcionalidades

---

## 🎉 Pronto!

Seu sistema está público e acessível em qualquer dispositivo!

**URL será algo como:** `https://personal-trainer-adriano.vercel.app`

---

## 🆘 Problemas?

### Erro de build
- Verifique logs na Vercel
- Certifique-se que todas as dependências estão no `package.json`

### Banco de dados não funciona
- Verifique a connection string do Supabase
- Certifique-se que substituiu `[PASSWORD]`

### E-mails não funcionam
- Verifique se a chave do Resend está correta
- Confirme que o domínio está verificado (Resend)

---

**Precisa de ajuda em algum passo? Me avise!** 🚀

