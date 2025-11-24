# Chatbot de Atendimento Simulado

Este é um protótipo fullstack de um sistema de chat criado com **Python, Django + Django REST Framework** no backend e **React + Vite** no frontend.  
Ele simula um atendimento entre dois usuários (“Usuário A” e “Usuário B”) e um bot que responde automaticamente.

Este README explica como **baixar**, **instalar**, **configurar** e **rodar tudo localmente**, além de descrever resumidamente as decisões técnicas usadas no projeto.

---

# Como rodar o projeto localmente

## 1. Faça o download do projeto

Se estiver usando Git:

```bash
git clone <URL-do-seu-repositório>
cd projeto
````

Se estiver baixando ZIP:

* Clique em **Download ZIP**
* Extraia a pasta
* Entre nela pelo terminal/cmd

Dentro dela você terá:

```
/backend
/frontend
```

---

# BACKEND (Django)

## 2.1 — Entre na pasta do backend

```bash
cd backend
```

---

## 2.2 — Criar o ambiente virtual (venv)

### Windows (PowerShell)

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### Windows (CMD)

```cmd
python -m venv venv
venv\Scripts\activate.bat
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

Se o ambiente estiver ativo, o terminal ficará assim:

```
(venv) C:\seu\projeto\backend>
```

---

## 2.3 — Instalar dependências do backend

```bash
pip install django djangorestframework django-cors-headers
```

---

## 2.4 — Aplicar migrações

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 2.5 — Rodar o backend

```bash
python manage.py runserver
```

O backend estará disponível em:

**[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

# FRONTEND (React + Vite)

## 3.1 — Entre na pasta do frontend

```bash
cd ../frontend
```

---

## 3.2 — Instalar as dependências do frontend

```bash
npm install
```

Dependências instaladas automaticamente:

```
@eslint/js
@types/react
@types/react-dom
@vitejs/plugin-react
axios
eslint
eslint-plugin-react-hooks
eslint-plugin-react-refresh
globals
react
react-dom
react-router-dom
vite
```

---

## 3.3 — Rodar o frontend

```bash
npm run dev
```

O frontend estará disponível em:

 **[http://localhost:5173](http://localhost:5173)**

---

# Como usar o sistema

1. Abra o frontend (`http://localhost:5173`).
2. Escolha **Entrar como Usuário A** ou **Usuário B**.
3. Clique em **Novo Chat** para iniciar um novo chat (backend gera automaticamente nomes como *Chat #1*, *Chat #2*…).
4. Envie mensagens no chat.
5. O backend responde automaticamente com mensagens diferentes para cada usuário.
6. A rota **/historico** exibe apenas o histórico do usuário selecionado.

---

# Como foi feita a lógica do projeto

### Filtragem por usuário

* Toda rota de histórico usa `Chat.objects.filter(user=user_id)`
* Apenas chats do usuário logado aparecem.

### Nome automático dos chats

Sempre cria:

```
Chat #1
Chat #2
Chat #3
...
```

com base na contagem **por usuário**.

### Respostas do bot

Backend retorna mensagens diferentes para User A e User B:

Exemplo:

* Usuário A → "Olá! Obrigado pelo contato, ... "
* Usuário B → "Oi! Agradecemos pelo contato, ... "

---

# Possiveis erros

### 1. Backend não roda

Verifique se o venv está ativo:

```
(venv) C:\projeto\backend>
```

Se não estiver, ative com:

```powershell
.\venv\Scripts\Activate.ps1
```

---

### 2. Erro de CORS no frontend

Certifique-se de que o backend tem:

No `settings.py`:

```python
INSTALLED_APPS = [
    "corsheaders",
    "rest_framework",
    ...
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    ...
]

CORS_ALLOW_ALL_ORIGINS = True
```

---

### 3. Erro “405 Method Not Allowed”

Geralmente é porque a rota dinâmica `<user_id>` estava acima de `/send/`.

A ordem correta no `urls.py` é:

```python
path("chats/send/", send_message),
path("chats/<str:user_id>/", list_chats),
path("chats/create/", create_chat),
```