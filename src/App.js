import React, { useState, useEffect, useOptimistic } from 'react';
import DataTable from './DataTable';
import './App.css';

const App = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, action) => {
      switch (action.type) {
        case 'add':
          return [...state, action.comment];
        case 'delete':
          return state.filter(comment => !action.ids.includes(comment.id));
        case 'update':
          return state.map(comment => 
            comment.id === action.comment.id ? action.comment : comment
          );
        default:
          return state;
      }
    }
  );

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=500');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  
  const handleAddComment = async (newComment) => {
    const tempId = Date.now(); 
    const optimisticComment = { ...newComment, id: tempId };
    
    addOptimisticComment({ type: 'add', comment: optimisticComment });
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/comments', {
        method: 'POST',
        body: JSON.stringify(newComment),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      
      if (!response.ok) throw new Error('Failed to add comment');
      
      const createdComment = await response.json();
      setComments(prev => [...prev, createdComment]);
    } catch (err) {
      setError(err.message);
      
      setComments(prev => prev.filter(comment => comment.id !== tempId));
    }
  };

  
  const handleDeleteComments = async (ids) => {
    addOptimisticComment({ type: 'delete', ids });
    
    try {
      const deletePromises = ids.map(id => 
        fetch(`https://jsonplaceholder.typicode.com/comments/${id}`, {
          method: 'DELETE',
        })
      );
      
      const responses = await Promise.all(deletePromises);
      const allOk = responses.every(response => response.ok);
      
      if (!allOk) throw new Error('Failed to delete some comments');
      
      setComments(prev => prev.filter(comment => !ids.includes(comment.id)));
    } catch (err) {
      setError(err.message);
      const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=10');
      const data = await response.json();
      setComments(data);
    }
  };

  const handleUpdateComment = async (updatedComment) => {
    const patchData = {
      name: updatedComment.name,
      email: updatedComment.email,
      body: updatedComment.body
    };
  
    addOptimisticComment({ type: 'update', comment: updatedComment });
    
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments/${updatedComment.id}`, {
        method: 'PATCH',
        body: JSON.stringify(patchData), 
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      
      if (!response.ok) throw new Error('Failed to update comment');
      
      const data = await response.json();
      setComments(prev => prev.map(comment => 
        comment.id === updatedComment.id ? { ...comment, ...data } : comment
      ));
    } catch (err) {
      setError(err.message);
      setComments(prev => prev.map(comment => 
        comment.id === updatedComment.id ? comments.find(c => c.id === updatedComment.id) : comment
      ));
    }
  };

  const AddCommentForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      body: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({
        ...formData,
        postId: 1, 
      });
      setFormData({ name: '', email: '', body: '' });
    };

    return (
      <form onSubmit={handleSubmit} className="comment-form">
        <h3>Новый комментарий</h3>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Имя"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <textarea
          name="body"
          value={formData.body}
          onChange={handleChange}
          placeholder="Текст комментария"
          required
        />
        <button type="submit">Добавить</button>
      </form>
    );
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="app-container">
      <h1>Comments</h1>
      <AddCommentForm onSubmit={handleAddComment} />
      
      <DataTable
        headers={['PostId', 'ID', 'Имя', 'Email', 'Текст']}
        data={optimisticComments}
        renderRow={(value) => value}
        renderHeader={(header) => header}
        onDeleteSelected={handleDeleteComments}
        onUpdate={handleUpdateComment}
      />
    </div>
  );
};

export default App;