using _11lab.commDB.Models;
using _11lab.commDB.Repositories;

namespace _11lab.commDB.Services;

public class CommentService
{
    private readonly ICommentRepository _repository;

    public CommentService(ICommentRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Comment>> GetAllCommentsAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Comment?> GetCommentByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<Comment> AddCommentAsync(Comment comment)
    {
        return await _repository.AddAsync(comment);
    }

    public async Task<Comment?> UpdateCommentAsync(int id, Comment comment)
    {
        return await _repository.UpdateAsync(id, comment);
    }

    public async Task<bool> DeleteCommentAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }
}