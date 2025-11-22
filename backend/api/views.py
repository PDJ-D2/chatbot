from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Message

@api_view(["POST"])
def receive_message(request):
    user = request.data.get("user_id")  # agora é 'user', não 'user_id'
    text = request.data.get("text")

    if not text:
        return Response({"error": "Texto vazio"}, status=400)

    # 1) Salva a mensagem do usuário
    user_msg = Message.objects.create(
        user=user,  # <-- aqui mudou
        sender="user",
        text=text
    )

    # 2) Gera resposta do bot (exemplo simples)
    bot_text = f"Você disse: {text}"

    # 3) Salva a resposta vinculada ao user_msg via reply_to
    bot_msg = Message.objects.create(
        user=user,  # <-- aqui também
        sender="bot",
        text=bot_text,
        reply_to=user_msg
    )

    # 4) Retorna os dados pro front
    return Response({
        "user_message": {
            "id": user_msg.id,
            "text": user_msg.text,
            "created_at": user_msg.created_at
        },
        "bot_message": {
            "id": bot_msg.id,
            "text": bot_msg.text,
            "created_at": bot_msg.created_at,
            "reply_to": user_msg.id
        }
    })
