import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DataPage from './DataPage';
import './App.css';

const App = () => {
  const endpoints = [
    { path: '/posts', name: 'Posts', url: 'https://jsonplaceholder.typicode.com/posts' },
    { path: '/albums', name: 'Albums', url: 'https://jsonplaceholder.typicode.com/albums' },
    { path: '/todos', name: 'Todos', url: 'https://jsonplaceholder.typicode.com/todos' },
    { path: '/users', name: 'Users', url: 'https://jsonplaceholder.typicode.com/users' },
  ];

  return (
    <Router>
      <div className="app-container">
        <nav className="sidebar">
          <h2>Навигация</h2>
          <ul>
            {endpoints.map((endpoint) => (
              <li key={endpoint.path}>
                <Link to={endpoint.path}>{endpoint.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="content">
          <Routes>
            {endpoints.map((endpoint) => (
              <Route
                key={endpoint.path}
                path={endpoint.path}
                element={<DataPage endpoint={endpoint.url} type={endpoint.name.toLowerCase()} />}
              />
            ))}
            <Route path="/" element={<h1>Выберите меню</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;