# 🚀 Guia de Deploy - Deixar Sistema Público

## 📋 Opções de Deploy

### Opção 1: Vercel (Recomendado - Mais Fácil) ⭐
### Opção 2: Railway
### Opção 3: Render

---

## 🎯 Deploy na Vercel (Recomendado)

### Pré-requisitos
- Conta no GitHub (gratuita)
- Conta na Vercel (gratuita)

### Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com
2. Clique em "New repository"
3. Nome: `personal-trainer-scheduling`
4. Marque como **Público** (para plano gratuito)
5. Clique em "Create repository"

### Passo 2: Fazer Upload do Código

**Opção A: Pelo GitHub Desktop**
1. Baixe GitHub Desktop: https://desktop.github.com
2. Clone o repositório
3. Copie todos os arquivos do projeto para a pasta
4. Commit e Push

**Opção B: Pelo Terminal (Git)**

```bash
# Instalar Git (se não tiver)
# Windows: https://git-scm.com/download/win

# Na pasta do projeto
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/personal-trainer-scheduling.git
git push -u origin main
```

### Passo 3: Deploy na Vercel

1. Acesse: https://vercel.com
2. Clique em "Sign Up" e faça login com GitHub
3. Clique em "Add New Project"
4. Importe o repositório que você criou
5. Configure:
   - **Framework Preset**: Next.js (já detecta automaticamente)
   - **Root Directory**: `./` (deixe padrão)
   - **Build Command**: `npm run build` (já vem preenchido)
   - **Output Directory**: `.next` (já vem preenchido)

### Passo 4: Configurar Variáveis de Ambiente

Na Vercel, antes de fazer deploy:

1. Clique em "Environment Variables"
2. Adicione cada variável:

```
ADMIN_EMAIL=adriano@personal.com
DATABASE_URL=file:./dev.db
NEXT_PUBLIC_APP_URL=https://seu-projeto.vercel.app
EMAIL_FROM=noreply@personal.com
OTP_EXPIRATION_MINUTES=15
SESSION_EXPIRATION_HOURS=24
NEXTAUTH_SECRET=uma-chave-secreta-aleatoria-aqui
NEXTAUTH_URL=https://seu-projeto.vercel.app
```

**⚠️ IMPORTANTE:**
- `NEXT_PUBLIC_APP_URL` será a URL que a Vercel fornecer (ex: `https://meu-projeto.vercel.app`)
- `NEXTAUTH_SECRET`: gere uma chave aleatória (pode usar: `openssl rand -base64 32`)

### Passo 5: Configurar Banco de Dados

**SQLite não funciona bem na Vercel!** Você precisa usar um banco de dados remoto:

#### Opção A: Supabase (Recomendado - Gratuito)

1. Acesse: https://supabase.com
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Vá em "Settings" → "Database"
5. Copie a "Connection String" (URI)
6. No `prisma/schema.prisma`, mude:

```prisma
datasource db {
  provider = "postgresql"  // Mudar de sqlite para postgresql
  url      = env("DATABASE_URL")
}
```

7. Na Vercel, atualize `DATABASE_URL` com a string do Supabase
8. Execute migrations:

```bash
npx prisma migrate deploy
```

#### Opção B: PlanetScale (MySQL)

1. Acesse: https://planetscale.com
2. Crie conta gratuita
3. Crie banco de dados
4. Use a connection string fornecida

### Passo 6: Configurar E-mail Real

**Opção A: Resend (Recomendado - Gratuito até 3.000/mês)**

1. Acesse: https://resend.com
2. Crie conta gratuita
3. Vá em "API Keys" e crie uma chave
4. Na Vercel, adicione:
   ```
   EMAIL_PROVIDER_API_KEY=re_xxxxx
   ```
5. Edite `lib/email.ts` e adicione:

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.EMAIL_PROVIDER_API_KEY)

export async function sendEmail(data: EmailData): Promise<void> {
  if (process.env.EMAIL_PROVIDER_API_KEY) {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: data.to,
      subject: data.subject,
      html: data.html,
    })
  } else {
    // Fallback para desenvolvimento
    console.log('📧 E-MAIL:', data)
  }
}
```

6. Instale: `npm install resend`

**Opção B: SendGrid**

1. Acesse: https://sendgrid.com
2. Crie conta (plano gratuito: 100 e-mails/dia)
3. Configure API Key
4. Use similar ao Resend

### Passo 7: Fazer Deploy

1. Na Vercel, clique em "Deploy"
2. Aguarde alguns minutos
3. Quando terminar, você terá uma URL: `https://seu-projeto.vercel.app`

### Passo 8: Atualizar URLs

Depois do deploy, atualize na Vercel:
- `NEXT_PUBLIC_APP_URL`: URL do seu projeto
- `NEXTAUTH_URL`: URL do seu projeto

---

## 🎨 Melhorias Visuais Aplicadas

O sistema já tem melhorias visuais:
- ✅ Header moderno com gradiente
- ✅ Cards com efeito glass
- ✅ Gradientes coloridos
- ✅ Animações suaves
- ✅ Footer profissional
- ✅ Design responsivo

---

## 📝 Checklist de Deploy

- [ ] Código no GitHub
- [ ] Conta na Vercel criada
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados remoto configurado (Supabase/PlanetScale)
- [ ] E-mail real configurado (Resend/SendGrid)
- [ ] Deploy realizado
- [ ] Testar sistema online
- [ ] Criar horários como admin
- [ ] Testar agendamento como cliente

---

## 🔧 Comandos Úteis

### Gerar chave secreta:
```bash
openssl rand -base64 32
```

### Ver logs do deploy:
Na Vercel, vá em "Deployments" → clique no deploy → "View Function Logs"

### Atualizar código:
```bash
git add .
git commit -m "Atualização"
git push
```
A Vercel faz deploy automático!

---

## 🆘 Problemas Comuns

### Erro: "Database does not exist"
- Configure `DATABASE_URL` corretamente
- Use banco remoto (não SQLite)

### E-mails não funcionam
- Verifique `EMAIL_PROVIDER_API_KEY`
- Confirme que o domínio está verificado (Resend)

### Erro de build
- Verifique logs na Vercel
- Certifique-se que todas as dependências estão no `package.json`

---

## 🎉 Pronto!

Depois do deploy, seu sistema estará público e acessível para todos!

**URL será algo como:** `https://personal-trainer-adriano.vercel.app`

---

**Precisa de ajuda?** Me avise em qual passo você está! 🚀

