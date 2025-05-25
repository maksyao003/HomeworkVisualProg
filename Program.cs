using _11lab.commDB.Data;
using _11lab.commDB.Repositories;
using _11lab.commDB.Services;
using _11lab.commDB.Models;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<CommentService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:3000")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

app.UseCors("AllowReactApp");

app.MapGet("/comments", async (CommentService service) =>
{
    return Results.Ok(await service.GetAllCommentsAsync());
});

app.MapGet("/comments/{id}", async (int id, CommentService service) =>
{
    var comment = await service.GetCommentByIdAsync(id);
    return comment is not null ? Results.Ok(comment) : Results.NotFound();
});

app.MapPost("/comments", async (Comment comment, CommentService service) =>
{
    var addedComment = await service.AddCommentAsync(comment);
    return Results.Created($"/comments/{addedComment.Id}", addedComment);
});

app.MapPatch("/comments/{id}", async (int id, Comment comment, CommentService service) =>
{
    var updatedComment = await service.UpdateCommentAsync(id, comment);
    return updatedComment is not null ? Results.Ok(updatedComment) : Results.NotFound();
});

app.MapDelete("/comments/{id}", async (int id, CommentService service) =>
{
    var isDeleted = await service.DeleteCommentAsync(id);
    return isDeleted ? Results.NoContent() : Results.NotFound();
});

app.Run();
