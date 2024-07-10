export class Article {
    constructor({id, title, text, photo, author = ""}) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.photo = photo;
        this.author = author
    }

    createArticle() {
        const article = document.createElement("article");
        article.id = this.id;
        article.className = "article";
        article.classList.add(this.id);
        const header = document.createElement("h2");
        header.innerHTML = this.title;
        const section = document.createElement("section");
        const fig = document.createElement("figure");
        fig.className = "figure";
        const figImg = document.createElement("img");
        figImg.setAttribute("src", "");
        const figCap = document.createElement("figcaption");
        figCap.innerText = this.author;
        const p = document.createElement("p");
        p.className = "article__text";
        p.append(this.text);
        fig.append(figImg, figCap);
        section.append(fig, p);
        article.append(header, section);
        return article
    }
}
