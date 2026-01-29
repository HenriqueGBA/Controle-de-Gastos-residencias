using BackendCGR.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendCGR.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Pessoa> Pessoas { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Pessoa>(builder =>
            {
                builder.Property(p => p.Nome).HasMaxLength(200).IsRequired();
            });

            modelBuilder.Entity<Categoria>(builder =>
            {
                builder.Property(c => c.Descricao).HasMaxLength(400).IsRequired();
                builder.Property(c => c.Finalidade).IsRequired();
            });

            modelBuilder.Entity<Transacao>(builder =>
            {
                builder.Property(t => t.Descricao).HasMaxLength(400).IsRequired();
                builder.Property(t => t.Valor).IsRequired();
                builder.Property(t => t.Tipo).IsRequired();
                builder.HasOne(t => t.Categoria)
                    .WithMany(c => c.Transacoes)
                    .HasForeignKey(t => t.CategoriaId);
                builder.HasOne(t => t.Pessoa)
                    .WithMany(p => p.Transacoes)
                    .HasForeignKey(t => t.PessoaId);
            });
        }
    }
}
