import { useState, useRef, useEffect } from "react";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);

  async function sendMessage() {
    if (!input.trim()) return;

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/receive-message/", {
        user_id: user,
        text: input
      });

      setHistory(prev => [
        ...prev,
        { sender: user, text: input },
        { sender: "BOT", text: res.data.bot_message.text }
      ]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }

    setInput("");
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Tela de seleção de usuário
  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: 80, fontFamily: "Arial, sans-serif" }}>
        <h2>Escolha um usuário:</h2>
        <button
          onClick={() => setUser("A")}
          style={buttonStyle("#4CAF50")}
        >
          Entrar como A
        </button>
        <button
          onClick={() => setUser("B")}
          style={{ ...buttonStyle("#2196F3"), marginLeft: 10 }}
        >
          Entrar como B
        </button>
      </div>
    );
  }

  // Tela principal do chat
  return (
    <div style={{ maxWidth: 500, margin: "50px auto", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h2>Chat — Usuário {user}</h2>
        <div>
          <button onClick={() => setHistory([])} style={smallButtonStyle("#f44336")}>Sair do chat</button>
          <button onClick={() => setUser(null)} style={{ ...smallButtonStyle("#777"), marginLeft: 5 }}>Voltar</button>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 10,
          padding: 10,
          height: 400,
          overflowY: "auto",
          marginBottom: 10,
          backgroundColor: "#f9f9f9"
        }}
      >
        {history.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.sender === "BOT" ? "flex-start" : "flex-end",
              marginBottom: 10
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "10px 15px",
                borderRadius: 20,
                backgroundColor: msg.sender === "BOT" ? "#eee" : "#4CAF50",
                color: msg.sender === "BOT" ? "#000" : "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
              }}
            >
              <strong style={{ fontSize: 12 }}>
                {msg.sender === "BOT" ? "Bot" : user}
              </strong>
              <p style={{ margin: "5px 0 0 0", fontSize: 14 }}>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex" }}>
        <input
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 20,
            border: "1px solid #ccc",
            outline: "none",
            fontSize: 14
          }}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: 10,
            padding: "10px 20px",
            borderRadius: 20,
            border: "none",
            backgroundColor: "#2196F3",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

// Estilos reutilizáveis
const buttonStyle = (bg) => ({
  padding: "10px 20px",
  borderRadius: 5,
  border: "none",
  cursor: "pointer",
  backgroundColor: bg,
  color: "white",
  fontWeight: "bold"
});

const smallButtonStyle = (bg) => ({
  padding: "5px 10px",
  borderRadius: 5,
  border: "none",
  cursor: "pointer",
  backgroundColor: bg,
  color: "white",
  fontWeight: "bold",
  fontSize: 12
});

export default App;
