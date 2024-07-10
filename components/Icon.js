import { addClassList } from "../utils/attributesHandler.js";

export default function Icon(paths = [], classes, attributes) {

    /*
    attributes = {
        size: number,
        viewBox: "x x x x",
        defs: [
            { tagName: string, attrs: string, stops: [ strings ] }
        ]
    }
    */

    const iconContainer = document.createElement('i');
    iconContainer.className = "icon";
    if (classes) { addClassList(iconContainer, classes, "icon") }

    let size = "";
    let viewBox = "0 -960 960 960";
    let defs = "";
    let pathesAttributes = [];

    if (attributes) {
        if (attributes.size) { size = `width="${attributes.size}" height="${attributes.size}"`}

        if (attributes.viewBox) { viewBox = attributes.viewBox }

        if (attributes.defs) {
            let allDefs = "";
            for (let def of attributes.defs) {
                let defNode = `<${def.tagName} ${def.attrs}>`;
                if (def.stops) {
                    for (let stop of def.stops) { defNode += stop }
                }
                defNode += `</${def.tagName}>`;
                allDefs += defNode
            }
            defs = `<defs>${allDefs}</defs>`
        }
        if (attributes.pathesAttributes) { pathesAttributes = attributes.pathesAttributes }
    }

    let fullPath = "";
    for (let i = 0; i < paths.length; i++) {
        let pathAttributes = "";
        if (pathesAttributes[i]) { pathAttributes = pathesAttributes[i] }
        fullPath += `<path d="${paths[i]}" ${pathAttributes}></path>`
    }

    iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" ${size} viewBox="${viewBox}">${defs}${fullPath}</svg>`;
    return iconContainer
}