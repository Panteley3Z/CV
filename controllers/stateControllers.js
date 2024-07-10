import { iconset } from "../icons/iconset.js";
import { DICTIONARY } from "../lang/dictionary.js";

const docHTML = document.documentElement;

class BaseMode {

    //type = "typeMode";
    //states = ["s1", "s2"];
    constructor(defaultSate) {
        this.defaultSate = defaultSate
    }

    init() { !this.getMode() ? this.setMode(this.defaultSate) : this.setMode(this.getMode()) }

    getMode() {
        const data = this.getData();
        if (data) { return data[this.type] }
        else {
            let siteModes = { [this.type]: "" }
            this.pushData(siteModes);
            this.getMode()
        }
    }
    setMode(m) {
        const data = this.getData();
        if (m !== data[this.type]) { data[this.type] = m; this.pushData(data) }
    }
    switchMode() {
        const state = this.getMode();
        switch (state) {
            case this.states[0]: { this.setMode(this.states[1]); break; }
            case this.states[1]: { this.setMode(this.states[0]); break; }
            default: this.setMode(this.defaultSate)
        }
        return this.getMode()
    }

    getData = () => JSON.parse(localStorage.getItem("siteModes"));
    pushData = (d) => localStorage.setItem("siteModes", JSON.stringify(d))
}

class ThemeMode extends BaseMode {

    type = "themeMode";
    states = ["dark", "light"];

    constructor(defaultSate) {
        super(defaultSate = "light")
    }

    //@Override
    setMode(m) {
        super.setMode(m);
        document.body.className = `body-${m}`;
    }
}

class LangMode extends BaseMode {

    type = "langMode";
    states = ["en", "ru"];

    constructor(defaultSate) {
        super(defaultSate = navigator.language.slice(0, 2))
    }

    //@Override
    setMode(m) {
        super.setMode(m);
        document.documentElement.setAttribute("lang", m);
        this.setLabels(document)
    }
    setLabels(n) {
        const labels = n.querySelectorAll(".label");
        labels.forEach(l => { this.setCurrentLabel(l) })
    }
    setCurrentLabel(e, k) {
        const labeled = e.dataset.label;
        if (labeled && DICTIONARY[labeled]) {
            if (docHTML.getAttribute("lang") === "ru") { e.innerHTML = DICTIONARY[labeled].RU }
            else { e.innerHTML = DICTIONARY[labeled].EN }
        } else if (k) { e.innerHTML = k }
    }
    createLabel(tag, key = "", CN = "") {
        const l = document.createElement(tag);
        if (key === " ") { l.classList.add('blank-label') }
        else if (typeof key !== 'number') { l.classList.add('label'); l.dataset.label = key.toLowerCase() }
        if (CN.length > 1) { l.classList.add(`${CN}--label`) }
        this.setCurrentLabel(l, key);
        return l
    }
    changeLabel(elem, key) {
        elem.dataset.label = key;
        this.setCurrentLabel(elem, key);
    }
    getPageLangPrefix() {
        if (docHTML.getAttribute("lang") === "ru") { return "ru" }
        else { return "en" }
    }
}

export const themeController = new ThemeMode();
export const langController = new LangMode();