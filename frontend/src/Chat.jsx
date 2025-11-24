import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./styles.css";

export default function Chat({ user, chats, activeChatId, setChats, setActiveChatId }) {
    const [input, setInput] = useState("");
    const scrollRef = useRef();

    const activeChat = chats.find(c => c.id === activeChatId);
    const currentHistory = activeChat?.history || [];

    async function sendMessage() {
        if (!input.trim() || !activeChat) return;

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/chats/send/", {
                chat_id: activeChat.id,
                user_id: user.id,
                user_name: user.name,
                text: input
            });

            const newMessages = [
                {
                    id: res.data.user_message.id,
                    sender: res.data.user_message.sender,
                    text: res.data.user_message.text
                },
                {
                    id: res.data.bot_message.id,
                    sender: "Bot",
                    text: res.data.bot_message.text
                }
            ];

            setChats(prev =>
                prev.map(chat =>
                    chat.id === activeChat.id
                        ? { ...chat, history: [...(chat.history || []), ...newMessages] }
                        : chat
                )
            );
            setInput("");
        } catch (err) {
            console.error(err);
            alert("Erro ao enviar mensagem");
        }
    }

    useEffect(() => {
        if (scrollRef.current)
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [currentHistory.length]);

    if (!activeChat) return <p className="centered">Nenhum chat ativo.</p>;

    return (
        <div className="chat-col card">
            <div className="chat-header">
                <h3 className="chat-title">{activeChat.name}</h3>
                <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn ghost" onClick={() => setActiveChatId(null)}>Fechar</button>
                </div>
            </div>

            <div ref={scrollRef} className="messages" aria-live="polite">
                {currentHistory.map((msg, i) => {
                    const isUser = String(msg.sender).toLowerCase() !== "bot";
                    return (
                        <div key={i} className={`message ${isUser ? "user" : "bot"}`}>
                            <span className="msg-sender">{isUser ? msg.sender : "Bot"}</span>
                            <div>{msg.text}</div>
                        </div>
                    );
                })}
            </div>

            <div className="input-row">
                <input
                    className="input"
                    aria-label="Mensagem"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                />
                <button className="btn" onClick={sendMessage}>Enviar</button>
            </div>
        </div>
    );
}
