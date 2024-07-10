import { themeController, langController } from "../controllers/stateControllers.js";
import { iconset } from "../icons/iconset.js";
import Icon from "../components/Icon.js";

export const navigationLinks = [
    { id: "nav-main", icon: iconset.home, textLabel: "main_page", href: "#hero" },
    { id: "nav-apps", icon: iconset.apps, textLabel: "apps", href: "#apps" },
    { id: "nav-contacts", icon: iconset.contacts, textLabel: "contacts", href: "#contacts" }
];

export const modeControls = [
    { id: "theme-controller", controller: themeController, icon: [Icon(iconset.light_mode), Icon(iconset.dark_mode)] },
    { id: "lang-controller", controller: langController, icon: Icon(iconset.lang), textLabel: "language" }
]