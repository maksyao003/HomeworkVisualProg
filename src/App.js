import React, { useState, useEffect } from 'react';
import BookCard from './bookcard';
import SearchSort from './searchsort'; 
import './App.css';

const App = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [sortCriteria, setSortCriteria] = useState({ criteria: 'title', direction: 'asc' }); 

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
    
      return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
    
  };

  
  const filteredBooks = books.filter((book) => {
    const titleMatch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const authorMatch = book.authors.some((author) =>
      author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return titleMatch || authorMatch;
  });

  
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    const valueA = sortCriteria.criteria === 'title' ? a.title : a.authors[0];
    const valueB = sortCriteria.criteria === 'title' ? b.title : b.authors[0];
    if (sortCriteria.direction === 'asc') {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });

  
  const visibleBooks = sortedBooks.slice(0, 14);

  
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSortChange = (newCriteria) => setSortCriteria(newCriteria);

  return (
    <div className="app">
      <h1>Коллекция книг</h1> 
      <SearchSort
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        sortCriteria={sortCriteria}
        onSortChange={handleSortChange}
      />
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