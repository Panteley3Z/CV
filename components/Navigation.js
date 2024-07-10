export default function Navigation(CN, elements) {
    const nav = document.createElement('nav');
    nav.className = CN || "navigation";
    elements.forEach(el => {
        if (typeof el === 'string') { return }
        el.setAttribute("class", `${nav.className}__${el.className}`)
        nav.appendChild(el)
    });
    return nav
}