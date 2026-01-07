# ⚡ Deploy Simples - 3 Passos

## 🎯 Resumo Rápido

### 1️⃣ GitHub
- Crie repositório no GitHub
- Faça upload do código

### 2️⃣ Supabase (Banco de Dados)
- Crie conta: https://supabase.com
- Crie projeto
- Copie connection string

### 3️⃣ Vercel (Deploy)
- Acesse: https://vercel.com
- Importe do GitHub
- Configure variáveis:
  - `DATABASE_URL` (do Supabase)
  - `ADMIN_EMAIL` (seu e-mail)
  - `NEXTAUTH_SECRET` (gere: `openssl rand -base64 32`)
- Deploy!

---

## 📝 Variáveis Necessárias na Vercel

```
ADMIN_EMAIL=adriano@personal.com
DATABASE_URL=postgresql://postgres:SENHA@db.xxxxx.supabase.co:5432/postgres
NEXT_PUBLIC_APP_URL=https://seu-projeto.vercel.app
NEXTAUTH_SECRET=[chave aleatória]
NEXTAUTH_URL=https://seu-projeto.vercel.app
EMAIL_FROM=noreply@personal.com
OTP_EXPIRATION_MINUTES=15
SESSION_EXPIRATION_HOURS=24
```

---

## 🔄 Atualizar Schema para PostgreSQL

Antes do deploy, edite `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Mudar de "sqlite"
  url      = env("DATABASE_URL")
}
```

---

**Guia completo em `DEPLOY_PUBLICO.md`** 📘

