import React, { useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { Input } from "../components/Input";
import { api } from "../api/api";
import { Transacao, Pessoa } from "../types";
import { Table, ColumnDef } from "../components/Table";

export default function DashboardPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [pessoaFiltro, setPessoaFiltro] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const tipoLabels = ["Despesa", "Receita"] as const;

  useEffect(() => {
    api.get("/pessoa").then((res) => setPessoas(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get("/transacao")
      .then((res) => setTransacoes(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Filtra transações por pessoa, se selecionada
  const transacoesFiltradas = pessoaFiltro
    ? transacoes.filter((t) => t.pessoaId === pessoaFiltro)
    : transacoes;

  const dadosRecentes = transacoesFiltradas
    .filter((t) =>
      t.descricao?.toLowerCase().includes(search.toLowerCase()),
    )
    .slice(0, 10);

  const totalDespesas = transacoesFiltradas
    .filter((t) => t.tipo === 0)
    .reduce((acc, t) => acc + t.valor, 0);
  const totalReceitas = transacoesFiltradas
    .filter((t) => t.tipo === 1)
    .reduce((acc, t) => acc + t.valor, 0);
  const saldo = totalReceitas - totalDespesas;

  // Definição das colunas da Table
  const columns: ColumnDef<Transacao>[] = [
    {
      header: "Descrição",
      render: (t) => t.descricao,
    },
    {
      header: "Tipo",
      render: (t) => (
        <span
          className={`font-semibold ${
            t.tipo === 0 ? "text-red-700" : "text-green-700"
          }`}
        >
          {tipoLabels[t.tipo as number]}
        </span>
      ),
    },
    {
      header: "Valor",
      render: (t) =>
        t.valor.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
    },
    {
      header: "Pessoa",
      render: (t) =>
        pessoas.find((p) => p.id === t.pessoaId)?.nome || "-",
    },
  ];

  return (
    <div className="p-8 min-h-screen">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-blue-700">
          <DollarSign className="w-8 h-8" />
          Controle de Gastos
        </h1>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <Input
            placeholder="Buscar transação..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={pessoaFiltro}
            onChange={(e) =>
              setPessoaFiltro(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            className="border rounded-lg px-3 py-2 text-gray-700 outline-none bg-white"
          >
            <option value="">Todas as pessoas</option>
            {pessoas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <ArrowUpCircle className="w-6 h-6" />
              Receitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">
              {totalReceitas.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <ArrowDownCircle className="w-6 h-6" />
              Despesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">
              {totalDespesas.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <DollarSign className="w-6 h-6" />
              Saldo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                saldo >= 0 ? "text-blue-700" : "text-red-700"
              }`}
            >
              {saldo.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            columns={columns}
            data={dadosRecentes}
            loading={loading}
            tableName="Transações"
            showSearch={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}