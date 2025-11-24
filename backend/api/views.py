from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Chat, Message

@api_view(["POST"])
def create_chat(request):
    user = request.data.get("user_id")
    total_chats = Chat.objects.filter(user=user).count()
    name = f"Chat #{total_chats + 1}"
    chat = Chat.objects.create(user=user, name=name)
    return Response({
        "id": chat.id,
        "name": chat.name,
        "created_at": chat.created_at
    })

@api_view(["GET"])
def list_chats(request, user_id):
    chats = Chat.objects.filter(user=user_id).order_by("created_at")
    data = [
        {
            "id": chat.id,
            "name": chat.name,
            "created_at": chat.created_at,
            "history": [
                {
                    "id": msg.id,
                    "sender": msg.sender,
                    "text": msg.text,
                    "created_at": msg.created_at,
                    "reply_to": msg.reply_to.id if msg.reply_to else None
                }
                for msg in chat.messages.all().order_by("created_at")
            ]
        }
        for chat in chats
    ]
    return Response(data)

@api_view(["POST"])
def send_message(request):
    chat_id = request.data.get("chat_id")
    user = request.data.get("user_id")
    name = request.data.get("user_name")
    text = request.data.get("text")

    chat = Chat.objects.get(id=chat_id)

    user_msg = Message.objects.create(
        chat=chat,
        sender=name,
        text=text
    )

    if user == "A":
        bot_text = f"Olá! Obrigado pelo contato, {name}. Em breve nós te retornaremos."
    else:
        bot_text = f"Oi! Agradecemos por seu contato, {name}. Responderemos a sua mensagem em breve."

    bot_msg = Message.objects.create(
        chat=chat,
        sender="Bot",
        text=bot_text,
        reply_to=user_msg
    )

    return Response({
        "user_message": {
            "id": user_msg.id,
            "text": user_msg.text,
            "created_at": user_msg.created_at,
            "sender": user_msg.sender
        },
        "bot_message": {
            "id": bot_msg.id,
            "text": bot_msg.text,
            "created_at": bot_msg.created_at,
            "reply_to": user_msg.id
        }
    })
