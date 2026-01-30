import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PessoasPage from "./pages/PessoasPage";
// import CategoriasPage from "./pages/CategoriasPage";
// import TransacoesPage from "./pages/TransacoesPage";
// import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/pessoas">Pessoas</Link>
        <Link to="/categorias">Categorias</Link>
        <Link to="/transacoes">Transações</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <Routes>
        <Route path="/pessoas" element={<PessoasPage />} />
        {/* <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/transacoes" element={<TransacoesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<DashboardPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;