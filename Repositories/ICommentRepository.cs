using _11lab.commDB.Models;

namespace _11lab.commDB.Repositories;

public interface ICommentRepository
{
    Task<IEnumerable<Comment>> GetAllAsync();
    Task<Comment?> GetByIdAsync(int id);
    Task<Comment> AddAsync(Comment comment);
    Task<Comment?> UpdateAsync(int id, Comment comment);
    Task<bool> DeleteAsync(int id);
}