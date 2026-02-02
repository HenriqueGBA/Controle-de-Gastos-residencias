import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { Pessoa } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { UserPlus, Users } from "lucide-react";

function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState<number | "">("");
  const [loading, setLoading] = useState(true);

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
          {loading ? (
            <div className="py-12 text-center text-gray-400">Carregando...</div>
          ) : pessoas.length === 0 ? (
            <div className="py-12 text-center text-gray-400">Nenhuma pessoa cadastrada.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-2 text-left font-semibold text-gray-700">Nome</th>
                    <th className="p-2 text-left font-semibold text-gray-700">Idade</th>
                  </tr>
                </thead>
                <tbody>
                  {pessoas.map(p => (
                    <tr key={p.id} className="border-b last:border-none hover:bg-gray-50">
                      <td className="p-2">{p.nome}</td>
                      <td className="p-2">{p.idade}</td>
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

export default PessoasPage;