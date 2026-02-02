

using BackendCGR.Models;

namespace BackendCGR.Dtos
{
    public class CategoriaDto
    {
        public string Descricao { get; set; } = string.Empty;
        public FinalidadeCategoria Finalidade { get; set; }
    }
}