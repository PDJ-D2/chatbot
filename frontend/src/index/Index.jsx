import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Index() {
    const { id } = useParams();     // "A" ou "B"
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);

    const storageKey = `chat_${id}`; // chat_A ou chat_B

    // Carregar histórico ao entrar
    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            setChat(JSON.parse(saved));
        }
    }, [id]);

    // Salvar sempre que mudar
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(chat));
    }, [chat]);

    function handleSend() {
        if (!message.trim()) return;

        const newMsg = {
            sender: id,
            text: message,
            time: Date.now()
        };

        setChat(prev => [...prev, newMsg]); // adiciona na tela
        setMessage("");
    }

    return (
        <div style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            padding: 20
        }}>

            <h2>Chat – Usuário {id}</h2>

            {/* Área do histórico */}
            <div style={{
                flex: 1,
                overflowY: "auto",
                marginTop: 10,
                padding: 10,
                background: "#f4f4f4",
                borderRadius: 8
            }}>
                {chat.map((msg, i) => (
                    <div key={i} style={{
                        marginBottom: 12,
                        textAlign: msg.sender === id ? "right" : "left"
                    }}>
                        <div style={{
                            display: "inline-block",
                            padding: "8px 12px",
                            background: msg.sender === id ? "#4e8cff" : "#ddd",
                            color: msg.sender === id ? "#fff" : "#000",
                            borderRadius: 8
                        }}>
                            <strong>{msg.sender}: </strong>{msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Campo + botão */}
            <div style={{ display: "flex", marginTop: 10 }}>
                <input
                    style={{
                        flex: 1,
                        padding: 10,
                        marginRight: 10,
                        borderRadius: 8,
                        border: "1px solid #ccc"
                    }}
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />

                <button
                    onClick={handleSend}
                    style={{
                        padding: "10px 20px",
                        borderRadius: 8,
                        background: "#4e8cff",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    Enviar
                </button>
            </div>
        </div>
    );
}
