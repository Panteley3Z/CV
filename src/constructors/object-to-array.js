export function objectToArray(obj) {
    if (!Object.keys(obj).length) return;

    const array = [];
    for (let item in obj) {
        array.push(item);
        const subItem = objectToArray(obj[item]);
        if (subItem) { array.push(...subItem) }
    }
    return array
}