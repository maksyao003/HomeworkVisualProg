import React, { useState } from 'react';

const DataTable = ({ headers, data, renderRow, renderHeader }) => {
    const [selectedRows, setSelectedRows] = useState([]);

    const handleRowClick = (rowIndex) => {
        setSelectedRows(prevSelectedRows =>
            prevSelectedRows.includes(rowIndex) // Если строка уже выделена, снимаем выделение
                ? prevSelectedRows.filter(row => row !== rowIndex)
                : [...prevSelectedRows, rowIndex] // Добавляем строку в выделенные
        );
    };

    const renderHeaders = () => {
        return headers.map((header, index) => (
            <th key={index}>{renderHeader ? renderHeader(header) : header}</th>
        ));
    };

    const renderRows = () => {
        return data.map((item, rowIndex) => (
            <tr key={rowIndex}>
                {Object.values(item).map((value, cellIndex) => (
                    <td
                        key={cellIndex}
                        onClick={cellIndex === 0 ? () => handleRowClick(rowIndex) : undefined} // Обработчик только для первой ячейки
                        className={selectedRows.includes(rowIndex) ? 'selected-row' : ''}
                    >
                        {renderRow ? renderRow(value, item) : value}
                    </td>
                ))}
            </tr>
        ));
    };

    return (
        <table>
            <thead>
                <tr>{renderHeaders()}</tr>
            </thead>
            <tbody>{renderRows()}</tbody>
        </table>
    );
};

export default DataTable;
