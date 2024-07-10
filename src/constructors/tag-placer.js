import { objectToArray } from "./object-to-array.js";
import { tagsList } from "../content/tags-list.js";

export function tagPlacer(field, interval = 500) {
    const hasTags = field.querySelector(".tags-container");
    if (hasTags) {hasTags.remove()}
    const figure = field.querySelector(".figure");
    const tags = objectToArray(tagsList);
    const fieldWidth = field.clientWidth;
    const fieldHalfWidth = fieldWidth / 2;
    const offsetFieldY = figure.offsetTop + 20;
    const figureHeight = figure.clientHeight - 50;
    const tcHalfHeight = figureHeight / 2;
    const dirNE = "skew(-6deg, -10deg)";
    const dirNW = "skew(6deg, 10deg)";
    const tagsContainer = document.createElement("div");
    tagsContainer.className = "tags-container";
    tagsContainer.style.position = "absolute";
    tagsContainer.style.top = `${offsetFieldY}px`;
    tagsContainer.style.left = 0;
    tagsContainer.style.width = `${fieldWidth}px`;
    tagsContainer.style.height = `${figureHeight}px`;
    field.appendChild(tagsContainer);
    let count = 0;

    let idTPI = setInterval(() => {
        if (count > tags.length * 4) clearInterval(idTPI);
        let randomColor = Math.round(Math.random() * 360);
        const tag = document.createElement("div");
        tag.className = "tag nowrap";
        tag.style.position = "absolute";
        tag.innerText = tags[Math.floor(Math.random() * tags.length)];
        tagsContainer.appendChild(tag);
        let tagWidth = tag.clientWidth;
        let tagHeight = tag.clientHeight;
        let posX = Math.round(Math.random() * fieldWidth);
        if ((posX + tagWidth) > fieldWidth) {posX -= tagWidth}
        let posY = Math.round(Math.random() * figureHeight);
        if ((posY + tagHeight) > figureHeight) {posY -= tagHeight}
        tag.style.top = `${posY}px`;
        tag.style.left = `${posX}px`;
        tag.style.backgroundColor = `hsla(${randomColor},100%,50%,0.9)`;
        if (randomColor < 20 || randomColor > 200) { tag.style.color = "white" }
        else { tag.style.color = "black" }
        if (posY < tcHalfHeight) {
            if (posX < fieldHalfWidth - tagWidth) {tag.style.transform = dirNW}
            if (posX > fieldHalfWidth) {tag.style.transform = dirNE}
        } else {
            if (posX < fieldHalfWidth - tagWidth) {tag.style.transform = dirNE}
            if (posX > fieldHalfWidth) {tag.style.transform = dirNW}
        }
        count++;
    }, interval)
}