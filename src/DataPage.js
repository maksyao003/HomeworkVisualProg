import React, { useState, useEffect, useOptimistic } from 'react';
import DataTable from './DataTable';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const DataPage = ({ endpoint, type }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [optimisticData, addOptimisticData] = useOptimistic(data, (state, action) => {
    switch (action.type) {
      case 'add':
        return [...state, action.item];
      case 'delete':
        return state.filter(item => !action.ids.includes(item.id));
      case 'update':
        return state.map(item => (item.id === action.item.id ? action.item : item));
      default:
        return state;
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${endpoint}?_limit=10`);
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint]);

  
  const getValidationSchema = () => {
    switch (type) {
      case 'posts':
        return Yup.object({
          title: Yup.string().min(3, 'Минимум 3 символа').required('Обязательное поле'),
          body: Yup.string().min(10, 'Минимум 10 символов').required('Обязательное поле'),
        });
      case 'albums':
        return Yup.object({
          title: Yup.string().min(3, 'Минимум 3 символа').required('Обязательное поле'),
        });
      case 'todos':
        return Yup.object({
          title: Yup.string().min(3, 'Минимум 3 символа').required('Обязательное поле'),
          completed: Yup.boolean().required('Обязательное поле'),
        });
      case 'users':
        return Yup.object({
          name: Yup.string().min(2, 'Минимум 2 символа').required('Обязательное поле'),
          email: Yup.string().email('Неверный формат email').required('Обязательное поле'),
        });
      default:
        return Yup.object({});
    }
  };

  
  const getInitialValues = () => {
    switch (type) {
      case 'posts':
        return { title: '', body: '', userId: 1 };
      case 'albums':
        return { title: '', userId: 1 };
      case 'todos':
        return { title: '', completed: false, userId: 1 };
      case 'users':
        return { name: '', email: '' };
      default:
        return {};
    }
  };

  
  const getHeaders = () => {
    switch (type) {
      case 'posts':
        return ['ID', 'UserID', 'Title', 'Body'];
      case 'albums':
        return ['ID', 'UserID', 'Title'];
      case 'todos':
        return ['ID', 'UserID', 'Title', 'Completed'];
      case 'users':
        return ['ID', 'Name', 'Email'];
      default:
        return [];
    }
  };

  
  const handleAddItem = async (values, { resetForm }) => {
    const tempId = Date.now();
    const optimisticItem = { ...values, id: tempId };
    addOptimisticData({ type: 'add', item: optimisticItem });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
      if (!response.ok) throw new Error('Failed to add item');
      const createdItem = await response.json();
      setData(prev => [...prev, createdItem]);
      resetForm();
    } catch (err) {
      setError(err.message);
      setData(prev => prev.filter(item => item.id !== tempId));
    }
  };

  const handleDeleteItems = async (ids) => {
    addOptimisticData({ type: 'delete', ids });
    try {
      const deletePromises = ids.map(id =>
        fetch(`${endpoint}/${id}`, { method: 'DELETE' })
      );
      const responses = await Promise.all(deletePromises);
      if (!responses.every(response => response.ok))
        throw new Error('Failed to delete some items');
      setData(prev => prev.filter(item => !ids.includes(item.id)));
    } catch (err) {
      setError(err.message);
      const response = await fetch(`${endpoint}?_limit=10`);
      const result = await response.json();
      setData(result);
    }
  };

  const handleUpdateItem = async (updatedItem) => {
    addOptimisticData({ type: 'update', item: updatedItem });
    try {
      const response = await fetch(`${endpoint}/${updatedItem.id}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedItem),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
      if (!response.ok) throw new Error('Failed to update item');
      const data = await response.json();
      setData(prev =>
        prev.map(item => (item.id === updatedItem.id ? { ...item, ...data } : item))
      );
    } catch (err) {
      setError(err.message);
      setData(prev =>
        prev.map(item =>
          item.id === updatedItem.id ? data.find(c => c.id === updatedItem.id) : item
        )
      );
    }
  };

  
  const renderAddForm = () => (
    <Formik
      initialValues={getInitialValues()}
      validationSchema={getValidationSchema()}
      onSubmit={handleAddItem}
    >
      {({ errors, touched }) => (
        <Form className="add-form">
          <h3>Добавить новый элемент</h3>
          {type === 'posts' && (
            <>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <Field name="title" className={errors.title && touched.title ? 'error-input' : ''} />
                <ErrorMessage name="title" component="div" className="error" />
              </div>
              <div className="form-group">
                <label htmlFor="body">body</label>
                <Field
                  name="body"
                  as="textarea"
                  className={errors.body && touched.body ? 'error-input' : ''}
                />
                <ErrorMessage name="body" component="div" className="error" />
              </div>
            </>
          )}
          {type === 'albums' && (
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <Field name="title" className={errors.title && touched.title ? 'error-input' : ''} />
              <ErrorMessage name="title" component="div" className="error" />
            </div>
          )}
          {type === 'todos' && (
            <>
              <div className="form-group">
                <label htmlFor="title">Task</label>
                <Field name="title" className={errors.title && touched.title ? 'error-input' : ''} />
                <ErrorMessage name="title" component="div" className="error" />
              </div>
              <div className="form-group">
                <label>
                  <Field type="checkbox" name="completed" />
                  Completed
                </label>
              </div>
            </>
          )}
          {type === 'users' && (
            <>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <Field name="name" className={errors.name && touched.name ? 'error-input' : ''} />
                <ErrorMessage name="name" component="div" className="error" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field
                  name="email"
                  type="email"
                  className={errors.email && touched.email ? 'error-input' : ''}
                />
                <ErrorMessage name="email" component="div" className="error" />
              </div>
            </>
          )}
          <button type="submit">Добавить</button>
        </Form>
      )}
    </Formik>
  );

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <h1>{type.charAt(0).toUpperCase() + type.slice(1)}</h1>
      {renderAddForm()}
      <DataTable
        headers={getHeaders()}
        data={optimisticData}
        renderRow={item => item}
        renderHeader={header => header}
        onDeleteSelected={handleDeleteItems}
        onUpdate={handleUpdateItem}
        type={type}
      />
    </div>
  );
};

export default DataPage;