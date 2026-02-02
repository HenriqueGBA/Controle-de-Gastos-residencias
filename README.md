# Controle de Gastos Residenciais

Um sistema web para controle de gastos, receitas e fluxo financeiro de pessoas em residências, suportando múltiplas categorias, transações e validações de negócio essenciais. O projeto é dividido em Backend (ASP.NET Core + EF) e Frontend (ReactJS).

---

## 🚀 Dependências

### Backend

- **ASP.NET Core**: Framework principal
- **Entity Framework Core**: ORM para acesso ao banco de dados
- **Microsoft.AspNetCore.Mvc**: API controllers
- **Swashbuckle.AspNetCore**: Swagger para documentação

### Frontend

- **React**: Biblioteca de UI
- **react-router-dom**: Navegação SPA
- **axios**: Comunicação com API
- **lucide-react**: Ícones SVG
- **sonner**: Toasts de notificação
- **(opcional) tailwindcss ou outro CSS framework**: Para estilização

Instale as principais dependências frontend com:

```bash
npm install axios react-router-dom lucide-react sonner
```

---

## 📑 Regras de Negócio

### Pessoas

- **Cadastro de pessoas**: Nome e idade obrigatórios.
- **Edição/Exclusão**: Permitido editar ou excluir uma pessoa. Na exclusão, TODAS as transações ligadas à pessoa também são removidas.

### Categorias

- **Cadastro de categorias**: Cada categoria possui uma **descrição** e uma **finalidade** (`Despesa`, `Receita` ou `Ambas`).
- **Regra ao excluir**: Não é permitido excluir uma categoria que possui transações associadas.
- **Edição**: Descrição e finalidade podem ser alterados.

### Transações

- **Cadastro**:
    - **Valor** deve ser **positivo**.
    - **Tipo**: 0 - Despesa, 1 - Receita.
    - **Categoria e Pessoa** obrigatórias.
- **Regra de menor de idade**: Pessoa com menos de 18 anos só pode registrar transações tipo **Despesa**.
- **Regra de categoria**: Só é possível usar uma categoria se a transação for compatível com sua finalidade:
    - Categoria "Despesa" aceita apenas transações tipo Despesa.
    - Categoria "Receita" aceita apenas transações tipo Receita.
    - Categoria "Ambas" aceita qualquer tipo.
- **CRUD Completo**: Permite criar, editar e excluir transações.

### Fluxo e Frontend

- Todas operações são feitas via API.
- Feedback do usuário via **toast** (sonner) para sucesso/erro (NUNCA quebra a tela).
- Listagens usam componente de tabela reutilizável e campos editáveis inline.
- Filtros dinâmicos por pessoa (dashboard), categorias, busca por texto etc.
- KPIs visuais no dashboard, mostrando saldo, total de receitas/despesas, com cores e ícones.

---

## ⚡ Rodando o sistema

### Backend

- Configure e crie seu banco de dados (migrations).
- Execute o projeto ASP.NET/Core normalmente (`dotnet run`).

### Frontend

- Rode `npm install` na pasta do frontend.
- Execute com `npm run dev` ou `npm start`.

Lembre-se de configurar a URL do backend na sua instância do axios!

---

## 🛡️ Validações e Mensagens

- Mensagens de erro vindas do backend são exibidas para o usuário de forma amigável via toast.
- O frontend nunca quebra ou trava em caso de erro, sempre mostrando feedback claro.
- Todas validações (negócio e BD) são tratadas e reportadas para o cliente.

---

## 💡 Exemplos de regras na prática

- Se tentar registrar uma receita para uma pessoa de 15 anos, o backend retorna **"Pessoa menor de 18 anos só pode registrar despesas."** e o frontend exibe toast de erro.
- Se tentar excluir uma categoria com transações, o backend retorna **"Não é possível excluir uma categoria que possui transações."** e o frontend exibe toast.

---

## 📚 Estrutura de Projeto

- `/BackendCGR` - Backend com Controllers, Models, Services, Data.
- `/src/pages` - Todas páginas React (Pessoas, Categorias, Transações, Dashboard).
- `/src/components` - Componentes reutilizáveis (Table, Input, Card, Navbar, Toast).
- `/src/api/api.js` - Configuração Axios para API.

---
