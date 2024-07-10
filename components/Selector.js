import Button from "./Button.js";
import { langController } from "../controllers/stateControllers.js";

export default function Selector(selectorsList, selected = 0, title, handler) {
    /* The parameter "selectorsList" is an array of objects.
    Ex. of object: {
        icon: Icon(),
        dataset: [string, string]
        textKey: string
    }
    */
    const selectedClass = "selected";

    const container = document.createElement('div');
    container.className = "selector-container";

    const containerTitle = langController.createLabel('h3', title, "selector-title");
    container.appendChild(containerTitle);

    const containerContent = document.createElement('div');
    container.appendChild(containerContent);

    for (let b = 0; b < selectorsList.length; b++) {
        const text = selectorsList[b].textKey || "";
        const icon = selectorsList[b].icon;
        const button = Button(text, "control selector", icon);
        if (b === selected) { button.classList.add(selectedClass) }
        if (selectorsList[b].dataset) { button.dataset[selectorsList[b].dataset[0]] = selectorsList[b].dataset[1] }
        containerContent.appendChild(button);
    }
    containerContent.addEventListener("click", (e) => {
        containerContent.childNodes.forEach(item => {
            if (item === e.target.closest(".button")) { item.classList.add(selectedClass); if (handler) { handler(item) } }
            else if (item.classList.contains(selectedClass)) { item.classList.remove(selectedClass) }
        })
    });
    return container
}