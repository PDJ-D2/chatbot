import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Chat from "./Chat";
import Historico from "./Historico";
import axios from "axios";
import "./styles.css";

export default function App() {
  const navigate = useNavigate();

  const [names, setNames] = useState({
    A: localStorage.getItem("nameA") || "Usuário A",
    B: localStorage.getItem("nameB") || "Usuário B"
  });

  const [user, setUser] = useState(() => {
    const id = localStorage.getItem("activeUserId");
    if (!id) return null;
    return {
      id,
      name: localStorage.getItem(id === "A" ? "nameA" : "nameB") || (id === "A" ? "Usuário A" : "Usuário B")
    };
  });

  const [editingNames, setEditingNames] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    localStorage.setItem("nameA", names.A);
    localStorage.setItem("nameB", names.B);
  }, [names]);

  useEffect(() => {
    if (user) localStorage.setItem("activeUserId", user.id);
    else localStorage.removeItem("activeUserId");
  }, [user]);

  useEffect(() => {
    if (!user) return;
    axios.get(`http://127.0.0.1:8000/api/chats/${user.id}/`).then(res => {
      setChats(res.data);
      if (res.data.length > 0) setActiveChatId(res.data[0].id);
    });
  }, [user]);

  function saveNames() {
    const nameA = names.A.trim();
    const nameB = names.B.trim();

    if (!nameA || !nameB) {
      alert("Os nomes não podem ficar vazios.");
      return;
    }

    setNames({ A: nameA, B: nameB });

    setEditingNames(false);

    if (user) {
      setUser({ id: user.id, name: user.id === "A" ? nameA : nameB });
    }
  }

  async function createNewChat() {
    if (!user) return;
    const res = await axios.post("http://127.0.0.1:8000/api/chats/create/", { user_id: user.id });
    const newChat = { ...res.data, history: [] };
    setChats(prev => [...prev, newChat]);
    setActiveChatId(newChat.id);
  }

  const homePage = editingNames ? (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h2>Editar nomes</h2>
      <input value={names.A} onChange={e => setNames(prev => ({ ...prev, A: e.target.value }))} />
      <br />
      <input value={names.B} onChange={e => setNames(prev => ({ ...prev, B: e.target.value }))} />
      <br />
      <button onClick={saveNames}>Salvar</button>
      <button onClick={() => setEditingNames(false)}>Cancelar</button>
    </div>
  ) : !user ? (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h2>Escolha um usuário:</h2>
      <button onClick={() => setUser({ id: "A", name: names.A })}>Entrar como {names.A}</button>
      <button onClick={() => setUser({ id: "B", name: names.B })} style={{ marginLeft: 10 }}>
        Entrar como {names.B}
      </button>
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setEditingNames(true)}>Editar nomes</button>
      </div>
    </div>
  ) : (
    <div style={{ maxWidth: 500, margin: "50px auto" }}>
      <button onClick={() => setUser(null)}>← Trocar usuário</button>
      <button onClick={() => navigate("/historico")} style={{ marginLeft: 10 }}>
        Ver Históricos
      </button>
      <button onClick={createNewChat} style={{ marginLeft: 10 }}>
        Novo Chat
      </button>

      <Chat
        user={user}
        chats={chats}
        activeChatId={activeChatId}
        setChats={setChats}
        setActiveChatId={setActiveChatId}
      />
    </div>
  );

  return (
    <div className="app-center">
      <header className="topbar">
        <div className="top-user">
          Usuário ativo: <strong>{user?.name || "Nenhum"}</strong>
        </div>
      </header>

      <div className="content">
        <Routes>
          <Route path="/" element={homePage} />
          <Route
            path="/historico"
            element={<Historico chats={chats} setActiveChatId={setActiveChatId} />}
          />
        </Routes>
      </div>
    </div>
  );
}