import { addTemporaryClassName } from "../utils/attributesHandler.js";

export default function DigitalClock(dotsX = 6, dotsY = 9) {

    const DIGITS = Array(10);
    for (let i = 0; i < 10; i++) { DIGITS[i] = createDigit(i) }

    const DIGIT_CONTAINERS = [];
    const digitsRepeats = [];

    const clockField = document.createElement('div');
    clockField.className = "clock-field";

    const separatorDots = [];
    const initFirstTime = new Date();
    let sepDotPos = Math.floor(0.1 * initFirstTime.getSeconds());

    for (let i = 0; i < 2; i++) {
        const clockUnit = document.createElement('div');
        clockUnit.className = "clock-unit";
        for (let j = 0; j < 2; j++) {
            const dc = document.createElement('div');
            dc.className = "digit-container";
            clockUnit.appendChild(dc);
            DIGIT_CONTAINERS.push(dc)
        }
        clockField.appendChild(clockUnit);
        if (i === 0) {
            const sep = document.createElement('div');
            sep.className = "clock-separator";
            const sepContent = document.createElement('table');
            sep.appendChild(sepContent);
            for (let k = 0; k < 5; k++) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.className = "sep-dot";
                tr.appendChild(td);
                sepContent.appendChild(tr);

                separatorDots.push(td)
            }
            clockField.appendChild(sep)
        }
    }

    let initialTime = getTimeString();
    setTime(initialTime);

    setInterval(updateTime, 1000);

    return clockField;

    function createDigit(n) {
        const digit = document.createElement('table');
        digit.className = `clock-digit d-${n}`;

        if (n % 2 === 0) { digit.classList.add("even") }
        else { digit.classList.add("odd") }

        let cols = dotsX;
        let rows = dotsY;

        if (rows % 2 === 0) { rows -= 1 }
        const middleRow = (rows + 1) / 2;
        const colForOne = Math.round(cols / 2) + 1;
        const cellName = "digit-cell";
        const GLOW = "glow";

        for (let r = 1; r <= rows; r++) {
            const tr = document.createElement('tr');
            let topLine = r === 1;
            let middleLine = r === middleRow;
            let bottomLine = r === rows;
            let allHLines = topLine || middleLine || bottomLine;

            for (let c = 1; c <= cols; c++) {
                const td = document.createElement('td');

                let leftLine = c === 1;
                let rightLine = c === cols;

                if (leftLine || rightLine || allHLines) { td.className = cellName; }
                if (n === 0 && (topLine || leftLine || rightLine || bottomLine)) { td.classList.add(GLOW) }
                if (n === 1 && (c === colForOne || (topLine && c === colForOne - 1))) { td.className = cellName; td.classList.add(GLOW) }
                if (n === 2 && (allHLines || (rightLine && r < middleRow) || (leftLine && r > middleRow))) { td.classList.add(GLOW) }
                if (n === 3 && (allHLines || rightLine)) { td.classList.add(GLOW) }
                if (n === 4 && (middleLine || rightLine || (leftLine && r < middleRow))) { td.classList.add(GLOW) }
                if (n === 5 && (allHLines || (rightLine && r > middleRow) || (leftLine && r < middleRow))) { td.classList.add(GLOW) }
                if (n === 6 && (allHLines || leftLine || (rightLine && r > middleRow))) { td.classList.add(GLOW) }
                if (n === 7 && (topLine || rightLine)) { td.classList.add(GLOW) }
                if (n === 8 && td.className === cellName) { td.classList.add(GLOW) }
                if (n === 9 && (allHLines || rightLine || (leftLine && r < middleRow))) { td.classList.add(GLOW) }

                if (r === 1 && c === 1) { td.classList.add('tl-corner') }
                if (r === 1 && c === cols) { td.classList.add('tr-corner') }
                if (r === 0.5 * rows + 0.5) {
                    if (c === 1) { td.classList.add('cl-corner') }
                    else if (c === cols) { td.classList.add('cr-corner') }
                }
                if (r === rows && c === 1) { td.classList.add('bl-corner') }
                if (r === rows && c === cols) { td.classList.add('br-corner') }

                tr.appendChild(td)
            }
            digit.appendChild(tr)
        }
        return digit
    }

    function getTimeString() {
        const dateNow = new Date();
        //TEST
        // dateNow.setHours(12,21)
        ///END
        let hours = dateNow.getHours();
        let minutes = dateNow.getMinutes();

        if (hours < 10) hours = `0${hours}`;
        if (minutes < 10) minutes = `0${minutes}`;

        const timeString = `${hours}${minutes}`;
        return timeString
    }

    function checkIsClone(digit) {
        if (!digitsRepeats.length) { digitsRepeats.push(digit); return false }
        for (let d = 0; d < digitsRepeats.length; d++) {
            if (digit === digitsRepeats[d]) { return true }
        }
        digitsRepeats.push(digit);
        return false
    }

    function setDigit(currentDigit, digitContainer, cloned = false) {
        let reqiured;
        const prevDigit = digitContainer.firstElementChild;

        if (cloned) { reqiured = DIGITS[currentDigit].cloneNode(true) }
        else { reqiured = DIGITS[currentDigit] }

        addTemporaryClassName(digitContainer, "digit-replaced", 400);

        if (prevDigit) { prevDigit.replaceWith(reqiured) }
        else { digitContainer.appendChild(reqiured) }

    }

    function setTime(currentTime) {

        for (let t = 0; t < 4; t++) {
            const digit_temp = currentTime.charAt(t);
            const state = checkIsClone(digit_temp);
            setDigit(digit_temp, DIGIT_CONTAINERS[t], state)
        }

        if (sepDotPos > 0) {
            for (let i = 1; i <= sepDotPos; i++) {
                separatorDots[separatorDots.length - i].classList.add("glow");
            }
        }
    }

    function updateTime() {
        const currentTime = getTimeString();

        let chainDelay = 0;

        if (currentTime != initialTime) {
            for (let i = 0; i < 4; i++) {
                const itd = initialTime.charAt(i);
                const ctd = currentTime.charAt(i);
                if (itd !== ctd) {
                    const state = checkIsClone(ctd);
                    setDigit(ctd, DIGIT_CONTAINERS[i], state)
                }
            }

            initialTime = currentTime;

            if (sepDotPos > 0) {
                for (let dot of separatorDots) { dot.classList.remove("glow") }
                sepDotPos = 0
            }
            
        } else {
            const timeNow = new Date();
            let pos_temp = Math.floor(0.1 * timeNow.getSeconds());

            if (pos_temp !== sepDotPos) {
                separatorDots[separatorDots.length - pos_temp].classList.add("glow");
                sepDotPos = pos_temp
                if (sepDotPos === 5) {
                    for (let i = 1; i < separatorDots.length - 1; i++) { separatorDots[i].classList.remove("glow") }
                }
            }
            if (sepDotPos === 5) {
                for (let i = 1; i < separatorDots.length - 1; i++) {
                    addTemporaryClassName(separatorDots[i], "shine", 400, chainDelay);
                    chainDelay += 100
                }
            }
        }

        for (let p = 0; p < separatorDots.length - sepDotPos; p++) {
            addTemporaryClassName(separatorDots[p], "shine", 400, chainDelay);
            chainDelay += 100
        }
    }
}