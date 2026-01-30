import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { Transacao } from "../types";

function DashboardPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  useEffect(() => {
    api.get("/transacao").then(res => setTransacoes(res.data));
  }, []);

  const totalReceitas = transacoes.filter(t => t.tipo === "Receita").reduce((acc, t) => acc + t.valor, 0);
  const totalDespesas = transacoes.filter(t => t.tipo === "Despesa").reduce((acc, t) => acc + t.valor, 0);
  const saldo = totalReceitas - totalDespesas;

  return (
    <div>
      <h2>Dashboard</h2>
      <div>Total de Receitas: <b>R$ {totalReceitas.toFixed(2)}</b></div>
      <div>Total de Despesas: <b>R$ {totalDespesas.toFixed(2)}</b></div>
      <div>Saldo: <b>R$ {saldo.toFixed(2)}</b></div>
    </div>
  );
}

export default DashboardPage;