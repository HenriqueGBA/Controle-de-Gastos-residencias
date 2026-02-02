import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PessoasPage from "./pages/PessoasPage";
import CategoriasPage from "./pages/CategoriasPage";
import TransacoesPage from "./pages/TransacoesPage";
import DashboardPage from "./pages/DashboardPage";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";

const tabs = [
  { label: "Dashboard", value: "dashboard", to: "/dashboard" },
  { label: "Pessoas", value: "pessoas", to: "/pessoas" },
  { label: "Categorias", value: "categorias", to: "/categorias" },
  { label: "Transações", value: "transacoes", to: "/transacoes" },
];

function App() {
  return (
    <Router>
      <Toaster richColors position="top-right" />
      <Navbar tabs={tabs} title="Menu" />
      <Routes>
        <Route path="/pessoas" element={<PessoasPage />} />
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/transacoes" element={<TransacoesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;