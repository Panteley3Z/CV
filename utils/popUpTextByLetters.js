import { langController } from "../controllers/stateControllers.js";

export default function popUpTextByLetters(nodeElement) {
    const text = nodeElement.textContent;
    const parent = nodeElement.parentElement;
    const textWidth = parent.clientWidth;
    const textHight = parent.clientHeight;
    parent.textContent = "";
    parent.style.minWidth = `${textWidth}px`;
    parent.style.minHeight = `${textHight}px`;
    const letters = text.split('');
    let letterIndex = 0;

    let popupIntervalID = setInterval( () => {
        if (letterIndex >= letters.length - 1) { clearInterval(popupIntervalID) }
        const letter = langController.createLabel('span', letters[letterIndex]);
        letter.classList.add('popup-letter');
        parent.appendChild(letter);
        letterIndex++;
    }, 100);
}