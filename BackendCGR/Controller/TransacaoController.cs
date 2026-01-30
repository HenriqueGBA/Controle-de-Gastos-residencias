using BackendCGR.Dtos;
using BackendCGR.Models;
using BackendCGR.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendCGR.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TransacaoController : ControllerBase
    {
        private readonly ITransacaoService _service;

        public TransacaoController(ITransacaoService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transacao>>> Listar()
            => await _service.ListarTransacoesAsync();

        [HttpPost]
        public async Task<ActionResult<Transacao>> Cadastrar(TransacaoDto dto)
        {
            try
            {
                var transacao = await _service.CriarTransacaoAsync(dto);
                return CreatedAtAction(nameof(Listar), new { id = transacao.Id }, transacao);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}