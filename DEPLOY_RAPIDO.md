# ⚡ Deploy Rápido - 5 Passos

## 🎯 Vercel (Mais Fácil)

### 1. GitHub
- Crie repositório no GitHub
- Faça upload do código

### 2. Vercel
- Acesse: https://vercel.com
- Login com GitHub
- Importe o repositório

### 3. Variáveis
Adicione na Vercel:
```
ADMIN_EMAIL=adriano@personal.com
DATABASE_URL=[string do Supabase]
NEXT_PUBLIC_APP_URL=https://seu-projeto.vercel.app
NEXTAUTH_SECRET=[chave aleatória]
NEXTAUTH_URL=https://seu-projeto.vercel.app
```

### 4. Banco de Dados
- Crie conta no Supabase (gratuito)
- Copie connection string
- Cole em `DATABASE_URL`

### 5. Deploy
- Clique em "Deploy"
- Pronto! 🎉

---

## 📧 E-mail (Opcional)

- Resend.com (gratuito)
- Adicione `EMAIL_PROVIDER_API_KEY` na Vercel

---

**Detalhes completos em `GUIA_DEPLOY.md`** 📘

