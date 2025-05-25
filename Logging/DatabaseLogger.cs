using Microsoft.Extensions.Logging;
using _11lab.commDB.Data;
using System;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using _11lab.commDB.Models;

namespace _11lab.commDB.Logging
{
    public class DatabaseLogger : ILogger
    {
        private readonly string _categoryName;
        private readonly Func<string, LogLevel, bool>? _filter;
        private readonly IServiceProvider _serviceProvider;

        public DatabaseLogger(
            string categoryName,
            Func<string, LogLevel, bool>? filter,
            IServiceProvider serviceProvider)
        {
            _categoryName = categoryName;
            _filter = filter;
            _serviceProvider = serviceProvider;
        }

        
        IDisposable ILogger.BeginScope<TState>(TState state)
        {
            
            return NullScope.Instance;
        }

        public bool IsEnabled(LogLevel logLevel) => 
            _filter == null || _filter(_categoryName, logLevel);

        public void Log<TState>(
            LogLevel logLevel,
            EventId eventId,
            TState state,
            Exception? exception,
            Func<TState, Exception?, string> formatter)
        {
            if (!IsEnabled(logLevel)) return;

            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var logRecord = new LogRecord
            {
                Level = logLevel.ToString(),
                Message = formatter(state, exception),
                Exception = exception?.ToString(),
                Source = _categoryName,
                Timestamp = DateTime.UtcNow
            };

            try
            {
                context.Logs.Add(logRecord);
                context.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to save log: {ex.Message}");
            }
            
        }
        

        private class NullScope : IDisposable
        {
            public static readonly NullScope Instance = new NullScope();

            private NullScope() { }

            public void Dispose() { }
        }
    }
}