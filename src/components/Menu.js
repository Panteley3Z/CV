import Icon from "./Icon.js";
import { langController } from "../controllers/stateControllers.js";

export default function Menu(objects = [], typeofList = 'ul') {

    const list = document.createElement(typeofList);
    list.className = "menu";

    const itemClass = "menu-item";
    let itemsCount = 0;

    objects.forEach(object => {

        const objKeys = Object.keys(object);

        const li = document.createElement('li');
        li.className = itemClass;

        if(itemsCount === 0) { li.classList.add("active") } 

        const a = document.createElement('a');
        a.className = "menu-item--href";

        objKeys.forEach(key => {
            switch (key) {
                case "id":
                    li.id = object[key];
                    break;
                case "icon":
                    a.appendChild(Icon(object[key], itemClass));
                    break;
                case "href":
                    a.setAttribute("href", object[key]);
                    break;
                case "textLabel":
                    a.appendChild(langController.createLabel('span', object[key], itemClass));
                    break;
                default: return;
            }
        });

        li.appendChild(a);
        list.appendChild(li);
        itemsCount++
    });

    list.addEventListener("click", (e) => {
        list.childNodes.forEach(item => {
            if (item === e.target.closest("li")) { item.classList.add('active') }
            else if (item.classList.contains('active')) { item.classList.remove('active') }
        });
    });

    return list
}