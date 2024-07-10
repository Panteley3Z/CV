export function NotifyPopup(text = "!") {
    const popUp = document.createElement('div');
    popUp.className = "notify-popup";
    popUp.innerText = text;
    document.body.appendChild(popUp);
    setTimeout( () => {
        popUp.classList.add("transparent");
        setTimeout( () => popUp.remove(), 1000)
    }, 4000)
}

