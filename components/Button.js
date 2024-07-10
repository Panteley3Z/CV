import { langController } from "../controllers/stateControllers.js";
import { addClassList } from "../utils/attributesHandler.js";

export default function Button(textKey, CN = "", icon = null) {
    const b = document.createElement('button');
    b.className = "button";
    addClassList(b, CN, "button");

    const icons = [];
    if (icon) {
        if (icon.length) {
            for (let i = 0; i < icon.length; i++) {
                const bIcon = icon[i];
                bIcon.classList.add("icon-in-button");
                if (i > 0) { bIcon.classList.add("no-display") }
                b.appendChild(bIcon);
                icons.push(bIcon);
            }
            b.addEventListener('click', () => {
                if (b.classList.contains("tab--button")) {
                    if (b.classList.contains("selected")) { icons.forEach( ic => ic.classList.toggle("no-display") ) }
                }
                else { icons.forEach( ic => ic.classList.toggle("no-display") ) }
            });
        }
        else {
            icon.classList.add("icon-in-button");
            b.appendChild(icon);
        }
    }

    const bSpans = [];
    if (textKey.length > 0) {
        if (typeof(textKey) === 'string') {
            const bSpan = langController.createLabel('span', textKey);
            if (icon) { bSpan.classList.add("in-button") }
            b.appendChild(bSpan);
        }
        else {
            for (let k = 0; k < textKey.length; k++) {
                const bSpan = langController.createLabel('span', textKey[k]);
                bSpan.classList.add("in-button");
                if (k > 0) { bSpan.classList.add("no-display") }
                b.appendChild(bSpan);
                bSpans.push(bSpan);
            }
            b.addEventListener('click', () => { bSpans.forEach( span => span.classList.toggle("no-display")) });
        }
    }
    return b
}