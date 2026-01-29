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
    public string? Nome { get; set; }

    public FinalidadeCategoria Finalidade { get; set; }

    public ICollection<Transacao>? Transacoes { get; set; }
}
