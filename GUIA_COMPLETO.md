# 📘 Guia Completo - Sistema de Agendamento Personal Trainer

## 🎯 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Instalação Inicial](#instalação-inicial)
3. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
4. [Configuração de Variáveis de Ambiente](#configuração-de-variáveis-de-ambiente)
5. [Primeira Execução](#primeira-execução)
6. [Como Usar como Cliente](#como-usar-como-cliente)
7. [Como Usar como Administrador](#como-usar-como-administrador)
8. [Solução de Problemas](#solução-de-problemas)

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

### 1. Node.js
- **Versão necessária**: Node.js 18 ou superior
- **Como verificar**: Abra o terminal e digite:
  ```bash
  node --version
  ```
- **Se não tiver**: Baixe em [nodejs.org](https://nodejs.org/)

### 2. npm (gerenciador de pacotes)
- Vem junto com o Node.js
- **Como verificar**:
  ```bash
  npm --version
  ```

### 3. Editor de Código (opcional, mas recomendado)
- Visual Studio Code
- Ou qualquer editor de texto

---

## 🚀 Instalação Inicial

### Passo 1: Abrir o Terminal

**Windows:**
- Pressione `Win + R`
- Digite `cmd` ou `powershell` e pressione Enter
- Ou use o PowerShell integrado do VS Code

**Mac/Linux:**
- Abra o Terminal (Terminal.app no Mac)

### Passo 2: Navegar até a Pasta do Projeto

```bash
# Exemplo no Windows
cd C:\Users\User\Downloads\PLANEJAMENTO

# Exemplo no Mac/Linux
cd ~/Downloads/PLANEJAMENTO
```

**Dica**: Você pode arrastar a pasta para o terminal para copiar o caminho automaticamente.

### Passo 3: Instalar as Dependências

Este comando vai baixar todas as bibliotecas necessárias para o projeto funcionar:

```bash
npm install
```

**O que acontece:**
- O npm lê o arquivo `package.json`
- Baixa todas as dependências listadas
- Cria a pasta `node_modules` com todas as bibliotecas
- Isso pode levar alguns minutos na primeira vez

**Tempo estimado**: 2-5 minutos (dependendo da sua internet)

**Você verá algo como:**
```
added 500 packages, and audited 501 packages in 2m
```

---

## 💾 Configuração do Banco de Dados

### Passo 1: Gerar o Cliente Prisma

O Prisma é uma ferramenta que facilita o trabalho com banco de dados. Primeiro, precisamos gerar o código do cliente:

```bash
npx prisma generate
```

**O que acontece:**
- O Prisma lê o arquivo `prisma/schema.prisma`
- Gera código TypeScript para trabalhar com o banco de dados
- Cria tipos TypeScript baseados no schema

**Você verá:**
```
✔ Generated Prisma Client
```

### Passo 2: Criar o Banco de Dados

Agora vamos criar o banco de dados SQLite e as tabelas:

```bash
npx prisma db push
```

**O que acontece:**
- Cria o arquivo `prisma/dev.db` (banco de dados SQLite)
- Cria todas as tabelas definidas no schema:
  - `User` (usuários)
  - `TimeSlot` (horários disponíveis)
  - `Appointment` (agendamentos)
  - `OtpToken` (tokens de autenticação)

**Você verá:**
```
✔ Your database is now in sync with your schema
```

**Arquivo criado**: `prisma/dev.db` (este é seu banco de dados)

---

## ⚙️ Configuração de Variáveis de Ambiente

### Passo 1: Criar o Arquivo .env

O arquivo `.env` armazena configurações sensíveis e específicas do ambiente.

**Windows:**
```bash
# No terminal, dentro da pasta do projeto
copy .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

**Ou manualmente:**
1. Abra o arquivo `.env.example` no editor
2. Copie todo o conteúdo
3. Crie um novo arquivo chamado `.env` (sem o `.example`)
4. Cole o conteúdo

### Passo 2: Editar o Arquivo .env

Abra o arquivo `.env` e configure:

```env
# E-mail do administrador (Adriano)
# IMPORTANTE: Use o e-mail que você quer usar para acessar o painel admin
ADMIN_EMAIL=adriano@personal.com

# URL do banco de dados (SQLite)
# Não precisa alterar, já está correto
DATABASE_URL="file:./dev.db"

# URL da aplicação
# Se estiver rodando localmente, deixe assim
NEXT_PUBLIC_APP_URL=http://localhost:3000

# E-mail (para desenvolvimento, pode deixar vazio)
EMAIL_PROVIDER_API_KEY=
EMAIL_FROM=noreply@personal.com

# Tempo de expiração do OTP (em minutos)
OTP_EXPIRATION_MINUTES=15

# Tempo de expiração da sessão (em horas)
SESSION_EXPIRATION_HOURS=24
```

**⚠️ IMPORTANTE:**
- Altere `ADMIN_EMAIL` para o e-mail que você quer usar como administrador
- Este e-mail será o único que pode receber o link de acesso admin
- Em desenvolvimento, os e-mails aparecem no console, então pode usar qualquer e-mail

---

## 🎬 Primeira Execução

### Passo 1: Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

**O que acontece:**
- Next.js compila o projeto
- Inicia um servidor local na porta 3000
- Fica "escutando" mudanças nos arquivos (hot reload)

**Você verá:**
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Ready in 2.5s
```

**⚠️ IMPORTANTE:** Deixe este terminal aberto enquanto usar a aplicação!

### Passo 2: Abrir no Navegador

1. Abra seu navegador (Chrome, Firefox, Edge, etc.)
2. Digite na barra de endereço:
   ```
   http://localhost:3000
   ```
3. Pressione Enter

**Você deve ver:**
- Página inicial com o título "Personal Trainer Adriano"
- Calendário para selecionar data
- Área de horários (ainda vazia, pois não há horários cadastrados)

---

## 👤 Como Usar como Cliente

### Cenário: Fazer um Agendamento

#### Passo 1: Acessar a Página Inicial
- Abra: `http://localhost:3000`
- Você verá a agenda pública

#### Passo 2: Selecionar uma Data
- Clique no campo "Selecionar Data"
- Escolha uma data futura
- Os horários disponíveis para aquela data aparecerão

**Nota**: Se não houver horários, você precisa criar alguns como administrador primeiro (veja seção abaixo).

#### Passo 3: Escolher um Horário
- Clique em um horário marcado como "Disponível" (verde)
- Um modal aparecerá

#### Passo 4: Preencher Dados
No modal que abriu:
- **E-mail** (obrigatório): Digite seu e-mail
  - Exemplo: `cliente@exemplo.com`
- **Nome** (opcional): Digite seu nome
  - Exemplo: `João Silva`

#### Passo 5: Confirmar Agendamento
- Clique no botão "Confirmar Agendamento"
- Aguarde alguns segundos

**O que acontece:**
- O sistema cria o agendamento
- Reserva automaticamente um horário alternativo
- Envia e-mail de confirmação (aparece no console do terminal)

**Você verá:**
- Mensagem de sucesso verde
- O horário agora aparece como "Agendado"

### Cenário: Ver Meus Agendamentos

#### Passo 1: Acessar com seu E-mail
- Na URL do navegador, digite:
  ```
  http://localhost:3000/appointments/seu@email.com
  ```
- Substitua `seu@email.com` pelo e-mail que você usou no agendamento

**Exemplo:**
```
http://localhost:3000/appointments/cliente@exemplo.com
```

#### Passo 2: Visualizar Agendamentos
- Você verá todos os seus agendamentos
- Cada card mostra:
  - Data e horário principal
  - Horário alternativo (se houver)
  - Status do agendamento

#### Passo 3: Cancelar um Agendamento (se necessário)
- Clique no botão "Cancelar" no card do agendamento
- Confirme a ação
- O agendamento será cancelado

---

## 🔐 Como Usar como Administrador

### Parte 1: Fazer Login (Primeira Vez)

#### Passo 1: Acessar a Página de Login
- Abra: `http://localhost:3000/admin/login`
- Você verá um formulário de login

#### Passo 2: Solicitar Link de Acesso
- No campo "E-mail Administrativo", digite o e-mail configurado em `ADMIN_EMAIL`
- Por padrão: `adriano@personal.com`
- Clique em "Enviar Link de Acesso"

**O que acontece:**
- O sistema gera um token OTP
- Envia um e-mail com o link (em desenvolvimento, aparece no console)

#### Passo 3: Verificar o Console do Terminal
- Volte ao terminal onde o servidor está rodando
- Você verá algo como:

```
==================================================
📧 E-MAIL ENVIADO
==================================================
Para: adriano@personal.com
Assunto: Link de Acesso - Personal Trainer Adriano
Conteúdo HTML:
...
Link: http://localhost:3000/admin/verify?email=adriano@personal.com&token=abc123...
==================================================
```

#### Passo 4: Copiar o Link
- Procure pela linha que começa com `Link:`
- Copie todo o link (começa com `http://localhost:3000/admin/verify?...`)

#### Passo 5: Acessar o Link
- Cole o link na barra de endereço do navegador
- Pressione Enter
- Você será autenticado e redirecionado para o dashboard

**⚠️ IMPORTANTE:**
- O link expira em 15 minutos
- Se expirar, solicite um novo link

### Parte 2: Usar o Dashboard

#### Visualizar Agendamentos
- No dashboard, você verá:
  - **Estatísticas**: Total de agendamentos, agendamentos de hoje, desta semana
  - **Lista de Agendamentos**: Todos os agendamentos com dados dos clientes

**Informações visíveis:**
- Nome do cliente
- E-mail do cliente
- Horário principal
- Horário alternativo
- Status do agendamento
- Data de criação

### Parte 3: Gerenciar Agenda

#### Acessar a Página de Gerenciamento
- No dashboard, clique em "Gerenciar Agenda"
- Ou acesse: `http://localhost:3000/admin/schedule`

#### Criar um Novo Horário

**Passo 1: Clicar em "Novo Horário"**
- Botão no canto superior direito

**Passo 2: Preencher o Formulário**
- **Data**: Selecione a data (ex: 25/12/2024)
- **Horário Início**: Digite a hora de início (ex: 08:00)
- **Horário Fim**: Digite a hora de fim (ex: 09:00)
- **Duração**: Número de minutos (padrão: 60)
- **Bloquear horário**: Marque apenas se quiser que o horário não apareça na agenda pública

**Exemplo de preenchimento:**
```
Data: 2024-12-25
Horário Início: 08:00
Horário Fim: 09:00
Duração: 60
Bloquear: Não marcado
```

**Passo 3: Salvar**
- Clique em "Criar Horário"
- O horário aparecerá na lista

#### Editar um Horário Existente

**Passo 1: Localizar o Horário**
- Na lista de horários, encontre o que deseja editar

**Passo 2: Clicar no Ícone de Editar**
- Ícone de lápis ao lado do horário

**Passo 3: Modificar**
- Altere os campos desejados
- Clique em "Salvar Alterações"

#### Deletar um Horário

**Passo 1: Localizar o Horário**
- Na lista de horários, encontre o que deseja deletar

**Passo 2: Clicar no Ícone de Lixeira**
- Ícone vermelho ao lado do horário

**Passo 3: Confirmar**
- Uma confirmação aparecerá
- Clique em "OK" para confirmar

**⚠️ ATENÇÃO:**
- Não é possível deletar horários que têm agendamentos ativos
- Se tentar, verá uma mensagem de erro

#### Bloquear/Desbloquear um Horário

**Para bloquear:**
1. Edite o horário
2. Marque a opção "Bloquear horário"
3. Salve

**Efeito:**
- O horário não aparecerá na agenda pública
- Mas continuará existindo no sistema

**Para desbloquear:**
1. Edite o horário
2. Desmarque a opção "Bloquear horário"
3. Salve

---

## 🔧 Solução de Problemas

### Problema 1: "Cannot find module '@prisma/client'"

**Erro:**
```
Error: Cannot find module '@prisma/client'
```

**Solução:**
```bash
npx prisma generate
```

**Explicação:** O cliente Prisma não foi gerado. Execute o comando acima.

---

### Problema 2: "Database does not exist"

**Erro:**
```
Error: Database does not exist
```

**Solução:**
```bash
npx prisma db push
```

**Explicação:** O banco de dados não foi criado. Execute o comando acima.

---

### Problema 3: "Invalid DATABASE_URL"

**Erro:**
```
Error: Invalid DATABASE_URL
```

**Solução:**
1. Verifique se o arquivo `.env` existe na raiz do projeto
2. Verifique se contém a linha:
   ```
   DATABASE_URL="file:./dev.db"
   ```
3. Certifique-se de que as aspas estão corretas

---

### Problema 4: "Port 3000 is already in use"

**Erro:**
```
Error: Port 3000 is already in use
```

**Solução 1: Encerrar o processo na porta 3000**

**Windows:**
```bash
# Encontrar o processo
netstat -ano | findstr :3000

# Matar o processo (substitua PID pelo número encontrado)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Encontrar o processo
lsof -ti:3000

# Matar o processo
kill -9 $(lsof -ti:3000)
```

**Solução 2: Usar outra porta**
- Edite o arquivo `package.json`
- Mude a linha do script `dev`:
  ```json
  "dev": "next dev -p 3001"
  ```
- Agora acesse: `http://localhost:3001`

---

### Problema 5: "E-mail não encontrado" ao fazer login admin

**Erro:**
```
Este e-mail não tem permissão de administrador
```

**Solução:**
1. Verifique o arquivo `.env`
2. Certifique-se de que `ADMIN_EMAIL` está configurado
3. Use exatamente o mesmo e-mail que está no `.env`
4. Reinicie o servidor após alterar o `.env`

---

### Problema 6: Link OTP não funciona

**Possíveis causas:**

1. **Link expirado**
   - Solução: Solicite um novo link
   - Links expiram em 15 minutos

2. **Link já usado**
   - Solução: Solicite um novo link
   - Cada link só pode ser usado uma vez

3. **Token inválido**
   - Solução: Solicite um novo link
   - Certifique-se de copiar o link completo

---

### Problema 7: Não consigo ver horários na agenda

**Possíveis causas:**

1. **Não há horários cadastrados**
   - Solução: Crie horários como administrador

2. **Todos os horários estão bloqueados**
   - Solução: Desbloqueie os horários no painel admin

3. **Data selecionada não tem horários**
   - Solução: Selecione outra data ou crie horários para essa data

---

### Problema 8: Erro ao criar agendamento

**Erro:**
```
Horário já está agendado
```

**Solução:**
- Alguém já agendou esse horário
- Escolha outro horário disponível

---

### Problema 9: E-mails não aparecem

**Em desenvolvimento:**
- Os e-mails NÃO são enviados realmente
- Eles aparecem no **console do terminal** onde o servidor está rodando
- Procure por linhas que começam com `📧 E-MAIL ENVIADO`

**Para produção:**
- Você precisa configurar um serviço real de e-mail
- Edite o arquivo `lib/email.ts`
- Integre com Resend, SendGrid ou Nodemailer

---

### Problema 10: Erro "Module not found"

**Erro:**
```
Module not found: Can't resolve '@/components/ui/...'
```

**Solução:**
1. Verifique se todos os arquivos de componentes existem
2. Reinstale as dependências:
   ```bash
   rm -rf node_modules
   npm install
   ```

---

## 📝 Checklist de Configuração

Use este checklist para garantir que tudo está configurado:

- [ ] Node.js instalado (versão 18+)
- [ ] npm instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Cliente Prisma gerado (`npx prisma generate`)
- [ ] Banco de dados criado (`npx prisma db push`)
- [ ] Arquivo `.env` criado e configurado
- [ ] `ADMIN_EMAIL` configurado no `.env`
- [ ] Servidor rodando (`npm run dev`)
- [ ] Aplicação acessível em `http://localhost:3000`

---

## 🎓 Dicas Úteis

### Dica 1: Manter o Terminal Aberto
- O terminal onde você roda `npm run dev` deve ficar aberto
- É nele que você verá os e-mails em desenvolvimento
- É nele que aparecem erros e logs

### Dica 2: Limpar o Banco de Dados
Se quiser começar do zero:

```bash
# Deletar o banco
rm prisma/dev.db

# Recriar
npx prisma db push
```

### Dica 3: Ver o Banco de Dados
Para visualizar o banco de dados de forma gráfica:

```bash
npx prisma studio
```

Isso abrirá uma interface web em `http://localhost:5555` onde você pode ver e editar os dados.

### Dica 4: Logs e Debug
- Todos os erros aparecem no terminal
- E-mails aparecem no terminal (em desenvolvimento)
- Use `console.log()` nos arquivos para debug

---

## 🚀 Próximos Passos Após Configuração

1. **Criar Horários de Teste**
   - Faça login como admin
   - Crie alguns horários para diferentes datas

2. **Testar Agendamento**
   - Acesse como cliente
   - Faça um agendamento de teste

3. **Verificar E-mails**
   - Verifique o console para ver os e-mails enviados

4. **Explorar o Sistema**
   - Teste todas as funcionalidades
   - Familiarize-se com a interface

---

## 📞 Precisa de Ajuda?

Se encontrar algum problema não listado aqui:

1. Verifique o terminal onde o servidor está rodando
2. Procure por mensagens de erro
3. Verifique se todos os passos foram seguidos
4. Certifique-se de que o arquivo `.env` está correto

---

**Boa sorte com seu sistema de agendamento! 🎉**

