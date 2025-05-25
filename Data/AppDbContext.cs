using _11lab.commDB.Models;
using Microsoft.EntityFrameworkCore;

namespace _11lab.commDB.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Comment> Comments { get; set; }
        public DbSet<LogRecord> Logs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            modelBuilder.Entity<Comment>()
                .ToTable("Comments");

            
            modelBuilder.Entity<Comment>()
                .Property(c => c.Id)
                .HasColumnName("Id");

            modelBuilder.Entity<Comment>()
                .Property(c => c.PostId)
                .HasColumnName("PostId");

            modelBuilder.Entity<Comment>()
                .Property(c => c.Name)
                .HasColumnName("Name");

            modelBuilder.Entity<Comment>()
                .Property(c => c.Email)
                .HasColumnName("Email");

            modelBuilder.Entity<Comment>()
                .Property(c => c.Body)
                .HasColumnName("Body");

            
            modelBuilder.Entity<LogRecord>()
                .ToTable("logs");

            modelBuilder.Entity<LogRecord>()
                .Property(l => l.Id)
                .HasColumnName("id");

            modelBuilder.Entity<LogRecord>()
                .Property(l => l.Timestamp)
                .HasColumnName("timestamp");

            modelBuilder.Entity<LogRecord>()
                .Property(l => l.Level)
                .HasColumnName("level");

            modelBuilder.Entity<LogRecord>()
                .Property(l => l.Message)
                .HasColumnName("message");

            modelBuilder.Entity<LogRecord>()
                .Property(l => l.Exception)
                .HasColumnName("exception");

            modelBuilder.Entity<LogRecord>()
                .Property(l => l.Source)
                .HasColumnName("source");

            modelBuilder.Entity<LogRecord>()
                .Property(l => l.RequestPath)
                .HasColumnName("request_path");

            modelBuilder.Entity<LogRecord>()
                .Property(l => l.Action)
                .HasColumnName("action");

            modelBuilder.Entity<LogRecord>()
                .Property(l => l.UserId)
                .HasColumnName("user_id");
        }
    }
}