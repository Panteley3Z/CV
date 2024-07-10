export default function ListOfElements(elements, typeofList = 'ul') {

    const list = document.createElement(typeofList);
    list.className = "elements-list";

    elements.forEach(el => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        li.appendChild(a);
        list.appendChild(li);
    });
    return list
}