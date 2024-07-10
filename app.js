import { themeController, langController } from "./controllers/stateControllers.js";
import Card from "./components/Card.js";
import Logo from "./components/Logo.js";
import Navigation from "./components/Navigation.js";
import Module from "./components/Module.js";
import Menu from "./components/Menu.js";
import { applications } from "./content/applications.js";
import { DICTIONARY } from "./lang/dictionary.js";
import useIntersectionObserver from "./utils/useIntersectionObserver.js";
import { navigationLinks, modeControls } from "./content/links-controls.js";
import CalendarYear from "./apps/CalendarYear.js";
import popUpTextByLetters from "./utils/popUpTextByLetters.js";
import usePointChaser from "./utils/usePointChaser.js";
import Controls from "./components/Controls.js";
import Logotype from "./content/logotype.js";
import textToIntro from "./utils/textToIntro.js";

const L = console.log;

langController.init();
themeController.init();

const STATES = {
    appsShowed: false
}

// ELEMENTS //
const body = document.body || document.documentElement;
const main = body.querySelector('#main');

if (location.hash === "#my-schedule") { Module(body, CalendarYear()) }

const controls = Controls(modeControls);
main.appendChild(controls);

const loader = body.querySelector("#zp-loader");
const loadedLogo = Logotype();
loader.append(loadedLogo);

// NAVIGATION //
const navLogoContainer = Logo();
const navigation = Navigation("main-nav", [navLogoContainer, Menu(navigationLinks)]);
body.appendChild(navigation);

navigation.addEventListener('click', () => {
    showAppsBlock();
}, { once: true });

setTimeout(() => {
    const nlcRect = navLogoContainer.getBoundingClientRect();
    loader.classList.add("loaded");
    if (nlcRect.left) { loadedLogo.classList.add("loaded"); loadedLogo.style.marginLeft = `${nlcRect.left}px` }
    if (nlcRect.top) { loadedLogo.style.marginTop = `${nlcRect.top}px` }
    setTimeout(() => { loader.remove() }, 1000);
    navLogoContainer.classList.add("after-load");
}, 3200)


const heroBlock = main.querySelector("#hero");
const heroAvatar = heroBlock.querySelector("#hero-avatar");

const heroName = document.getElementById("hero-name");
popUpTextByLetters(heroName);

// usePointChaser(heroAvatar, heroBlock, {caller: "#hero-header", cssPosition: "absolute", pointOffset: 110});

const introBlock = main.querySelector("#intro");
const introContinue = introBlock.querySelector("#intro-continue-request");
const introContinueButton = introContinue.querySelector(".continue");

const appsBlock = main.querySelector("#apps");

const feedbackBlock = main.querySelector("#feedback");
const feedbackText = feedbackBlock.querySelector(".actions-text");
const feedbackActions = feedbackBlock.querySelectorAll(".button");

// MAIN //
const heroBtn = main.querySelector("#hero-btn");
heroBtn.addEventListener("click", () => {
    introBlock.classList.remove("no-display");
    usePointChaser(introContinueButton, introContinue, { lazing: 0.1 });
}, { once: true });

const aaa = document.querySelector('#intro-content-bio');
const bbb = DICTIONARY.intro_autobio.EN;
textToIntro(aaa, bbb)

const ioParameters = { rootMargin: '0px 0px 0px 0px', threshold: 0.1 }
const intros = document.querySelectorAll('.intro-portion');
useIntersectionObserver(intros, ioParameters);

const continueState = { once: false }
introContinue.addEventListener("click", (e) => {
    if (e.target === introContinueButton) {
        continueState.once = true;
        introBlock.classList.remove("full-height");
        showAppsBlock();
    }
}, continueState);

feedbackBlock.addEventListener("click", (e) => {
    if (e.target.classList.contains("accept")) {
        e.target.textContent = "🥳";
        feedbackText.textContent = "Каеф!";
    } else if (e.target.classList.contains("reject")) {
        e.target.textContent = "😿"
        feedbackText.textContent = "Печально...";
    }
    feedbackActions.forEach(node => { if (node !== e.target) { node.remove() }})
}, { once: true });

function showAppsBlock() {
    if (!STATES.appsShowed) {
        appsBlock.classList.remove("no-display");
    
        const appCards = [];
        applications.forEach(app => {
            const appCard = Card('app', app);
            appCards.push(appCard);
            appsBlock.appendChild(appCard);
        });
        STATES.appsShowed = true;
        appCards.push(feedbackBlock);
        useIntersectionObserver(appCards, ioParameters);
        introContinue.classList.add("no-display");
    }
}

// CONTACT SECTION //
// const contGmail = document.getElementById("my-gmail");
// const contMail = document.getElementById("my-mail");
// const contVK = document.getElementById("my-vk");
// const contPhone = document.getElementById("my-phone");
// contGmail.setAttribute("href", SOURCES.gmail);
// contGmail.textContent = SOURCES.gmailStr;
// contMail.setAttribute("href", SOURCES.mailru);
// contMail.textContent = SOURCES.mailruStr;
// contVK.setAttribute("href", SOURCES.vk);
// contPhone.setAttribute("href", SOURCES.phone);
// contPhone.textContent = SOURCES.phoneStr;


//___TEST___///

// introContinueButton.click();
// Module(body, applications[3].app())
// Module(body, applications[1].app())

//___END TEST___//