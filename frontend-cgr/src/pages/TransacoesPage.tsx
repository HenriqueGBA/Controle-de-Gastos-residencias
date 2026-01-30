import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { Categoria } from "../types";

function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [descricao, setDescricao] = useState("");
  const [finalidade, setFinalidade] = useState<Categoria["finalidade"]>("Despesa");

  useEffect(() => {
    api.get("/categoria").then(res => setCategorias(res.data));
  }, []);

  const adicionar = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/categoria", { descricao, finalidade });
    setDescricao("");
    setFinalidade("Despesa");
    const res = await api.get("/categoria");
    setCategorias(res.data);
  };

  return (
    <div>
      <h2>Categorias</h2>
      <form onSubmit={adicionar}>
        <input required value={descricao} onChange={e => setDescricao(e.target.value)} maxLength={400} placeholder="Descrição" />
        <select value={finalidade} onChange={e => setFinalidade(e.target.value as Categoria["finalidade"])}>
          <option value="Despesa">Despesa</option>
          <option value="Receita">Receita</option>
          <option value="Ambas">Ambas</option>
        </select>
        <button type="submit">Cadastrar</button>
      </form>
      <ul>
        {categorias.map(c => (
          <li key={c.id}>{c.descricao} ({c.finalidade})</li>
        ))}
      </ul>
    </div>
  );
}
export default CategoriasPage;