using Microsoft.Extensions.Logging;
using System;

namespace _11lab.commDB.Logging
{
    public class DatabaseLoggerProvider : ILoggerProvider
    {
        private readonly IServiceProvider _serviceProvider;

        public DatabaseLoggerProvider(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public ILogger CreateLogger(string categoryName)
        {
            return new DatabaseLogger(categoryName, null, _serviceProvider); 
        }

        public void Dispose()
        {
            
        }
    }
}