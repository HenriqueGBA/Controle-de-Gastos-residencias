using BackendCGR.Data;
using BackendCGR.Dtos;
using BackendCGR.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendCGR.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoriaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriaController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> Listar()
            => await _context.Categorias.ToListAsync();

        [HttpPost]
        public async Task<ActionResult<Categoria>> Cadastrar(CategoriaDto dto)
        {
            var categoria = new Categoria
            {
                Descricao = dto.Descricao,
                Finalidade = dto.Finalidade
            };

            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Listar), new { id = categoria.Id }, categoria);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Editar(int id, CategoriaDto dto)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null) return NotFound();
            categoria.Descricao = dto.Descricao;
            categoria.Finalidade = dto.Finalidade;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            var categoria = await _context.Categorias
                .Include(c => c.Transacoes)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (categoria == null) return NotFound();

            if (categoria.Transacoes != null && categoria.Transacoes.Count > 0)
                return BadRequest("Não é possível excluir uma categoria que possui transações.");

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}