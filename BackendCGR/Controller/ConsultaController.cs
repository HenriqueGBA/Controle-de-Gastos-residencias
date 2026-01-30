using BackendCGR.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendCGR.Controllers
{
    [ApiController]
    [Route("consulta")]
    public class BackendCGR : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public BackendCGR(ApplicationDbContext context) => _context = context;

        [HttpGet("totais-por-pessoa")]
        public async Task<ActionResult> TotaisPorPessoa()
        {
            var pessoas = await _context.Pessoas
                .Include(p => p.Transacoes)
                .Select(p => new
                {
                    p.Id,
                    p.Nome,
                    p.Idade,
                    TotalReceitas = p.Transacoes!.Where(t => t.Tipo == Models.TipoTransacao.Receita).Sum(t => t.Valor),
                    TotalDespesas = p.Transacoes!.Where(t => t.Tipo == Models.TipoTransacao.Despesa).Sum(t => t.Valor),
                    Saldo = p.Transacoes!.Where(t => t.Tipo == Models.TipoTransacao.Receita).Sum(t => t.Valor) -
                            p.Transacoes!.Where(t => t.Tipo == Models.TipoTransacao.Despesa).Sum(t => t.Valor)
                })
                .ToListAsync();

            var totalReceita = pessoas.Sum(p => p.TotalReceitas);
            var totalDespesa = pessoas.Sum(p => p.TotalDespesas);
            var saldo = totalReceita - totalDespesa;

            return Ok(new
            {
                Pessoas = pessoas,
                TotaisGerais = new
                {
                    TotalReceita = totalReceita,
                    TotalDespesa = totalDespesa,
                    Saldo = saldo
                }
            });
        }
    }
}