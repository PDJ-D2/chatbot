import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function Historico({ chats = [], setActiveChatId }) {
    const navigate = useNavigate();

    return (
        <div className="card" style={{ maxWidth: 420 }}>
            <h2 style={{ marginTop: 0 }}>Históricos</h2>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <button className="btn ghost" onClick={() => navigate("/")} style={{ padding: "8px 10px" }}>← Voltar</button>
            </div>

            {chats.length === 0 ? (
                <p className="centered">Nenhum chat encontrado.</p>
            ) : (
                <div className="history-list">
                    {chats.map(chat => (
                        <div key={chat.id} className="h-card" onClick={() => { setActiveChatId(chat.id); navigate("/"); }}>
                            <div>
                                <div className="h-title">{chat.name}</div>
                                <div className="h-sub">{(chat.history?.length || 0)} mensagens</div>
                            </div>
                            <div style={{ fontSize: 12, color: "var(--muted)" }}>Abrir →</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
