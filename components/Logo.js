import Icon from "./Icon.js";
import { iconset } from "../icons/iconset.js";
import Logotype from "../content/logotype.js";

export default function Logo() {

    const div = document.createElement('div');
    div.id = "logo-container";
    div.className = "logo-container";
    
    const link = document.createElement('a');
    link.className = "link";
    link.setAttribute("href", "https://github.com/Panteley3Z");
    div.appendChild(link);

    const myLogo = Logotype();

    const gitLogoSet = {
        size: 88,
        viewBox: "0 -0.5 16 16"
    }

    const gitLogo = Icon(iconset.github, "git-logo", gitLogoSet);

    link.append(myLogo, gitLogo);
    
    return div
}