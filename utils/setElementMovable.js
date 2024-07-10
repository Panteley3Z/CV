import useThrottling from "./useThrottling.js"

export function setElementMovable(elementNode, handlePointNode, fieldNode) {

    const mover = useThrottling(moveElementByPointer, 100);

    let elementCenterX = 0;

    let fieldHeight = fieldNode.clientHeight;
    let fieldTopOffset = 0;

    let moved = false;

    fieldNode.addEventListener('mousedown', startMoving);
    fieldNode.addEventListener('mouseup', finishMoving);

    fixFieldHeight();

    function startMoving(event) {
        if (event.target === handlePointNode) {

            fieldNode.removeEventListener('mousedown', startMoving);

            const fieldRect = fieldNode.getBoundingClientRect();

            elementCenterX = Math.floor(elementNode.clientWidth / 2) + fieldRect.x;
            fieldTopOffset = fieldRect.y;

            if (!moved) {
                elementNode.onselectstart = () => false;
                fieldNode.classList.add("shuffled");
                moveElementTo(event.x, event.y);
                moved = true
            }

            elementNode.classList.add("on-move");
            fieldNode.addEventListener('mousemove', mover);
        }
    }

    function moveElementByPointer(event) {
        moveElementTo(event.x, event.y);
    }

    function moveElementTo(posX, posY) {
        elementNode.style.left = `${posX - elementCenterX}px`;
        elementNode.style.top = `${posY - fieldTopOffset}px`;
        fixFieldHeight()
    }

    function finishMoving() {
        fieldNode.removeEventListener('mousemove', mover);
        fieldNode.addEventListener('mousedown', startMoving);
        elementNode.classList.remove("on-move");
    }

    function fixFieldHeight() {
        const elementHeightWidthOffset = elementNode.clientHeight + elementNode.offsetTop;

        if (fieldNode.clientHeight < elementHeightWidthOffset) {
            fieldHeight += elementHeightWidthOffset - fieldHeight;
            fieldNode.style.height = `${fieldHeight}px`;
        }
    }
}