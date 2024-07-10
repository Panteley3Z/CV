export function ColorTable(toNode, columns = 7, rows = 7) {

    const box = document.createElement('div');
    box.className = "box-item";

    const colorTable = document.createElement('table');
    colorTable.className = "color-table";
    fillTable();

    box.appendChild(colorTable);
    toNode.appendChild(box);

    const cells = colorTable.querySelectorAll("td");
    const newSet = new Set();
    const highlight = "highlight";

    colorTable.addEventListener("click", (event) => {
        if (event.target.classList.contains(highlight)) {
            event.target.classList.remove(highlight)
        } else event.target.classList.add(highlight);
    })

    const cTintervalId = setInterval(() => {
        let pos = Math.floor(Math.random() * cells.length);
        if (newSet.has(pos)) {
            let temp = cells[pos];
            temp.style.transform = "scalex(0)";
            setTimeout( () => {temp.style.transform = "scale(1)"}, 500)
        }
        if (newSet.size === cells.length) {
            clearInterval(cTintervalId);
            console.log("cleared")
        } else { 
            newSet.add(pos);
            if (!cells[pos].classList.contains(highlight)) {
                cells[pos].classList.add(highlight);
                newSet.forEach((v) => {
                    if (!cells[v].classList.contains("even") && !cells[v].classList.contains("odd")) {
                        v % 2 === 0 ? cells[v].classList.add("odd") : cells[v].classList.add("even");
                        let vT = v + 1;
                        cells[v].innerText = vT
                    }
                    
                })
            }
        }
    }, 1000);

    function fillTable() {
        for (let r = 0; r < rows; r++) {
            let tr = document.createElement('tr');
            if (r == 0) tr.className = "table_first_row";
            if (r == rows - 1) tr.className = "table_last_row";
            colorTable.appendChild(tr);
            for (let c = 0; c < columns; c++) {
                let td = document.createElement('td');
                if (c == 0) td.className = "table_first_column";
                if (c == columns - 1) td.className = "table_last_column";
                tr.append(td)
            }
        }
    }
}