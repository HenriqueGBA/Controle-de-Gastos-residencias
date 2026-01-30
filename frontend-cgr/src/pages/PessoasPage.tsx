import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { Pessoa } from "../types";

function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState(0);

  useEffect(() => {
    api.get("/pessoa").then(res => setPessoas(res.data));
  }, []);

  const adicionarPessoa = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/pessoa", { nome, idade });
    setNome("");
    setIdade(0);
    const res = await api.get("/pessoa");
    setPessoas(res.data);
  };

  return (
    <div>
      <h1>Pessoas</h1>
      <form onSubmit={adicionarPessoa}>
        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" maxLength={200} required />
        <input value={idade} onChange={e => setIdade(Number(e.target.value))} type="number" min={0} required />
        <button type="submit">Adicionar</button>
      </form>
      <ul>
        {pessoas.map(p => (
          <li key={p.id}>{p.nome} (Idade: {p.idade})</li>
        ))}
      </ul>
    </div>
  );
}

export default PessoasPage;