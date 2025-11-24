# Chatbot de Atendimento Simulado

Este é um protótipo fullstack de um sistema de chat criado com **Python + Django REST Framework** no backend e **React + Vite** no frontend.  
O sistema simula dois usuários (“Usuário A” e “Usuário B”) enviando mensagens a um bot que responde automaticamente.

Este README explica como baixar, instalar, configurar e rodar o projeto localmente.

- - -

## Como rodar o projeto localmente

### 1\. Baixar o projeto

#### Usando Git

```
git clone <URL-do-repositório>
cd chatbot
```

#### Baixando ZIP pelo GitHub

*   Clique em **Download ZIP**
*   Extraia o conteúdo
*   Abra um terminal dentro da pasta extraída

A estrutura será:

```
/backend
/frontend
```

- - -

## BACKEND (Django)

### 2.1 — Acessar a pasta do backend

```
cd backend
```

### 2.2 — Criar e ativar o ambiente virtual (venv)

#### Windows (PowerShell)

```
python -m venv venv
.\venv\Scripts\activate
```

#### Linux / macOS

```
python3 -m venv venv
source venv/bin/activate
```

Se estiver correto, o terminal exibirá algo assim:

```
(venv) C:\caminho\chatbot\backend>
```

### 2.3 — Instalar dependências do backend

```
pip install django djangorestframework django-cors-headers django-extensions
```

### 2.4 — Criar e aplicar migrações

```
python manage.py makemigrations
python manage.py migrate
```

### 2.5 — Rodar o backend

```
python manage.py runserver
```

O backend estará disponível em:

```
http://127.0.0.1:8000
```

**Observação:** ao rodar o backend, o terminal ficará dedicado ao servidor.  
Para rodar o frontend, será necessário abrir outro terminal.

- - -

## FRONTEND (React + Vite)

### 3.1 — Abrir outro terminal e acessar a pasta do frontend

Ao abrir um novo PowerShell, ele inicia em:

```
C:\Users\User>
```

Acesse a pasta do frontend (exemplo):

```
cd C:\caminho\chatbot\frontend
```

(Ajuste o caminho conforme a localização real do projeto.)

### 3.2 — Instalar dependências do frontend

```
npm install
```

### 3.3 — Rodar o frontend

```
npm run dev
```

O frontend estará disponível em:

```
http://localhost:5173
```

- - -

## Como usar o sistema

*   Acesse: `http://localhost:5173`
*   Escolha **Usuário A** ou **Usuário B**
*   Clique em **Novo Chat**
*   Envie mensagens
*   O bot responde automaticamente
*   A página **/historico** mostra apenas os chats do usuário selecionado

- - -

## Decisões Técnicas do Projeto

### Modelagem de Dados

#### Model: **Chat**

*   Guarda o usuário dono do chat
*   Cada novo chat recebe um nome automático:

```
Chat #1
Chat #2
Chat #3
```

*   Sempre por usuário, baseado na contagem atual

#### Model: **Message**

*   Guarda mensagens enviadas pelo usuário e pelo bot
*   Campo `reply_to` permite encadear mensagens
*   Estrutura simples e escalável para manipulação no Django

- - -

### Lógica de Negócio

#### Filtragem por usuário

A listagem sempre retorna apenas chats pertencentes ao usuário:

```
Chat.objects.filter(user=user_id)
```

#### Nome automático dos chats

Gerado dinamicamente com base na quantidade atual de chats daquele usuário.

#### Respostas do bot

*   Usuário A recebe um conjunto específico de respostas
*   Usuário B recebe outro conjunto

#### Gerenciamento de estado no React

*   O estado global dos chats fica em `App.jsx`
*   `Chat.jsx` apenas exibe e envia mensagens
*   O backend responde e o React atualiza o estado com `setChats`
*   Estrutura simples, clara e fácil de manter

- - -

### Possíveis Erros e Soluções

#### 1\. Backend não roda

Verifique se o venv está ativo:

```
(venv) C:\cb\chatbot\backend>
```

Se não estiver:

```
.\venv\Scripts\activate
```

#### 2\. Erro de CORS no frontend

Adicionar no arquivo `settings.py`:

```
INSTALLED_APPS = [
    "corsheaders",
    "rest_framework",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
]

CORS_ALLOW_ALL_ORIGINS = True
```

#### 3\. Erro “405 Method Not Allowed”

Verifique a ordem das rotas no `urls.py`:

```
path("chats/send/", send_message),
path("chats/<str:user_id>/", list_chats),
path("chats/create/", create_chat),
```