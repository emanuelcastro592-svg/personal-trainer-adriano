# ⚡ Guia Rápido - 5 Minutos para Começar

## 🎯 Setup Rápido (Copie e Cole)

```bash
# 1. Instalar dependências
npm install

# 2. Gerar cliente Prisma
npx prisma generate

# 3. Criar banco de dados
npx prisma db push

# 4. Criar arquivo .env (Windows)
copy .env.example .env

# 4. Criar arquivo .env (Mac/Linux)
cp .env.example .env

# 5. Iniciar servidor
npm run dev
```

**Pronto!** Acesse: http://localhost:3000

---

## 📝 Configurar .env

Abra o arquivo `.env` e configure:

```env
ADMIN_EMAIL=adriano@personal.com
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🎬 Primeiro Uso

### Como Cliente:
1. Acesse: http://localhost:3000
2. Selecione uma data
3. Clique em um horário disponível
4. Preencha seu e-mail
5. Confirme

### Como Admin:
1. Acesse: http://localhost:3000/admin/login
2. Digite o e-mail do `.env`
3. **IMPORTANTE**: Veja o console do terminal para pegar o link OTP
4. Cole o link no navegador
5. Você estará logado!

---

## ⚠️ Lembre-se

- **E-mails aparecem no console do terminal** (não são enviados realmente)
- **Link OTP aparece no console** quando você solicita acesso admin
- **Mantenha o terminal aberto** enquanto usa a aplicação

---

## 🆘 Problemas?

### Erro: "Cannot find module"
```bash
npx prisma generate
```

### Erro: "Database does not exist"
```bash
npx prisma db push
```

### Porta 3000 ocupada?
Use outra porta:
```bash
npm run dev -- -p 3001
```

---

**Para mais detalhes, veja o `GUIA_COMPLETO.md`** 📘

