import CalendarMonth from "./CalendarMonth.js";
import DigitalClock from "./DigitalClock.js";

import Button from "../components/Button.js";
import Icon from "../components/Icon.js";
import Input from "../components/Input.js";

import { iconset } from "../icons/iconset.js";
import { addTemporaryClassName } from "../utils/attributesHandler.js";
import { setElementMovable } from "../utils/setElementMovable.js";


export default function ScreenSaver() {
    const container = document.createElement('div');
    container.className = "widget-container";

    const settingsBlock = document.createElement('div');
    settingsBlock.className = "container__settings-block";
    container.appendChild(settingsBlock);

    const settingsBlockOpener = Button("", "control settings", Icon(iconset.settings));
    settingsBlock.appendChild(settingsBlockOpener);

    const settingsList = document.createElement('ul');
    settingsList.className = "settings-list";
    settingsBlock.appendChild(settingsList);

    settingsBlockOpener.addEventListener('click', () => {
        addTemporaryClassName(settingsBlockOpener, 'activating');
        settingsBlock.classList.toggle("opened")
    })

    const content = document.createElement('div');
    content.className = "widgets-field";
    container.appendChild(content);

    addWidget(DigitalClock);

    const widgets = [
        { appEntity: CalendarMonth, icon: Icon(iconset.calendar), isNode: null }
    ];

    for (let widget of widgets) {
        const li = document.createElement('li');
        const addWidgetButton = Button("", "control", widget.icon);
        li.appendChild(addWidgetButton);
        settingsList.appendChild(li);
        addWidgetButton.addEventListener('click', () => {
            if (!widget.isNode) { widget.isNode = addWidget(widget.appEntity) }
            else { widget.isNode.classList.toggle("no-display") }
            addWidgetButton.classList.toggle("active")
        })
    }

    const inputBackground = Input("file", "change-widget-bg", "change_bg", "change-bg");
    inputBackground.classList.add("widget-input-block");
    settingsList.appendChild(inputBackground);

    inputBackground.addEventListener('change', (e) => {
        const blob = URL.createObjectURL(e.target.files[0]);
        container.style = `background: url("${blob}") center center / cover no-repeat !important;`;
        setTimeout(() => { URL.revokeObjectURL(blob) }, 3000)
    });

    return container;

    function addWidget(appInstance) {
        const widget = document.createElement('div');
        widget.className = "widget";

        const handlePoint = document.createElement('div');
        handlePoint.className = "handle-point";
        widget.appendChild(handlePoint);

        content.appendChild(widget);
        const app = appInstance();
        widget.appendChild(app);
        setElementMovable(widget, handlePoint, content);
        widget.classList.add(`${app.classList[0]}--widget`);
        return widget
    }
} 