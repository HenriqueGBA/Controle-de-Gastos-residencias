using System;

namespace BackendCGR.Models;

public class Pessoa
{
    public int Id { get; set; }
    public string? Nome { get; set; }

    public int Idade { get; set; }

    public ICollection<Transacao>? Transacoes { get; set; }
}
