import CalendarYear from "../apps/CalendarYear.js";
import BubblesGame from "../apps/BubblesGame.js";
import ScreenSaver from "../apps/ScreenSaver.js";
import { ColorSelection } from "../apps/ColorSelection.js";

import { iconset } from "../icons/iconset.js";

export const applications = [
    {
        id: "game-app",
        icon: iconset.bubble,
        title: "game",
        description: "descr_game",
        app: BubblesGame,
        canFullscreen: true
    },
    {
        id: "calendar-app",
        icon: iconset.calendar,
        title: "my_schedule",
        description: "descr_schedule",
        app: CalendarYear,
        canFullscreen: true
    },
    {
        id: "screen-saver",
        icon: iconset.watch,
        title: "clock",
        description: "descr_clock",
        app: ScreenSaver,
        canFullscreen: true
    },
    { 
        id: "color-picker-app",
        icon: iconset.palette,
        title: "color_picker",
        description: "descr_color_picker",
        app: ColorSelection,
        canFullscreen: true
    },
    {
        id: "burger-store",
        icon: iconset.burger,
        title: "burger_store",
        description: "descr_burger_store",
        target: "https://panteley3z.github.io/burgerStoreApp",
        canFullscreen: true
    }
];