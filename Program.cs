using _11lab.commDB.Logging;
using _11lab.commDB.Data;
using _11lab.commDB.Repositories;
using _11lab.commDB.Services;
using _11lab.commDB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<CommentService>();


builder.Services.AddHttpContextAccessor();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:3000")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

builder.Services.AddSingleton<ILoggerProvider>(serviceProvider => 
    new DatabaseLoggerProvider(serviceProvider));

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddFilter<DatabaseLoggerProvider>("", LogLevel.Trace);
builder.Logging.SetMinimumLevel(LogLevel.Trace);




var app = builder.Build();



app.UseCors("AllowReactApp");


app.MapGet("/comments", async (CommentService service, ILogger<Program> logger) => 
{
    try
    {
        logger.LogInformation("Getting all comments");
        var comments = await service.GetAllCommentsAsync();
        return Results.Ok(comments);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error fetching comments");
        return Results.Problem("An error occurred while fetching comments", statusCode: 500);
    }
});

app.MapGet("/comments/{id}", async (int id, CommentService service, ILogger<Program> logger) =>
{
    logger.LogInformation($"Getting comment with id: {id}");
    var comment = await service.GetCommentByIdAsync(id);
    if (comment == null) 
    {
        logger.LogWarning($"Comment with id {id} not found");
        return Results.NotFound();
    }
    return Results.Ok(comment);
});

app.MapPost("/comments", async (Comment comment, CommentService service, ILogger<Program> logger) =>
{
    logger.LogInformation("Adding new comment");
    try
    {
        var addedComment = await service.AddCommentAsync(comment);
        logger.LogInformation($"Comment added with id: {addedComment.Id}");
        return Results.Created($"/comments/{addedComment.Id}", addedComment);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error adding comment");
        return Results.Problem("Error adding comment");
    }
});

app.MapPatch("/comments/{id}", async (int id, Comment comment, CommentService service, ILogger<Program> logger) =>
{
    logger.LogInformation($"Updating comment with id: {id}");
    try
    {
        var updatedComment = await service.UpdateCommentAsync(id, comment);
        if (updatedComment == null)
        {
            logger.LogWarning($"Comment with id {id} not found for update");
            return Results.NotFound();
        }
        return Results.Ok(updatedComment);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, $"Error updating comment with id: {id}");
        return Results.Problem("Error updating comment");
    }
});

app.MapDelete("/comments/{id}", async (int id, CommentService service, ILogger<Program> logger) =>
{
    logger.LogInformation($"Deleting comment with id: {id}");
    try
    {
        var result = await service.DeleteCommentAsync(id);
        if (!result)
        {
            logger.LogWarning($"Comment with id {id} not found for deletion");
            return Results.NotFound();
        }
        return Results.NoContent();
    }
    catch (Exception ex)
    {
        logger.LogError(ex, $"Error deleting comment with id: {id}");
        return Results.Problem("Error deleting comment");
    }
});


app.MapGet("/api/logs", async (
    AppDbContext context,
    ILogger<Program> logger,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10,
    [FromQuery] string? level = null,
    [FromQuery] string? search = null,
    [FromQuery] DateTime? startDate = null,
    [FromQuery] DateTime? endDate = null) =>
{
    logger.LogInformation("Fetching logs");
    try
    {
        var query = context.Logs.AsQueryable();

        if (!string.IsNullOrEmpty(level))
            query = query.Where(l => l.Level == level);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(l => l.Message != null && l.Message.Contains(search));

        if (startDate.HasValue)
            query = query.Where(l => l.Timestamp >= startDate);

        if (endDate.HasValue)
            query = query.Where(l => l.Timestamp <= endDate);

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(l => l.Timestamp)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Results.Ok(new { items, totalCount });
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error fetching logs");
        return Results.Problem("Error fetching logs");
    }
});


app.Run();