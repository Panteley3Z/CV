import Button from "./Button.js";

export default function Tabs(tabsList, selected = 0, handler) {
    /* The parameter "tabsList" is an array of objects.
    Ex. of object: {
        icon: Icon(),
        dataset: string,
        textKey: string
    }
    */
    const selectedClass = "selected";

    const container = document.createElement('div');
    container.className = "tabs-container";
    for (let t = 0; t < tabsList.length; t++) {
        const text = tabsList[t].textKey || "";
        const icon = tabsList[t].icon;
        const button = Button(text, "tab", icon);
        if (t === selected) { button.classList.add(selectedClass) }
        if (tabsList[t].dataset) { button.dataset[tabsList[t].dataset[0]] = tabsList[t].dataset[1] }
        container.appendChild(button);
    }
    container.addEventListener("click", (e) => {
        container.childNodes.forEach(item => {
            if (item === e.target.closest(".button")) { item.classList.add(selectedClass); if (handler) { handler(item) } }
            else if (item.classList.contains(selectedClass)) { item.classList.remove(selectedClass) }
        });
    });
    return container
}