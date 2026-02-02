using System;

namespace BackendCGR.Models;

    public enum FinalidadeCategoria
    {
        Despesa,
        Receita,
        Ambas
    }

    public class Categoria
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public FinalidadeCategoria Finalidade { get; set; }
        public ICollection<Transacao>? Transacoes { get; set; }
    }
