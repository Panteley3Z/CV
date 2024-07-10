export default function alignContent(element, container) {
    const dHH = (container.clientHeight - element.clientHeight)/2;
    if (dHH > 0) { element.style.marginTop = `${dHH}px` }
    else { element.style.marginTop = "0px" }
}