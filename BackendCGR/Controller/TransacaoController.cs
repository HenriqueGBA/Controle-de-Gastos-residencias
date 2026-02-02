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
        public async Task<ActionResult<IEnumerable<object>>> Listar()
        {
            var transacoes = await _service.ListarTransacoesApiAsync();
            return Ok(transacoes);
        }

        [HttpPost]
        public async Task<ActionResult<object>> Cadastrar(TransacaoDto dto)
        {
            try
            {
                var transacao = await _service.CriarTransacaoAsync(dto);
                var retorno = await _service.BuscarTransacaoDtoAsync(transacao.Id);

                return CreatedAtAction(nameof(Listar), new { id = transacao.Id }, retorno);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}