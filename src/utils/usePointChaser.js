import useThrottling from "./useThrottling.js";

export default function usePointChaser(targetNode, parentNode, options = { caller: "parent", cssPosition: "static", pointOffset: 0, lazing: 0 }) {

    /*
        options = {
            caller: string ("self", "parent", "#id-of-element"),
            cssPosition: string (If targetNode has css-position),
            pointOffset: number (-n..n+ targetNode offset by axises in percents from pointer),
            lazing: number (0..1)
        }
    */
    const targetNodeHeight = targetNode.clientHeight;
    const targetNodeWidth = targetNode.clientWidth;

    let targetYcenter = 0;
    let targetXcenter = 0;

    let targetRectTop = 0;
    let targetRectLeft = 0;

    let scrollOffset = 0;

    let lazing_Y = 0.6;
    let lazing_X = 0.6;

    const ratio = Number((window.innerHeight / window.innerWidth).toFixed(3));

    if (ratio > 1) { lazing_Y += 0.1; lazing_X -= 0.1 }
    else { lazing_Y -= 0.1; lazing_X += 0.1 }

    let callerNode;
    let chaserCN;
    let isAbsolute = false;
    let isFirstChase = true;

    if (options) {
        isAbsolute = options.cssPosition === "absolute";

        if (options.pointOffset) {
            targetYcenter = Math.round(targetNodeHeight - (targetNodeHeight / 100 * options.pointOffset))
            targetXcenter = Math.round(targetNodeWidth - (targetNodeWidth / 100 * options.pointOffset))
        } else {
            targetYcenter = Math.round(targetNodeHeight / 2);
            targetXcenter = Math.round(targetNodeWidth / 2)
        }

        if (isAbsolute) {
            chaserCN = "absolute-chaser";
            lazing_Y = 1; lazing_X = 1;
        } else {
            chaserCN = "relative-chaser";
            targetYcenter += targetNode.offsetTop;
            targetXcenter += targetNode.offsetLeft;
        }

        if (options.caller) {
            if (options.caller === "self") {
                callerNode = targetNode
            } else if (options.caller.startsWith("#")) {
                callerNode = document.querySelector(options.caller)
            }
        } else {
            callerNode = parentNode
        }
        if (options.lazing) { lazing_Y = options.lazing; lazing_X = options.lazing }
    }
    callerNode.addEventListener('mouseover', startChasing);

    const chasePointer = useThrottling(chasing, 100);
    
    function startChasing() {
        targetNode.classList.add(chaserCN);

        window.addEventListener('mousemove', chasePointer);
        window.addEventListener('scroll', chasePointer);
        targetNode.addEventListener('click', stopChasing)
    }

    function chasing(event) {

        const parentRect = parentNode.getBoundingClientRect();

        if (event.type === 'mousemove') {
            scrollOffset = parentRect.top;
            let scrolled = 0;
            if (!isAbsolute) { scrolled += document.documentElement.scrollTop }
            targetRectTop = Math.round(lazing_Y * (event.clientY - targetYcenter + scrolled));
            targetRectLeft = Math.round(lazing_X * (event.clientX - targetXcenter));
        }

        if (parentRect.bottom <= 0 || parentRect.top >= window.innerHeight) { stopChasing(); return }

        if (targetRectTop > parentRect.height || targetRectTop > parentRect.bottom - targetNodeHeight) {
            if (targetRectTop > parentRect.height) {
                targetRectTop = parentRect.height - targetNodeHeight + Math.round((Math.random() * 23))
            } else {
                targetRectTop = parentRect.bottom - targetNodeHeight + Math.round((Math.random() * 23))
            }
        } else if (targetRectTop < 0 - parentRect.height || targetRectTop < parentRect.top) {
            if (targetRectTop < 0 - parentRect.height) {
                targetRectTop = targetNodeHeight - parentRect.height + Math.round((Math.random() * 23))
            } else if (isAbsolute) {
                targetRectTop = parentRect.top - Math.round((Math.random() * 23))
            }
        }
        if (isAbsolute && event.type === 'scroll') { targetRectTop += parentRect.top - scrollOffset; scrollOffset = parentRect.top }

        setPosition(targetRectTop, targetRectLeft);
    }

    function stopChasing() {
        
        window.removeEventListener('mousemove', chasePointer);
        window.removeEventListener('scroll', chasePointer);

        if (isAbsolute) {
            setPosition(0, 0);
            isFirstChase = !isFirstChase
        } else { setPosition(0, 0) }

        targetNode.classList.remove(chaserCN)
    }

    function setPosition(posY, posX) {
        // console.log(`Y: ${posY} X: ${posX}`);
        targetNode.style = `top: ${posY}px; left: ${posX}px`;
    }
}