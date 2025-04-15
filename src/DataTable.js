import React, { useState } from 'react';

const DataTable = ({ 
  headers, 
  data, 
  renderRow, 
  renderHeader,
  onDeleteSelected,
  onUpdate
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleRowClick = (rowIndex) => {
    setSelectedRows(prevSelectedRows =>
      prevSelectedRows.includes(rowIndex)
        ? prevSelectedRows.filter(row => row !== rowIndex)
        : [...prevSelectedRows, rowIndex]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(data.map((_, index) => index));
    } else {
      setSelectedRows([]);
    }
  };

  const handleDelete = () => {
    const idsToDelete = selectedRows.map(index => data[index].id);
    onDeleteSelected(idsToDelete);
    setSelectedRows([]);
  };

  const handleEdit = (rowIndex) => {
    setEditingRow(rowIndex);
    setEditFormData({
      postId: data[rowIndex].postId,
      id: data[rowIndex].id,
      name: data[rowIndex].name,
      email: data[rowIndex].email,
      body: data[rowIndex].body
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onUpdate(editFormData);
    setEditingRow(null);
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
  };

  const renderHeaders = () => {
    return (
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
        <th>Действия</th>
      </>
    );
  };

  const renderRows = () => {
    return data.map((item, rowIndex) => {
      if (editingRow === rowIndex) {
        return (
          <tr key={rowIndex} className="editing-row">
            <td colSpan={headers.length + 2}>
              <form onSubmit={handleEditSubmit} className="edit-form">
                <div className="form-group">
                  <label>Post ID:</label>
                  <input
                    type="text"
                    name="postId"
                    value={editFormData.postId}
                    onChange={handleEditChange}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>ID:</label>
                  <input
                    type="text"
                    name="id"
                    value={editFormData.id}
                    onChange={handleEditChange}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Имя:</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Текст:</label>
                  <textarea
                    name="body"
                    value={editFormData.body}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">Сохранить</button>
                  <button type="button" onClick={handleCancelEdit} className="cancel-btn">Отмена</button>
                </div>
              </form>
            </td>
          </tr>
        );
      }
  
      return (
        <tr 
          key={rowIndex} 
          className={selectedRows.includes(rowIndex) ? 'selected-row' : ''}
        >
          <td>
            <input 
              type="checkbox" 
              checked={selectedRows.includes(rowIndex)}
              onChange={() => handleRowClick(rowIndex)}
            />
          </td>
          <td>{item.postId}</td>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{item.email}</td>
          <td className="comment-body">{item.body}</td>
          <td>
            <button 
              onClick={() => handleEdit(rowIndex)}
              className="edit-btn">Редактировать</button>
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