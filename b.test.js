import { orderBy } from './a.js';

test('Сортировка по одному свойству', () => {
    const arr = [
        { name: 'Максим', age: 25 },
        { name: 'Ромчик', age: 30 },
        { name: 'Сеня', age: 22 }
    ];
    const sorted = orderBy(arr, ['name']);
    expect(sorted).toEqual([
        { name: 'Максим', age: 25 },
        { name: 'Ромчик', age: 30 },
        { name: 'Сеня', age: 22 }
    ]);
});

test('Сортировка по нескольким свойствам', () => {
    const arr = [
        { name: 'Максим', age: 25 },
        { name: 'Ромчик', age: 30 },
        { name: 'Максим', age: 22 }
    ];
    const sorted = orderBy(arr, ['name', 'age']);
    expect(sorted).toEqual([
        { name: 'Максим', age: 22 },
        { name: 'Максим', age: 25 },
        { name: 'Ромчик', age: 30 }
    ]);
});

test('Ошибка, если не все элементы массива являются объектами', () => {
    const arr = [
        { name: 'Максим', age: 25 },
        'not an object',
        { name: 'Ромчик', age: 30 }
    ];
    expect(() => orderBy(arr, ['name'])).toThrow("Все элементы массива должны быть объектами");
});

test('Ошибка, если объект не содержит свойства', () => {
    const arr = [
        { name: 'Максим', age: 25 },
        { name: 'Ромчик' },
        { name: 'Сеня', age: 22 }
    ];
    expect(() => orderBy(arr, ['name', 'age'])).toThrow("Объект не содержит свойства: age");
});