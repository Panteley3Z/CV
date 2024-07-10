import Button from "./Button.js";
import Icon from "./Icon.js";
import { iconset } from "../icons/iconset.js";

import alignContent from "../utils/alignContent.js";

export default function Module(parent, content) {
    const backdrop = document.createElement('div');
    backdrop.className = "module-backdrop";
    parent.appendChild(backdrop);

    const container = document.createElement('div');
    container.className = "module";
    if (window.innerWidth <= 576) { container.classList.add("fullscreen") }
    backdrop.appendChild(container);

    const actions = document.createElement('div');
    actions.className = "module-actions";
    container.appendChild(actions);

    const fullscreenIcons = [Icon(iconset.fullscreen), Icon(iconset.fullscreen_ex)];
    const bFullscreen = Button(["fullscreen", "fullscreen_exit"], "control fullscreen--button", fullscreenIcons);

    const bBack = Button("", "control back", Icon(iconset.back));
    actions.append(bBack, bFullscreen);

    container.appendChild(content);
    
    content.classList.add("module-content");

    const contentID = content.getAttribute('id');
    const contentClass = content.classList;

    if (contentID) { container.classList.add(`module__${contentID}`) }
    else if (contentClass) { container.classList.add(`module__${contentClass[0]}`) }

    alignContent(container, backdrop);

    bFullscreen.addEventListener('click', () => {
        container.classList.toggle("fullscreen");
        alignContent(container, backdrop)
    });
    bBack.addEventListener('click', () => { backdrop.remove() }, { once: true });
}