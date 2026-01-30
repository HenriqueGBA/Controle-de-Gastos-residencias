import React, { useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { Input } from "../components/Input";
// Adapte para importar sua API e tipos reais!
import { api } from "../api/api"; 
import { Transacao } from "../types";

export default function DashboardPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/transacao")
      .then(res => setTransacoes(res.data))
      .finally(() => setLoading(false));
  }, []);

  const totalReceitas = transacoes.filter(t => t.tipo === "Receita").reduce((acc, t) => acc + t.valor, 0);
  const totalDespesas = transacoes.filter(t => t.tipo === "Despesa").reduce((acc, t) => acc + t.valor, 0);
  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-blue-700">
          <DollarSign className="w-8 h-8" />  
          Controle de Gastos
        </h1>
        <div>
          <Input
            placeholder="Buscar transação..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
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
            <div className="text-3xl font-bold text-green-700">{totalReceitas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
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
            <div className="text-3xl font-bold text-red-700">{totalDespesas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
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
            <div className={`text-3xl font-bold ${saldo >= 0 ? "text-blue-700" : "text-red-700"}`}>
              {saldo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Exemplo: lista de transações simples */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-16 text-center text-gray-400">Carregando...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-2 text-left font-semibold text-gray-700">Descrição</th>
                    <th className="p-2 text-left font-semibold text-gray-700">Tipo</th>
                    <th className="p-2 text-left font-semibold text-gray-700">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {transacoes
                    .filter(t =>
                      t.descricao?.toLowerCase().includes(search.toLowerCase())
                    )
                    .slice(0, 10).map(t => (
                    <tr key={t.id} className="border-b last:border-none">
                      <td className="p-2">{t.descricao}</td>
                      <td className={`p-2 font-semibold ${t.tipo === "Receita" ? "text-green-700" : "text-red-700"}`}>{t.tipo}</td>
                      <td className="p-2">{t.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                    </tr>
                  ))}
                  {transacoes.length === 0 && (
                    <tr>
                      <td className="p-4 text-center text-gray-400" colSpan={3}>Nenhuma transação encontrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}