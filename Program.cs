using _10lab.Models;
using _10lab.Repositories;
using _10lab.Services;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddSingleton<ICommentRepository, CommentRepository>();
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


app.MapGet("/comments", (CommentService service) => 
{
    return Results.Ok(service.GetAllComments());
});

app.MapGet("/comments/{id}", (int id, CommentService service) =>
{
    var comment = service.GetCommentById(id);
    return comment is not null ? Results.Ok(comment) : Results.NotFound();
});

app.MapPost("/comments", (Comment comment, CommentService service) =>
{
    var addedComment = service.AddComment(comment);
    return Results.Created($"/comments/{addedComment.Id}", addedComment);
});

app.MapPatch("/comments/{id}", (int id, Comment comment, CommentService service) =>
{
    var updatedComment = service.UpdateComment(id, comment);
    return updatedComment is not null ? Results.Ok(updatedComment) : Results.NotFound();
});

app.MapDelete("/comments/{id}", (int id, CommentService service) =>
{
    var isDeleted = service.DeleteComment(id);
    return isDeleted ? Results.NoContent() : Results.NotFound();
});

app.Run();