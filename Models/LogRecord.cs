namespace _11lab.commDB.Models;

public class LogRecord
{
    public int Id { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string Level { get; set; } = string.Empty; 
    public string Message { get; set; } = string.Empty; 
    public string? Exception { get; set; }
    public string? Source { get; set; }
    public string? RequestPath { get; set; }
    public string? Action { get; set; }
    public string? UserId { get; set; }
}