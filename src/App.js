import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import './App.css';

const App = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('https://fakeapi.extendsclass.com/books')
      .then((response) => response.json())
      .then(async (data) => {
        const booksWithCovers = await Promise.all(
          data.map(async (book) => {
            const coverUrl = await fetchCoverImage(book.isbn);
            return { ...book, coverImage: coverUrl };
          })
        );
        setBooks(booksWithCovers);
      })
      .catch((error) => console.error('Ошибка при загрузке книг:', error));
  }, []);

  const fetchCoverImage = async (isbn) => {
    try {
      const apiKey = 'AIzaSyAHLq9MW1YfQOe_BlhgSi-m7muEhBl6mTQ'; 
      const apiKey2 = 'AIzaSyCepRez2lkZmbMjxWhd1KHE4-fhgch3faE';
      /*const response = await fetch(
        `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
      );
      const data = await response.json();*/
      return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
    } catch (error) {
      console.error('Ошибка при загрузке обложки:', error);
      
    }
  };

  
  const visibleBooks = books.slice(0, 14); 

  return (
    <div className="app">
      <div className="book-container">
        {visibleBooks.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            authors={book.authors}
            coverImage={book.coverImage}
          />
        ))}
      </div>
    </div>
  );

};

export default App;