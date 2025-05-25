using _10lab.Models;
namespace _10lab.Repositories


{
    public interface ICommentRepository
    {
        IEnumerable<Comment> GetAll();
        Comment? GetById(int id);
        Comment Add(Comment comment);
        Comment? Update(int id, Comment comment);
        bool Delete(int id);
    }
}
