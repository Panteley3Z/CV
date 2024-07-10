import { langController } from "../controllers/stateControllers.js";

export function addTemporaryClassName(element, CN, period = 1000, delay = 0) {
    setTimeout(() => {
        element.classList.add(CN);
        setTimeout(() => { element.classList.remove(CN) }, period)
    }, delay)
}

export function changeTemporaryLabel(element, tempLabel, period = 2000) {
    const prevlabel = element.dataset.label;
    langController.changeLabel(element, tempLabel);
    setTimeout(() => { langController.changeLabel(element, prevlabel) }, period)
}

export function setTemporaryDisabled(element, period = 2000) {
    element.setAttribute("disabled", "true");
    setTimeout(() => { element.removeAttribute("disabled") }, period)
}

export function addClassList(element, classString, defaultSuffix) {
    if (classString.length > 0) {
        const classTokens = classString.split(" ");
        const firstToken = `${classTokens[0]}--${defaultSuffix}`;
        element.classList.add(firstToken);
        if (classTokens.length > 1) {
            for (let i = 1; i < classTokens.length; i++) { element.classList.add(classTokens[i]) }
        }
    }
}

export function setCurrentBoundedClass(element, currentClass, boundedClasses) {

    if (!element.classList.contains(currentClass)) {
        for (let bc of boundedClasses) {
            if (element.classList.contains(bc)) { element.classList.remove(bc) }
        }
        element.classList.add(currentClass)
    }
}