export function orderBy(arr, props) {
   
    if (!arr.every(function(item) {
        return typeof item === 'object' && item !== null;
    })) {
        throw new Error("Все элементы массива должны быть объектами");
    }

    
    for (const obj of arr) {
        for (const prop of props) {
            if (!(prop in obj)) {
                throw new Error(`Объект не содержит свойства: ${prop}`);
            }
        }
    }

    
    return [...arr].sort(function(a, b) {
        for (const prop of props) {
            if (a[prop] < b[prop]) return -1;
            if (a[prop] > b[prop]) return 1;
        }
        return 0;
    });
}