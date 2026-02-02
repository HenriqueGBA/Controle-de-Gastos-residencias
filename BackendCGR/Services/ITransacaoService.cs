using BackendCGR.Dtos;
using BackendCGR.Models;

namespace BackendCGR.Services
{
    public interface ITransacaoService
    {
        Task<Transacao> CriarTransacaoAsync(TransacaoDto dto);
        Task<IEnumerable<object>> ListarTransacoesApiAsync();
        Task<object?> BuscarTransacaoDtoAsync(int id);
        Task EditarTransacaoAsync(int id, TransacaoDto dto);
        Task DeletarTransacaoAsync(int id);
    }
}