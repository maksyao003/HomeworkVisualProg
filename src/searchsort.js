import React from 'react';
import './searchsort.css';

const SearchSort = ({ searchTerm, onSearchChange, sortCriteria, onSortChange }) => {
  return (
    <div className="search-sort">
      <input
        type="text"
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Поиск по названию или автору"
        className="search-input"
      />
      <div className="sort-controls">
        <label>
          Сортировать по:
          <select value={sortCriteria.criteria} onChange={(e) => onSortChange({ ...sortCriteria, criteria: e.target.value })}>
            <option value="title">Название</option>
            <option value="author">Автор</option>
          </select>
        </label>
        <label>
          Тип сортировки:
          <select value={sortCriteria.direction} onChange={(e) => onSortChange({ ...sortCriteria, direction: e.target.value })}>
            <option value="asc">По возрастанию</option>
            <option value="desc">По убыванию</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default SearchSort;