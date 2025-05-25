import React from 'react';
import DataTable from './DataTable';
import './App.css';

const App = () => {
    const headers = ['Имя', 'Возраст', 'Город'];
    const data = [
      { name: 'Милешко Антон Владимирович', age: 34, city: 'Новосибирск' },
      { name: 'Юханаев Арсений Эдгарович', age: 20, city: 'Новосибирск' },
      { name: 'Петрова Мария Александровна', age: 28, city: 'Москва' },
      { name: 'Сидоров Дмитрий Павлович', age: 45, city: 'Екатеринбург' },
      { name: 'Захарова Ирина Николаевна', age: 38, city: 'Красноярск' },
  ];
  

    return (
        <div>
            <h1>дз 7</h1>
            <DataTable
                headers={headers}
                data={data}
                renderRow={(value) => value}
                renderHeader={(header) => header}
            />
        </div>
    );
};

export default App;