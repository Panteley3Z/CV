import { addTemporaryClassName } from "../utils/attributesHandler.js";
import Button from "./Button.js";

export default function Controls(elements = []) {

    const container = document.createElement('div');
    container.className = "controls-container";

    for (let element of elements) {

        const modeState = element.controller.getMode();
        let btLabel = "";
        let icons = element.icon;

        if (element.textLabel) { btLabel = element.textLabel }

        const controlButton = Button(btLabel, 'control', icons);
        container.appendChild(controlButton);

        if (modeState === "dark") { icons.forEach( ic => { ic.classList.toggle('no-display') }) }

        controlButton.addEventListener('click', () => {
            addTemporaryClassName(controlButton, 'activating');
            element.controller.switchMode()
        })
    }

    return container
}