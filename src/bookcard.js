import React from 'react';
import './bookcard.css';

const BookCard = ({ title, authors, coverImage }) => {
  return (
    <div className="book-card">
      <img src={coverImage} alt={`Обложка ${title}`} className="book-cover" />
      <h3 className="book-title">{title}</h3>
      <p className="book-authors">{authors.join(', ')}</p>
    </div>
  );
};

export default BookCard;