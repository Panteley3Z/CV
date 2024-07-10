export default function textToIntro(container, text) {
    const paragraphs = text.split('##');

    for (let paragraph of paragraphs) {
        if (paragraph.length > 0) {
            const p = document.createElement('p');
            p.className = "intro-portion";
            const listItems = paragraph.split('*');
            if (listItems.length > 0) {
                const span = document.createElement('span');
                span.innerHTML = listItems[0];
                p.appendChild(span);
                const list = document.createElement('ul');
                list.className = "no-style-type";
                for (let i = 1; i < listItems.length; i++) {
                    const li = document.createElement('li');
                    li.className = "intro-item";
                    li.innerHTML = listItems[i];
                    list.appendChild(li);
                }
                p.appendChild(list);
            } else {
                p.innerHTML = paragraph
            }
            container.appendChild(p);
        }
    }
}