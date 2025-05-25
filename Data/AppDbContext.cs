using _11lab.commDB.Models;
using Microsoft.EntityFrameworkCore;

namespace _11lab.commDB.Data;

public class AppDbContext : DbContext
{
    public DbSet<Comment> Comments { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }
}