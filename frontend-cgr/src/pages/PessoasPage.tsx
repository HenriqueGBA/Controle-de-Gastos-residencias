import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { Pessoa } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { UserPlus, Users } from "lucide-react";
import { Table, ColumnDef } from "../components/Table";

function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<number | null>(null);
  const [nomeEdicao, setNomeEdicao] = useState("");
  const [idadeEdicao, setIdadeEdicao] = useState<number | "">("");

  useEffect(() => {
    buscarPessoas();
  }, []);

  async function buscarPessoas() {
    setLoading(true);
    const res = await api.get("/pessoa");
    setPessoas(res.data);
    setLoading(false);
  }

  async function adicionarPessoa(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || idade === "") return;
    await api.post("/pessoa", { nome, idade: Number(idade) });
    setNome("");
    setIdade("");
    buscarPessoas();
  }

  function iniciarEdicao(pessoa: Pessoa) {
    setEditando(pessoa.id);
    setNomeEdicao(pessoa.nome);
    setIdadeEdicao(pessoa.idade);
  }

  async function salvarEdicao(id: number) {
    await api.put(`/pessoa/${id}`, { nome: nomeEdicao, idade: Number(idadeEdicao) });
    setEditando(null);
    setNomeEdicao("");
    setIdadeEdicao("");
    buscarPessoas();
  }

  function cancelarEdicao() {
    setEditando(null);
    setNomeEdicao("");
    setIdadeEdicao("");
  }

  async function excluirPessoa(id: number) {
    if (window.confirm("Tem certeza que deseja excluir esta pessoa? As transações associadas também serão removidas.")) {
      await api.delete(`/pessoa/${id}`);
      buscarPessoas();
    }
  }

  // --- colunas para Table ---
  const columns: ColumnDef<Pessoa>[] = [
    {
      header: "Nome",
      render: p =>
        editando === p.id
          ? (
            <Input value={nomeEdicao} onChange={e => setNomeEdicao(e.target.value)} maxLength={200} />
          )
          : p.nome
    },
    {
      header: "Idade",
      render: p =>
        editando === p.id
          ? (
            <Input
              value={idadeEdicao}
              type="number"
              min={0}
              onChange={e => {
                const val = e.target.value.replace(/\D/, "");
                setIdadeEdicao(val === "" ? "" : Number(val));
              }}
            />
          )
          : p.idade
    },
    {
      header: "Ações",
      render: p =>
        editando === p.id ? (
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => salvarEdicao(p.id)} type="button">
              Salvar
            </Button>
            <Button variant="primary" onClick={cancelarEdicao} type="button">
              Cancelar
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => iniciarEdicao(p)} type="button">
              Editar
            </Button>
            <Button variant="primary" onClick={() => excluirPessoa(p.id)} type="button">
              Excluir
            </Button>
          </div>
        )
    }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      <Card className="mb-8 w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <UserPlus className="w-6 h-6" />
            Adicionar Pessoa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={adicionarPessoa} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-gray-600">Nome</label>
              <Input
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Nome"
                maxLength={200}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Idade</label>
              <Input
                value={idade}
                onChange={e => {
                  const val = e.target.value.replace(/\D/, "");
                  setIdade(val === "" ? "" : Number(val));
                }}
                type="number"
                min={0}
                required
                className="w-20"
              />
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
            <Users className="w-6 h-6" />
            Lista de Pessoas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            columns={columns}
            data={pessoas}
            loading={loading}
            tableName="Pessoas"
            showSearch
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default PessoasPage;