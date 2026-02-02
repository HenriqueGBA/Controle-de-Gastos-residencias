import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { Transacao, Categoria } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { ArrowUpCircle, ArrowDownCircle, FileSpreadsheet } from "lucide-react";
import { Pessoa } from "../types";

function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number | "">("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [tipo, setTipo] = useState<"Despesa" | "Receita">("Despesa");
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [pessoaId, setPessoaId] = useState<number | "">("");


  const tipoMap = {
    "Despesa": 0,
    "Receita": 1
  }

  useEffect(() => {
    buscarTransacoes();
    buscarCategorias();
  }, []);

  async function buscarPessoas() {
  const res = await api.get("/pessoa");
  setPessoas(res.data);
  }
  useEffect(() => {
    buscarTransacoes();
    buscarCategorias();
    buscarPessoas();
  }, []);

  async function buscarTransacoes() {
    setLoading(true);
    const res = await api.get("/transacao");
    setTransacoes(res.data);
    setLoading(false);
  }

  async function buscarCategorias() {
    const res = await api.get("/categoria");
    setCategorias(res.data);
  }

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!descricao || !valor || !categoriaId) return;
    await api.post("/transacao", {
      descricao,
      valor: Number(valor),
      tipo: tipoMap[tipo],
      categoriaId: Number(categoriaId),
      pessoaId: Number(pessoaId)
    });
    setDescricao("");
    setValor("");
    setCategoriaId("");
    setTipo("Despesa");
    buscarTransacoes();
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Formulário de cadastro */}
      <Card className="mb-8 w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <FileSpreadsheet className="w-6 h-6" />
            Adicionar Transação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={adicionar} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-gray-600">Descrição</label>
              <Input
                required
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                placeholder="Descrição"
                maxLength={400}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Valor (R$)</label>
              <Input
                required
                value={valor}
                onChange={e => setValor(e.target.value === "" ? "" : Number(e.target.value))}
                type="number"
                min={0}
                step="0.01"
                placeholder="0,00"
                className="w-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Categoria</label>
              <select
                required
                value={categoriaId}
                onChange={e => setCategoriaId(Number(e.target.value))}
                className="border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
              >
                <option value="">Selecione</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.descricao}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Tipo</label>
              <select
                value={tipo}
                onChange={e => setTipo(e.target.value as "Despesa" | "Receita")}
                className="border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
              >
                <option value="Despesa">Despesa</option>
                <option value="Receita">Receita</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Pessoa</label>
              <select
                required
                value={pessoaId}
                onChange={e => setPessoaId(Number(e.target.value))}
                className="border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
              >
                <option value="">Selecione</option>
                {pessoas.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="primary" className="mt-1 w-full md:w-auto">
              Adicionar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de transações */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <FileSpreadsheet className="w-6 h-6" />
            Lista de Transações
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-gray-400">Carregando...</div>
          ) : transacoes.length === 0 ? (
            <div className="py-12 text-center text-gray-400">Nenhuma transação encontrada.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-2 text-left font-semibold text-gray-700">Descrição</th>
                    <th className="p-2 text-left font-semibold text-gray-700">Valor</th>
                    <th className="p-2 text-left font-semibold text-gray-700">Categoria</th>
                    <th className="p-2 text-left font-semibold text-gray-700">Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {transacoes.map(t => (
                    <tr key={t.id} className="border-b last:border-none hover:bg-gray-50">
                      <td className="p-2">{t.descricao}</td>
                      <td className={`p-2 font-semibold ${t.tipo === "Receita" ? "text-green-700" : "text-red-700"}`}>
                        {Number(t.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </td>
                      <td className="p-2">
                        {categorias.find(cat => cat.id === t.categoriaId)?.descricao || "-"}
                      </td>
                      <td className={`p-2 flex items-center gap-1`}>
                        {t.tipo === "Receita" ? (
                          <ArrowUpCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className={t.tipo === "Receita" ? "text-green-700" : "text-red-700"}>{t.tipo}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TransacoesPage;