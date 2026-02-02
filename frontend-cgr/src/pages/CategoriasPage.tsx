import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { Categoria } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Tag } from "lucide-react";

// Mapeamento seguro de número para label
const finalidadeLabels = ["Despesa", "Receita", "Ambas"] as const;

function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [descricao, setDescricao] = useState("");
  const [finalidade, setFinalidade] = useState<"Despesa" | "Receita" | "Ambas">("Despesa");
  const [loading, setLoading] = useState(true);

  // Edição
  const [editando, setEditando] = useState<number | null>(null);
  const [descricaoEdicao, setDescricaoEdicao] = useState("");
  const [finalidadeEdicao, setFinalidadeEdicao] = useState<"Despesa" | "Receita" | "Ambas">("Despesa");

  // Maps para converter entre string no input/select e number do backend
  const finalidadeMap = {
    "Despesa": 0,
    "Receita": 1,
    "Ambas": 2
  } as const;
  const finalidadeStringFromNumber = (n: number) => finalidadeLabels[n] || "Indefinido";

  useEffect(() => {
    buscarCategorias();
  }, []);

  async function buscarCategorias() {
    setLoading(true);
    const res = await api.get("/categoria");
    setCategorias(res.data);
    setLoading(false);
  }

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/categoria", {
      descricao,
      finalidade: finalidadeMap[finalidade]
    });
    setDescricao("");
    setFinalidade("Despesa");
    buscarCategorias();
  }

  function iniciarEdicao(categoria: Categoria) {
    setEditando(categoria.id);
    setDescricaoEdicao(categoria.descricao);
    // Converte o número vindo do backend para string para o select
    setFinalidadeEdicao(finalidadeStringFromNumber(Number(categoria.finalidade)) as "Despesa" | "Receita" | "Ambas");
  }

  async function salvarEdicao(id: number) {
    await api.put(`/categoria/${id}`, {
      descricao: descricaoEdicao,
      finalidade: finalidadeMap[finalidadeEdicao]
    });
    setEditando(null);
    setDescricaoEdicao("");
    setFinalidadeEdicao("Despesa");
    buscarCategorias();
  }

  function cancelarEdicao() {
    setEditando(null);
    setDescricaoEdicao("");
    setFinalidadeEdicao("Despesa");
  }

  async function excluirCategoria(id: number) {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await api.delete(`/categoria/${id}`);
        buscarCategorias();
      } catch (e: any) {
        alert(e.response?.data || "Erro ao excluir");
      }
    }
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
                onChange={e => setFinalidade(e.target.value as "Despesa" | "Receita" | "Ambas")}
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
                    <th className="p-2 text-left font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map(c => (
                    <tr key={c.id} className="border-b last:border-none hover:bg-gray-50">
                      <td className="p-2">
                        {editando === c.id ? (
                          <Input
                            value={descricaoEdicao}
                            onChange={e => setDescricaoEdicao(e.target.value)}
                            maxLength={400}
                          />
                        ) : (
                          c.descricao
                        )}
                      </td>
                      <td className="p-2">
                        {editando === c.id ? (
                          <select
                            value={finalidadeEdicao}
                            onChange={e => setFinalidadeEdicao(e.target.value as "Despesa" | "Receita" | "Ambas")}
                            className="border rounded-lg px-3 py-2 bg-white"
                          >
                            <option value="Despesa">Despesa</option>
                            <option value="Receita">Receita</option>
                            <option value="Ambas">Ambas</option>
                          </select>
                        ) : (
                          finalidadeLabels[c.finalidade as number]
                        )}
                      </td>
                      <td className="p-2 flex gap-2">
                        {editando === c.id ? (
                          <>
                            <Button variant="primary" onClick={() => salvarEdicao(c.id)} type="button">
                              Salvar
                            </Button>
                            <Button variant="primary" onClick={cancelarEdicao} type="button">
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="primary" onClick={() => iniciarEdicao(c)} type="button">
                              Editar
                            </Button>
                            <Button variant="primary" onClick={() => excluirCategoria(c.id)} type="button">
                              Excluir
                            </Button>
                          </>
                        )}
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

export default CategoriasPage;