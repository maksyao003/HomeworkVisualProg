using _10lab.Models;
namespace _10lab.Repositories

{
    public class CommentRepository : ICommentRepository
    {
        private readonly Dictionary<int, Comment> _comments = new();
        private int _nextId = 1;

        public CommentRepository()
        {
            
            Add(new Comment { 
                PostId = 1, 
                Name = "Test User", 
                Email = "test@example.com", 
                Body = "Initial test comment" 
            });
        }

        public IEnumerable<Comment> GetAll() => _comments.Values;

        public Comment? GetById(int id) => _comments.TryGetValue(id, out var comment) ? comment : null;

        public Comment Add(Comment comment)
        {
            comment.Id = _nextId++;
            _comments[comment.Id] = comment;
            return comment;
        }

        public Comment? Update(int id, Comment comment)
        {
            if (!_comments.ContainsKey(id)) return null;

            var existingComment = _comments[id];
            existingComment.Name = comment.Name;
            existingComment.Email = comment.Email;
            existingComment.Body = comment.Body;
            existingComment.PostId = comment.PostId;

            return existingComment;
        }

        public bool Delete(int id) => _comments.Remove(id);
    }
}