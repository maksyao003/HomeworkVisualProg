import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const DataTable = ({ headers, data, renderRow, renderHeader, onDeleteSelected, onUpdate, type }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingRow, setEditingRow] = useState(null);

  const getEditSchema = () => {
    switch (type) {
      case 'posts':
        return Yup.object({
          title: Yup.string().required('Обязательное поле'),
          body: Yup.string().required('Обязательное поле'),
        });
      case 'albums':
        return Yup.object({
          title: Yup.string().required('Обязательное поле'),
        });
      case 'todos':
        return Yup.object({
          title: Yup.string().required('Обязательное поле'),
          completed: Yup.boolean().required('Обязательное поле'),
        });
      case 'users':
        return Yup.object({
          name: Yup.string().required('Обязательное поле'),
          email: Yup.string().email('Неверный email').required('Обязательное поле'),
        });
      default:
        return Yup.object({});
    }
  };

  const handleRowClick = (rowIndex) => {
    setSelectedRows(prev =>
      prev.includes(rowIndex) ? prev.filter(row => row !== rowIndex) : [...prev, rowIndex]
    );
  };

  const handleSelectAll = (e) => {
    setSelectedRows(e.target.checked ? data.map((_, index) => index) : []);
  };

  const handleDelete = () => {
    const idsToDelete = selectedRows.map(index => data[index].id);
    onDeleteSelected(idsToDelete);
    setSelectedRows([]);
  };

  const handleEdit = (rowIndex) => {
    setEditingRow(rowIndex);
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
  };

  const renderHeaders = () => (
    <>
      <th>
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={selectedRows.length === data.length && data.length > 0}
        />
      </th>
      {headers.map((header, index) => (
        <th key={index}>{renderHeader ? renderHeader(header) : header}</th>
      ))}
      <th>Actions</th>
    </>
  );

  const renderRows = () => {
    return data.map((item, rowIndex) => {
      if (editingRow === rowIndex) {
        const initialValues = {
          id: item.id,
          userId: item.userId || 1,
          ...(() => {
            switch (type) {
              case 'posts':
                return { title: item.title, body: item.body };
              case 'albums':
                return { title: item.title };
              case 'todos':
                return { title: item.title, completed: item.completed };
              case 'users':
                return { name: item.name, email: item.email };
              default:
                return {};
            }
          })(),
        };

        return (
          <tr key={rowIndex}>
            <td colSpan={headers.length + 2}>
              <Formik
                initialValues={initialValues}
                validationSchema={getEditSchema()}
                onSubmit={(values) => {
                  onUpdate(values);
                  setEditingRow(null);
                }}
              >
                {() => (
                  <Form className="edit-form">
                    {type === 'posts' && (
                      <>
                        <div>
                          <Field name="title" placeholder="Title" />
                          <ErrorMessage name="title" component="div" className="error" />
                        </div>
                        <div>
                          <Field name="body" as="textarea" placeholder="Body" />
                          <ErrorMessage name="body" component="div" className="error" />
                        </div>
                      </>
                    )}
                    {type === 'albums' && (
                      <div>
                        <Field name="title" placeholder="Title" />
                        <ErrorMessage name="title" component="div" className="error" />
                      </div>
                    )}
                    {type === 'todos' && (
                      <>
                        <div>
                          <Field name="title" placeholder="Title" />
                          <ErrorMessage name="title" component="div" className="error" />
                        </div>
                        <div>
                          <Field name="completed" type="checkbox" />
                          <label>Completed</label>
                        </div>
                      </>
                    )}
                    {type === 'users' && (
                      <>
                        <div>
                          <Field name="name" placeholder="Name" />
                          <ErrorMessage name="name" component="div" className="error" />
                        </div>
                        <div>
                          <Field name="email" type="email" placeholder="Email" />
                          <ErrorMessage name="email" component="div" className="error" />
                        </div>
                      </>
                    )}
                    <button type="submit">Сохранить</button>
                    <button type="button" onClick={handleCancelEdit}>
                      Отмена
                    </button>
                  </Form>
                )}
              </Formik>
            </td>
          </tr>
        );
      }

      return (
        <tr key={rowIndex} className={selectedRows.includes(rowIndex) ? 'selected-row' : ''}>
          <td>
            <input
              type="checkbox"
              checked={selectedRows.includes(rowIndex)}
              onChange={() => handleRowClick(rowIndex)}
            />
          </td>
          {type === 'posts' && (
            <>
              <td>{item.id}</td>
              <td>{item.userId}</td>
              <td>{item.title}</td>
              <td>{item.body}</td>
            </>
          )}
          {type === 'albums' && (
            <>
              <td>{item.id}</td>
              <td>{item.userId}</td>
              <td>{item.title}</td>
            </>
          )}
          {type === 'todos' && (
            <>
              <td>{item.id}</td>
              <td>{item.userId}</td>
              <td>{item.title}</td>
              <td>{item.completed ? 'Yes' : 'No'}</td>
            </>
          )}
          {type === 'users' && (
            <>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
            </>
          )}
          <td>
            <button onClick={() => handleEdit(rowIndex)}>Редактировать</button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="table-container">
      {selectedRows.length > 0 && (
        <div className="actions-bar">
          <button onClick={handleDelete}>Удалить выбранные</button>
          <span>Выбрано: {selectedRows.length}</span>
        </div>
      )}
      <table>
        <thead>
          <tr>{renderHeaders()}</tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  );
};

export default DataTable;