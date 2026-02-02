import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { Categoria } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Tag } from "lucide-react";

function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [descricao, setDescricao] = useState("");
  const [finalidade, setFinalidade] = useState<Categoria["finalidade"]>("Despesa");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarCategorias();
    // eslint-disable-next-line
  }, []);

  async function buscarCategorias() {
    setLoading(true);
    const res = await api.get("/categoria");
    setCategorias(res.data);
    setLoading(false);
  }

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/categoria", { descricao, finalidade });
    setDescricao("");
    setFinalidade("Despesa");
    buscarCategorias();
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      <Card className="mb-8 w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Tag className="w-6 h-6" />
            Adicionar Categoria
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
                maxLength={400}
                placeholder="Descrição"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Finalidade</label>
              <select
                value={finalidade}
                onChange={e => setFinalidade(e.target.value as Categoria["finalidade"])}
                className="border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
              >
                <option value="Despesa">Despesa</option>
                <option value="Receita">Receita</option>
                <option value="Ambas">Ambas</option>
              </select>
            </div>
            <Button type="submit" variant="primary" className="mt-1 w-full md:w-auto">
              Cadastrar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Tag className="w-6 h-6" />
            Lista de Categorias
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-gray-400">Carregando...</div>
          ) : categorias.length === 0 ? (
            <div className="py-12 text-center text-gray-400">Nenhuma categoria cadastrada.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-2 text-left font-semibold text-gray-700">Descrição</th>
                    <th className="p-2 text-left font-semibold text-gray-700">Finalidade</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map(c => (
                    <tr key={c.id} className="border-b last:border-none hover:bg-gray-50">
                      <td className="p-2">{c.descricao}</td>
                      <td className="p-2">{c.finalidade}</td>
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

export default CategoriasPage;