export default function createElementsTree(obj) {

    const keys = Object.keys(obj);
    if (!keys.length) return;

    const parent = document.createElement(Object.keys(obj)[0]);
    for (let item in obj) {
        
        console.log(parent); 

        for (let attr in item) {
            console.log(item[attr])
        }
    }
    return parent
}

/*
{
    defs: {
        children: [
            { linearGradient: { id: "z-logo-gradient", x1: "0.2", x2: "0.8", y1: "0", y2: "1" } },
            { linearGradient: { id: "p-logo-gradient", x1: "0", x2: "0", y1: "0", y2: "1" } }
        ]
    }
}

*/
