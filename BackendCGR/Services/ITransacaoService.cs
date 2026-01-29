using BackendCGR.Dtos;
using BackendCGR.Models;

namespace BackendCGR.Services
{
    public interface ITransacaoService
    {
        Task<Transacao> CriarTransacaoAsync(TransacaoDto dto);
        Task<List<Transacao>> ListarTransacoesAsync();
    }
}