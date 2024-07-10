import { langController } from "../controllers/stateControllers.js";
import { addClassList } from "../utils/attributesHandler.js";

export default function Input(type, id, textKey, CN = "", reqiured = false) {
    const container = document.createElement('div');
    container.className = "input-container nowrap";

    if (textKey) {
        const labelElement = langController.createLabel('label', textKey);
        labelElement.setAttribute('for', id);
        labelElement.className = "input-label";
        container.appendChild(labelElement)
    }

    const inputElement = document.createElement('input');
    inputElement.setAttribute('type', type);
    inputElement.id = id;
    inputElement.className = "input";
    addClassList(inputElement, CN, "input");
    if (reqiured) { inputElement.setAttribute('reqiured', true) }
    container.appendChild(inputElement);

    return container
}