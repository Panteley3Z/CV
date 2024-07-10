import CalendarMonth from "./CalendarMonth.js";

import Button from "../components/Button.js";
import Form from "../components/Form.js";

import nodeEntryIndex from "../utils/nodeEntryIndex.js";
import useLocalStorage from "../utils/useLocalStorage.js";

import { langController } from "../controllers/stateControllers.js";
import { addTemporaryClassName, changeTemporaryLabel } from "../utils/attributesHandler.js";

export default function CalendarYear() {

    const FLAG = "flag";
    const DAY_CN = "this-month-day";
    const DAY_SELECTOR = ".this-month-day";

    let showedDays;
    let monthCounter = 0;

    let firstMonthIndex = 0;
    let lastMonthIndex = 0;

    let firstYear = 0;
    let lastYear = 0;

    let nowMonth = new Date().getMonth();
    let nowYear = new Date().getFullYear();

    const defaultCalendarData = {
        workDaysChain: 1,
        daysOffChain: 3,
        firstWorkDay: 17,
        firstWorkMonth: 0,
        firstWorkYear: 2024,
        needToShow: 3
    }

    let userCalendarData = useLocalStorage("userCalendarData") || defaultCalendarData;

    const calendarYear = document.createElement('div');
    calendarYear.className = "calendar-year";

    const formGroups = [
        { groupName: "schedule", legendTextKey: "schedule_type" },
        { groupName: "first-day", legendTextKey: "first_work_date" },
        { groupName: "forecast-range", legendTextKey: "need_to_show" },
    ];

    const calendarFormInputs = [
        { tag: "select", id: "select-work-day", name: "work", labelTextKey: "select_work_days", min: 1, max: 7, value: userCalendarData.workDaysChain, inGroup: 1 },
        { tag: "select", id: "select-day-off", name: "dayOff", labelTextKey: "select_days_off", min: 1, max: 7, value: userCalendarData.daysOffChain, inGroup: 1 },
        { tag: "select", id: "select-first-work-day", name: "firstWorkDay", labelTextKey: "first_work_day", min: 1, max: 31, value: userCalendarData.firstWorkDay, inGroup: 2 },
        { tag: "select", id: "select-first-work-month", name: "firstWorkMonth", labelTextKey: "first_work_month", min: 0, max: 11, value: userCalendarData.firstWorkMonth, options: getMonthListOptions(), inGroup: 2 },
        { tag: "select", id: "select-first-work-year", name: "firstWorkYear", labelTextKey: "first_work_year", min: 1988, max: nowYear + 1, value: userCalendarData.firstWorkYear, inGroup: 2 },
        { tag: "input", type: "range", id: "range-month", name: "monthRange", labelTextKey: "need_to_show", min: 1, max: 12, step: 1, value: userCalendarData.needToShow, inGroup: 3 }
    ];

    const saveButton = Button("save", "flat save");
    saveButton.setAttribute("disabled", "true");
    saveButton.classList.add("non-active");
    saveButton.addEventListener("click", (e) => {
        e.preventDefault();
        useLocalStorage("userCalendarData", userCalendarData);
        saveButton.setAttribute("disabled", "true");
        saveButton.classList.add("non-active");
        changeTemporaryLabel(saveButton.querySelector('.label'), "saved", 2000)
    });

    const calendarForm = Form(calendarFormInputs, formGroups, [saveButton]);
    calendarForm.classList.add("calendar-form");
    calendarYear.appendChild(calendarForm);

    // Inserting "/"
    const workDaySelect = calendarForm.querySelector("#select-work-day");
    if (workDaySelect) { workDaySelect.insertAdjacentText('afterend', "/") }

    const calendarActions = document.createElement('div');
    calendarActions.className = "calendar-actions sticky-top";
    calendarYear.appendChild(calendarActions);

    const todayAnchor = langController.createLabel('a', "go_today");
    todayAnchor.setAttribute('href', "#this-month_in-this-year");
    todayAnchor.classList.add('link');
    calendarActions.appendChild(todayAnchor);
    todayAnchor.addEventListener('click', () => {
        const thisMonth = document.getElementById("this-month_in-this-year").parentNode;
        addTemporaryClassName(thisMonth, "iam-here", 1500, 1000);
        calendarActions.classList.remove("sticky-top")
    });

    const calendarContainer = document.createElement('div');
    calendarContainer.className = "calendar-year__container";
    calendarYear.appendChild(calendarContainer);

    addMonthsRange(userCalendarData.firstWorkMonth, userCalendarData.firstWorkYear);
    showSchedule();

    calendarForm.addEventListener('change', () => {

        userCalendarData.workDaysChain = Number(calendarForm.elements["work"].value);
        userCalendarData.daysOffChain = Number(calendarForm.elements["dayOff"].value);
        userCalendarData.firstWorkDay = Number(calendarForm.elements["firstWorkDay"].value);

        const dMMMM = Number(calendarForm.elements["firstWorkMonth"].value) - userCalendarData.firstWorkMonth;
        userCalendarData.firstWorkMonth += dMMMM;

        const dYYYY = Number(calendarForm.elements["firstWorkYear"].value) - userCalendarData.firstWorkYear;
        userCalendarData.firstWorkYear += dYYYY;

        if (dMMMM < 0) {
            for (let i = 0; i > dMMMM; i--) { addPrevMonth() }
        } else if (dMMMM > 0) {
            for (let i = 0; i < userCalendarData.needToShow; i++) { addNextMonth() }
            for (let i = 0; i < monthCounter; i++) { removePrevMonth() }
        }

        const dYnYf = lastYear - nowYear;
        const dMnMf = (12 * dYnYf) + lastMonthIndex - nowMonth - userCalendarData.needToShow + 1;

        if (dYnYf > 0) {
            calendarContainer.innerHTML = "";
            addMonthsRange(userCalendarData.firstWorkMonth, userCalendarData.firstWorkYear);
        } else {
            if (dYYYY < 0) {
                addPrevMonthsRange(userCalendarData.firstWorkMonth, userCalendarData.firstWorkYear);
                for (let i = 0; i < dMnMf; i++) { removeLastMonth() }
            } else {//if (dYYYY > 0) {
                if (userCalendarData.firstWorkYear >= nowYear) {
                    calendarContainer.innerHTML = "";
                    addMonthsRange(userCalendarData.firstWorkMonth, userCalendarData.firstWorkYear);
                } else {
                    const d1 = userCalendarData.firstWorkYear - firstYear;
                    const d2 = (12 * d1) + firstMonthIndex - userCalendarData.firstWorkMonth;
                    for (let i = 0; i < d2; i++) { removePrevMonth() }
                }
            }
        }

        const dRange = Number(calendarForm.elements["monthRange"].value) - userCalendarData.needToShow;
        userCalendarData.needToShow += dRange;

        if (dRange > 0) {
            for (let i = 0; i < dRange; i++) { addNextMonth() }
        } else if (dRange < 0) {
            for (let i = 0; i > dRange; i--) { removeLastMonth() }
        }
        showSchedule();
        if (saveButton.classList.contains("non-active")) { saveButton.classList.remove("non-active") }
        saveButton.removeAttribute("disabled")
    }); // end of calendarForm EventListener //

    calendarContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains(DAY_CN)) { showSchedule(e.target) }
    });

    return calendarYear;

    function addMonthsRange(fromM, fromY, toM = nowMonth, toY = nowYear) {

        const dYY = toY - fromY;
        const dMM = (12 * dYY) + toM - fromM;
        monthCounter = userCalendarData.needToShow;
        if (dMM > 0) { monthCounter += dMM }

        firstMonthIndex = fromM;
        lastMonthIndex = fromM;

        firstYear = fromY;
        lastYear = fromY;

        for (let c = 0, mm = firstMonthIndex; c < monthCounter; c++, mm++) {
            if (mm > 11) { mm = 0; lastYear++ }
            lastMonthIndex = mm;
            const month = CalendarMonth(lastMonthIndex, lastYear, true);
            calendarContainer.appendChild(month);
        }
    }

    function addPrevMonthsRange(fromM, fromY) {

        const dYY = firstYear - fromY;
        const tempMonthIndex = firstMonthIndex - 1;
        const dMM = (12 * dYY) + firstMonthIndex - fromM;

        for (let c = 0, mm = tempMonthIndex; c < dMM; c++, mm--) {
            if (mm < 0) { mm = 11; firstYear-- }
            firstMonthIndex = mm;
            const month = CalendarMonth(firstMonthIndex, firstYear, true);
            calendarContainer.prepend(month);
            monthCounter++;
        }
    }

    function addNextMonth() {
        lastMonthIndex++;
        if (lastMonthIndex > 11) { lastMonthIndex = 0; lastYear++ }
        const month = CalendarMonth(lastMonthIndex, lastYear, true);
        calendarContainer.appendChild(month);
        monthCounter++;
    }

    function addPrevMonth() {
        firstMonthIndex--;
        if (firstMonthIndex < 0) { firstMonthIndex = 11; firstYear-- }
        const month = CalendarMonth(firstMonthIndex, firstYear, true);
        calendarContainer.prepend(month);
        monthCounter++;
    }

    function removePrevMonth() {
        firstMonthIndex++;
        if (firstMonthIndex > 11) { firstMonthIndex = 0; firstYear++ }
        calendarContainer.firstElementChild.remove();
        monthCounter--;
    }

    function removeLastMonth() {
        lastMonthIndex--;
        if (lastMonthIndex < 0) { lastMonthIndex = 11; lastYear-- }
        calendarContainer.lastElementChild.remove();
        monthCounter--;
    }

    function showSchedule(nodeElement) {
        showedDays = calendarContainer.querySelectorAll(DAY_SELECTOR);
        const showedDaysCount = showedDays.length;
        clearSchedule();
        if (typeof (nodeElement) === 'object') {
            userCalendarData.firstWorkDay = nodeElement.textContent;
            const monthID = nodeElement.parentNode.parentNode.parentNode.id;
            if (monthID) {
                const splittedID = monthID.split("-");
                calendarForm.elements["firstWorkMonth"].value = splittedID[1];
                calendarForm.elements["firstWorkYear"].value = splittedID[2];
            }
            calendarForm.elements["firstWorkDay"].value = nodeElement.textContent;

        }
        let dayNodeIndex = userCalendarData.firstWorkDay - 1;
        if (nodeElement) { dayNodeIndex = nodeEntryIndex(showedDays, nodeElement) }

        for (let alldays = dayNodeIndex; alldays < showedDaysCount; alldays += userCalendarData.daysOffChain) {
            for (let workday = 0; workday < userCalendarData.workDaysChain; workday++) {
                if (alldays + 1 > showedDaysCount) { console.log("end of month"); return }
                showedDays[alldays++].classList.add(FLAG);
            }
        }
    }

    function clearSchedule() {
        for (let d of showedDays) { if (d.classList.contains(FLAG)) { d.classList.remove(FLAG) } }
    }

    function getMonthListOptions() {
        const options = [];
        for (let m = 0; m < 12; m++) {
            const optLabel = new Date(2024, m).toLocaleString(langController.getPageLangPrefix(), { month: 'long' });
            options.push(optLabel)
        }
        return options
    }
}

