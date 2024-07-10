import { langController } from "../controllers/stateControllers.js";
import Icon from "../components/Icon.js";
import { iconset } from "../icons/iconset.js";

export default function CalendarMonth(monthOrder = new Date().getMonth(), yearOrder = new Date().getFullYear(), inYear = false) {
    const monthContainer = document.createElement('table');
    monthContainer.className = "month-container";

    const header = document.createElement('thead');
    const tBody = document.createElement('tbody');
    header.className = "month-header";
    tBody.className = "month-body";
    monthContainer.append(header, tBody);

    const prevMD_CN = "prev-month-day";
    const nextMD_CN = "next-month-day";

    const NAMES_DAYSofWEEK = [
        "c_mon",
        "c_tue",
        "c_wed",
        "c_thu",
        "c_fri",
        "c_sat",
        "c_sun"
    ];

    const formatOptions = { year: 'numeric', month: 'long' }

    const headerRow = document.createElement('tr');
    const daysOfWeek = document.createElement('tr');
    header.append(headerRow, daysOfWeek);

    const monthTitle = document.createElement('th');
    monthTitle.className = "month-title";

    let toPrevM;
    let toNextM;
    if (inYear) {
        monthTitle.colSpan = 7;
        headerRow.appendChild(monthTitle)
    } else {
        monthTitle.colSpan = 5;
        toPrevM = document.createElement('td');
        toNextM = document.createElement('td');
        toPrevM.className = "to-prev-month to-month";
        toNextM.className = "to-next-month to-month";
        toPrevM.appendChild(Icon(iconset.left));
        toNextM.appendChild(Icon(iconset.right));

        toPrevM.onclick = () => { changeToMonth(-1) }
        toNextM.onclick = () => { changeToMonth(1) }
        headerRow.append(toPrevM, monthTitle, toNextM);
    }

    for (let N of NAMES_DAYSofWEEK) { daysOfWeek.appendChild(langController.createLabel('th', N)) }

    let thisDate = new Date();
    let year = yearOrder;
    let month = monthOrder;
    let today = thisDate.getDate();

    let currentMonth = new Date(year, month);
    let selectedDay;

    if (month === thisDate.getMonth() && year === thisDate.getFullYear()) { selectedDay = today }

    fillMonthBody(currentMonth);

    if (!inYear) {
        monthContainer.addEventListener("click", (e) => {
            if (e.target.parentNode.parentNode === tBody) { selectedDay = Number(e.target.textContent); e.target.classList.toggle("selected") }
            if (e.target.classList.contains(prevMD_CN)) { changeToMonth(-1) }
            else if (e.target.classList.contains(nextMD_CN)) { changeToMonth(1) }
        })
    }

    return monthContainer

    function changeToMonth(routeWeight) {
        month += routeWeight;
        monthContainer.setAttribute('class', "month-container");
        tBody.innerHTML = "";
        currentMonth = new Date(year, month);
        fillMonthBody(currentMonth)
    }

    function fillMonthBody(date) {

        let firstDateOfMonth = date;
        let lastDateOfMonth = new Date(year, month + 1, 0);
        let dayOfWeek = firstDateOfMonth.getDay();
        let days = lastDateOfMonth.getDate();

        let lastDateOfPrevMonth = new Date(year, month, 0);
        let daysInPrevMonth = lastDateOfPrevMonth.getDate();

        if (dayOfWeek === 0) { dayOfWeek = 7 }
        let firstDayShift = dayOfWeek - firstDateOfMonth.getDate();
        let dayCount = 1;

        let monthInfo = `${date.toLocaleDateString(document.documentElement.getAttribute("lang"), formatOptions)}`;
        if (!inYear) { monthTitle.innerText = monthInfo }
        else {
            const spannedInfo = monthInfo.split(" ");
            for (let i = 0; i < 2; i++) {
                const s = document.createElement('span');
                monthTitle.appendChild(s);
                s.textContent = spannedInfo[i];
            }
        }

        const monthDataYN = date.toLocaleString('default', formatOptions);

        const monthDataValues = monthDataYN.split(" ");
        const monthName = monthDataValues[0].toLowerCase();
        const monthYear = monthDataValues[1];
        let seasonName;

        if (monthName === "march" || monthName === "april" || monthName === "may") { seasonName = "spring" }
        if (monthName === "june" || monthName === "july" || monthName === "august") { seasonName = "summer" }
        if (monthName === "september" || monthName === "october" || monthName === "november") { seasonName = "fall" }
        if (monthName === "december" || monthName === "january" || monthName === "february") { seasonName = "winter" }

        monthContainer.id = `${monthName}-${month}-${monthYear}`;
        monthContainer.classList.add(seasonName);
        monthContainer.classList.add(monthName);

        while (dayCount <= days) {
            let weekRow = document.createElement('tr');
            let nmd = 1;
            for (let i = 0; i < 7; i++) {
                let td = document.createElement('td');
                td.className = "month-day";
                if (firstDayShift > 0) {
                    let dc = daysInPrevMonth - firstDayShift;
                    dc++;
                    if (!inYear) { td.classList.add(prevMD_CN) }
                    td.innerText = dc;
                    firstDayShift--
                } else if (dayCount <= days) {
                    td.classList.add("this-month-day");
                    td.innerText = dayCount;
                    if (dayCount === today && month === thisDate.getMonth() && year === thisDate.getFullYear()) {
                        if (inYear) { header.id = "this-month_in-this-year"; td.id = "today_in-this-year" }
                        else { header.id = "this-month"; td.id = "today" }
                        td.classList.add("today")
                    } else if (dayCount === selectedDay) { td.classList.add("selected") }
                    dayCount++
                } else {
                    if (!inYear) { td.classList.add(nextMD_CN) }
                    td.innerText = nmd;
                    nmd++
                }
                weekRow.appendChild(td)
            }
            tBody.appendChild(weekRow)
        }
    }
}