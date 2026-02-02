using BackendCGR.Data;
using BackendCGR.Dtos;
using BackendCGR.Models;
using BackendCGR.Services;
using Microsoft.EntityFrameworkCore;

namespace BackendCGR.Services
{
    public class TransacaoService : ITransacaoService
    {
        private readonly ApplicationDbContext _context;

        public TransacaoService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Transacao> CriarTransacaoAsync(TransacaoDto dto)
        {
            if (dto.Valor <= 0)
                throw new ArgumentException("Valor deve ser positivo.");

            var pessoa = await _context.Pessoas.FindAsync(dto.PessoaId)
                ?? throw new ArgumentException("Pessoa não encontrada.");

            if (pessoa.Idade < 18 && dto.Tipo != TipoTransacao.Despesa)
                throw new ArgumentException("Pessoa menor de 18 anos só pode registrar despesas.");

            var categoria = await _context.Categorias.FindAsync(dto.CategoriaId)
                ?? throw new ArgumentException("Categoria não encontrada.");

            // Regra: Checa se tipo da transação é compatível com finalidade da categoria
            if (categoria.Finalidade != FinalidadeCategoria.Ambas &&
                ((dto.Tipo == TipoTransacao.Despesa && categoria.Finalidade != FinalidadeCategoria.Despesa) ||
                 (dto.Tipo == TipoTransacao.Receita && categoria.Finalidade != FinalidadeCategoria.Receita)))
            {
                throw new ArgumentException("Categoria incompatível com o tipo de transação.");
            }

            var transacao = new Transacao
            {
                Descricao = dto.Descricao,
                Valor = dto.Valor,
                Tipo = dto.Tipo,
                CategoriaId = dto.CategoriaId,
                PessoaId = dto.PessoaId
            };

            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();
            return transacao;
        }

        public async Task<IEnumerable<object>> ListarTransacoesApiAsync()
        {
            return await _context.Transacoes
                .Include(t => t.Categoria)
                .Include(t => t.Pessoa)
                .Select(t => new
                {
                    id = t.Id,
                    descricao = t.Descricao,
                    valor = t.Valor,
                    tipo = t.Tipo,
                    categoriaId = t.CategoriaId,
                    pessoaId = t.PessoaId,
                    categoriaDescricao = t.Categoria != null ? t.Categoria.Descricao : "",
                    pessoaNome = t.Pessoa != null ? t.Pessoa.Nome : ""
                })
                .ToListAsync();
        }

        public async Task<object?> BuscarTransacaoDtoAsync(int id)
        {
            return await _context.Transacoes
                .Include(t => t.Categoria)
                .Include(t => t.Pessoa)
                .Where(t => t.Id == id)
                .Select(t => new {
                    id = t.Id,
                    descricao = t.Descricao,
                    valor = t.Valor,
                    tipo = t.Tipo,
                    categoriaId = t.CategoriaId,
                    pessoaId = t.PessoaId,
                    categoriaDescricao = t.Categoria != null ? t.Categoria.Descricao : "",
                    pessoaNome = t.Pessoa != null ? t.Pessoa.Nome : ""
                })
                .FirstOrDefaultAsync();
        }
    }
}