using _11lab.commDB.Data;
using _11lab.commDB.Models;
using Microsoft.EntityFrameworkCore;

namespace _11lab.commDB.Repositories;

public class CommentRepository : ICommentRepository
{
    private readonly AppDbContext _context;

    public CommentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Comment>> GetAllAsync()
    {
        return await _context.Comments.ToListAsync();
    }

    public async Task<Comment?> GetByIdAsync(int id)
    {
        return await _context.Comments.FindAsync(id);
    }

    public async Task<Comment> AddAsync(Comment comment)
    {
        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();
        return comment;
    }

    public async Task<Comment?> UpdateAsync(int id, Comment comment)
    {
        var existingComment = await _context.Comments.FindAsync(id);
        if (existingComment == null)
            return null;

        existingComment.PostId = comment.PostId;
        existingComment.Name = comment.Name;
        existingComment.Email = comment.Email;
        existingComment.Body = comment.Body;

        await _context.SaveChangesAsync();
        return existingComment;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment == null)
            return false;

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();
        return true;
    }
}