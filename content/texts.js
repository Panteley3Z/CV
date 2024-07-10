const emojiHat = '<span class="emoj hello-hand">🎩</span>';
const linkGetStyles = '<a href="https://get-styles.ru" target="_blank" class="link">Get-Styles</a>';
const linkGranelle = '<a href="https://www.granelle.ru/" target="_blank" class="link">Granelle</a>';

const GameDescription = [
    "Простая игра, где с помощью кольца нужно за ограниченное время успеть поймать все шарики. Каждый раз кольцо имеет размер и цвет шарика, который нужно поймать. С каждым уровнем количество шариков увеличивается.",
    "A simple game where you need to catch all the balls by the ring in a limited time. Each time, the ring has the size and color of the ball to be caught. The number of balls increases with each level."
];

const GameWin = [
    "Вы поймали все шарики! 🥳",
    "You caught all the bubbles! 🥳"
];

const GameLoose = [
    "Упс! Кажется, кто-то не успел... 🤔",
    "Ooops! It seems someone didn't have time... 🤔"
];

const CalendarDescription = [
    "Отображает текущий месяц года с возможностью перехода к предыдущим или последующим месяцам.",
    "Displays the current month of the year with the ability to navigate to previous or next months."
];

const ClockDescription = [
    "Часы в виде классического электронного циферблата",
    "A clock in the form of a classic electronic dial"
];

const ruScheduleDescription = "добавить описание";
const enScheduleDescription = "добавить описание";

const ColorsDescription = [
    "Инструмент для подбора палитры цветов. Можно зафиксировать понравившийся цвет, удалить или добавить (до 12 штук) новые. В дополнительном поле отображаются выбранные цвета в формате RGB.",
    "A tool for selecting a palette of colors. You can fix the color you like, remove or add (up to 12 pieces) new ones. The additional field displays the selected colors in RGB format."
];

const ruSummaryPhrase = "Если Вас заинтересовала моя кандидатура или есть какие-либо предложения - свяжитесь со мной любым удобным для Вас способом.";
const enSummaryPhrase = "If you are interested in my CV or have any offers, please contact me in a way that suits you best.";

const ruThanksFeedback = "Спасибо за обратную связь!";
const enThanksFeedback = "Thank you for your feedback!";

const ruWillWait = "Буду ждать с нетерпением!";
const enWillWait = "I will be looking forward to it!";

const myAge = [
    '<span class="age-count">35</span> лет.',
    '<span class="age-count">35</span> years old.'
];

const Autobio = [
`##С 2008 по 2015 гг работал в ООО "ТРИОРИС".
*Создавал темы-оформления для VK на сайте ${linkGetStyles};
*вносил изменения и дополнения в темах после обновлений в VK и по запросам пользователей;
##C 2021 года работал тестировщиком ПО в компании ${linkGranelle}.
*Выполнял ручное функциональное и регрессионное тестирование веб-приложения;
*- тестирование API (Postman);
*- отслеживание и фиксирование дефектов в баг-трекинговой системе (Jira);
*Писал и обновлял тест-кейсы и чек-листы.
*Сотрудничал с командой разработчиков, дизайнеров и аналитиков для улучшения качества продукта.
*Помогал техподдержке: воспроизводил и фиксировал баги, поступающие от клиентов.`,
`##From 2008 to 2015, I worked at TRIORIS LLC.
*Created themes for VK on the site ${linkGetStyles};
*made changes and additions to the themes after updates in VK and at the requests of users;
##Since 2021, I worked as a software tester at ${linkGranelle} LLC.
*Performed manual functional and regression testing of the web application;
*- API testing (Postman);
*- tracking and fixing defects in the bug tracking system (Jira);
*Wrote and updated test-cases and checklists.
*Collaborated with a team of developers, designers and analysts to improve the quality of the product.
*Helped technical support: reproduced and fixed bugs coming from customers.`
];



export const TEXTS = {
    RU_game: GameDescription[0],
    EN_game: GameDescription[1],
    RU_gameWin: GameWin[0],
    EN_gameWin: GameWin[1],
    RU_gameLoose: GameLoose[0],
    EN_gameLoose: GameLoose[1],
    RU_calendar: CalendarDescription[0],
    EN_calendar: CalendarDescription[1],
    RU_clock: ClockDescription[0],
    EN_clock: ClockDescription[1],
    RU_ColorsDescription: ColorsDescription[0],
    EN_ColorsDescription: ColorsDescription[1],
    RU_SummaryPhrase: ruSummaryPhrase,
    EN_SummaryPhrase: enSummaryPhrase,
    RU_Schedule: ruScheduleDescription,
    EN_Schedule: enScheduleDescription,
    RU_ThanksFeedback: ruThanksFeedback,
    EN_ThanksFeedback: enThanksFeedback,
    RU_WillWait: ruWillWait + emojiHat,
    EN_WillWait: enWillWait + emojiHat,
    RU_myAge: myAge[0],
    EN_myAge: myAge[1],
    RU_Autobio: Autobio[0],
    EN_Autobio: Autobio[1]
}