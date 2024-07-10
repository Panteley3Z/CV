import Icon from "./Icon.js";
import Module from "./Module.js";
import { langController } from "../controllers/stateControllers.js";

export default function Card(CN = '', obj = {}) {

    const body = document.body || document.documentElement;
    const cardContainer = document.createElement('div');

    if (CN.length > 0) {
        const classTokens = CN.split(" ");
        cardContainer.className = classTokens[0] + "-card";
        if (classTokens.length > 1) {
            for (let i = 1; i < classTokens.length; i++) { cardContainer.classList.add(classTokens[i]) }
        }
    } else { cardContainer.className = "card" }

    cardContainer.id = obj?.id;

    if (obj.icon) {
        const i = Icon(obj.icon);
        i.classList.add('card__icon');
        cardContainer.appendChild(i);
    }
    if (obj.title) {
        const h2 = langController.createLabel("h2", obj.title);
        h2.classList.add('card__title');
        cardContainer.appendChild(h2)
    }
    if (obj.description) {
        const p = langController.createLabel("p", obj.description);
        p.classList.add("card__description");
        p.classList.add("subtext");
        cardContainer.appendChild(p)
    }
    if (obj.app) { cardContainer.addEventListener('click', () => { Module(body, obj.app()) }) }
    if (obj.target) { cardContainer.addEventListener('click', () => { window.open(obj.target, 'target_blank') }) }
    return cardContainer
}