export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

export interface Categoria {
  id: number;
  descricao: string;
  finalidade: "Despesa" | "Receita" | "Ambas";
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: "Despesa" | "Receita";
  categoriaId: number;
  pessoaId: number;
  pessoa?: Pessoa;
  categoria?: Categoria;
}