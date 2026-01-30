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
    }
}