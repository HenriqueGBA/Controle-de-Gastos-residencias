import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../api/api";
import { Transacao, Categoria, Pessoa } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { ArrowUpCircle, ArrowDownCircle, FileSpreadsheet } from "lucide-react";
import { Table, ColumnDef } from "../components/Table";

function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number | "">("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [tipo, setTipo] = useState<"Despesa" | "Receita">("Despesa");
  const [pessoaId, setPessoaId] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  const [editando, setEditando] = useState<number | null>(null);
  const [descricaoEdicao, setDescricaoEdicao] = useState("");
  const [valorEdicao, setValorEdicao] = useState<number | "">("");
  const [categoriaIdEdicao, setCategoriaIdEdicao] = useState<number | "">("");
  const [tipoEdicao, setTipoEdicao] = useState<"Despesa" | "Receita">("Despesa");
  const [pessoaIdEdicao, setPessoaIdEdicao] = useState<number | "">("");

  const tipoLabels = ["Despesa", "Receita"] as const;
  const tipoColors = ["text-red-700", "text-green-700"] as const;
  const tipoIcons = [ArrowDownCircle, ArrowUpCircle] as const;
  const tipoMap = { "Despesa": 0, "Receita": 1 };

  useEffect(() => {
    buscarTransacoes();
    buscarCategorias();
    buscarPessoas();
  }, []);

  async function buscarPessoas() {
    try {
      const res = await api.get("/pessoa");
      setPessoas(res.data);
    } catch {
      toast.error("Erro ao buscar pessoas");
    }
  }
  async function buscarTransacoes() {
    setLoading(true);
    try {
      const res = await api.get("/transacao");
      setTransacoes(res.data);
    } catch {
      toast.error("Erro ao buscar transações");
    }
    setLoading(false);
  }
  async function buscarCategorias() {
    try {
      const res = await api.get("/categoria");
      setCategorias(res.data);
    } catch {
      toast.error("Erro ao buscar categorias");
    }
  }

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!descricao || !valor || !categoriaId || !pessoaId) {
      toast.error("Preencha todos os campos!");
      return;
    }
    try {
      await api.post("/transacao", {
        descricao,
        valor: Number(valor),
        tipo: tipoMap[tipo],
        categoriaId: Number(categoriaId),
        pessoaId: Number(pessoaId)
      });
      toast.success("Transação criada!");
      setDescricao("");
      setValor("");
      setCategoriaId("");
      setTipo("Despesa");
      setPessoaId("");
      buscarTransacoes();
    } catch (e: any) {
      toast.error(e?.response?.data || "Erro ao adicionar transação");
    }
  }

  function iniciarEdicao(t: Transacao) {
    setEditando(t.id);
    setDescricaoEdicao(t.descricao);
    setValorEdicao(t.valor);
    setCategoriaIdEdicao(t.categoriaId);
    setTipoEdicao(tipoLabels[t.tipo as number]);
    setPessoaIdEdicao(t.pessoaId);
  }

  async function salvarEdicao(id: number) {
    try {
      await api.put(`/transacao/${id}`, {
        descricao: descricaoEdicao,
        valor: Number(valorEdicao),
        tipo: tipoMap[tipoEdicao],
        categoriaId: Number(categoriaIdEdicao),
        pessoaId: Number(pessoaIdEdicao)
      });
      toast.success("Transação editada!");
      setEditando(null);
      buscarTransacoes();
    } catch (e: any) {
      toast.error(e?.response?.data || "Erro ao editar transação");
    }
  }

  function cancelarEdicao() {
    setEditando(null);
  }

  async function excluirTransacao(id: number) {
    if(window.confirm("Deseja realmente excluir esta transação?")) {
      try {
        await api.delete(`/transacao/${id}`);
        toast.success("Transação excluída!");
        buscarTransacoes();
      } catch (e: any) {
        toast.error(e?.response?.data || "Erro ao excluir transação");
      }
    }
  }

  const columns: ColumnDef<Transacao>[] = [
    {
      header: "Descrição",
      render: t => editando === t.id
        ? <Input value={descricaoEdicao} onChange={e => setDescricaoEdicao(e.target.value)} maxLength={400} />
        : t.descricao
    },
    {
      header: "Valor",
      render: t => editando === t.id
        ? <Input value={valorEdicao} type="number" min={0} step="0.01"
            onChange={e => setValorEdicao(e.target.value === "" ? "" : Number(e.target.value))} />
        : <span className={`font-semibold ${tipoColors[t.tipo as number]}`}>
            {Number(t.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
    },
    {
      header: "Categoria",
      render: t => editando === t.id
        ? (
          <select value={categoriaIdEdicao} onChange={e => setCategoriaIdEdicao(Number(e.target.value))}
            className="border rounded-lg px-2 py-1 bg-white">
            <option value="">Selecione</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.descricao}</option>
            ))}
          </select>
        )
        : categorias.find(cat => cat.id === t.categoriaId)?.descricao || "-"
    },
    {
      header: "Tipo",
      render: t => editando === t.id
        ? (
          <select value={tipoEdicao} onChange={e => setTipoEdicao(e.target.value as "Despesa"|"Receita")}
            className="border rounded-lg px-2 py-1 bg-white"
          >
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
          </select>
        )
        : <span className={`flex items-center gap-1 ${tipoColors[t.tipo as number]}`}>
            {React.createElement(tipoIcons[t.tipo as number], { className: `w-4 h-4 ${t.tipo === 0 ? "text-red-600" : "text-green-600"}` })}
            {tipoLabels[t.tipo as number]}
          </span>
    },
    {
      header: "Pessoa",
      render: t => editando === t.id
        ? (
          <select value={pessoaIdEdicao} onChange={e => setPessoaIdEdicao(Number(e.target.value))}
            className="border rounded-lg px-2 py-1 bg-white">
            <option value="">Selecione</option>
            {pessoas.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        )
        : pessoas.find(p => p.id === t.pessoaId)?.nome || "-"
    },
    {
      header: "Ações",
      render: t => editando === t.id ? (
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => salvarEdicao(t.id)} type="button">Salvar</Button>
          <Button variant="primary" onClick={cancelarEdicao} type="button">Cancelar</Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => iniciarEdicao(t)} type="button">Editar</Button>
          <Button variant="primary" onClick={() => excluirTransacao(t.id)} type="button">Excluir</Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
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

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <FileSpreadsheet className="w-6 h-6" />
            Lista de Transações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            columns={columns}
            data={transacoes}
            loading={loading}
            tableName="Transações"
            showSearch
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default TransacoesPage;