using BackendCGR.Data;
using BackendCGR.Dtos;
using BackendCGR.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendCGR.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PessoaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PessoaController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pessoa>>> Listar()
            => await _context.Pessoas.ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Pessoa>> Buscar(int id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);
            return pessoa is null ? NotFound() : Ok(pessoa);
        }

        [HttpPost]
        public async Task<ActionResult<Pessoa>> Cadastrar(PessoaDto dto)
        {
            var pessoa = new Pessoa { Nome = dto.Nome, Idade = dto.Idade };
            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Buscar), new { id = pessoa.Id }, pessoa);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Editar(int id, PessoaDto dto)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);
            if (pessoa is null) return NotFound();

            pessoa.Nome = dto.Nome;
            pessoa.Idade = dto.Idade;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            var pessoa = await _context.Pessoas.Include(p => p.Transacoes).FirstOrDefaultAsync(p => p.Id == id);
            if (pessoa is null) return NotFound();

            // Remove todas as transações da pessoa
            _context.Transacoes.RemoveRange(pessoa.Transacoes ?? []);
            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}