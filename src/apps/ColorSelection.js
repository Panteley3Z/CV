import Icon from "../components/Icon.js";
import Button from "../components/Button.js";
import Form from "../components/Form.js";
import Tabs from "../components/Tabs.js";
import Selector from "../components/Selector.js";

import { iconset } from "../icons/iconset.js";

import { addTemporaryClassName, setCurrentBoundedClass } from "../utils/attributesHandler.js";
import { Randoms } from "../utils/randoms.js";

export function ColorSelection() {

    const container = document.createElement('div');
    container.className = "color-selection";

    const LEVELS = {
        view: 0,
        count: 0,
        min: 0,
        max: 255,
        lightness: 0,
        color: 0
    }

    const TILES = [];
    const THUMBNAILS = [];

    const colorsGainOptions = [
        "none",
        "red",
        "orange",
        "yellow",
        "green",
        "light_blue",
        "blue",
        "violet"
    ];

    const viewTabsVariants = ["grid-view", "row-view", "column-view"];
    const viewTabs = [
        { icon: [Icon(iconset.grid), Icon(iconset.grid_gap)], dataset: ["variant", viewTabsVariants[0]] },
        { icon: [Icon(iconset.rows), Icon(iconset.rows_gap)], dataset: ["variant", viewTabsVariants[1]] },
        { icon: [Icon(iconset.columns), Icon(iconset.columns_gap)], dataset: ["variant", viewTabsVariants[2]] }
    ];

    container.appendChild(Tabs(viewTabs, LEVELS.view, changeView));

    const settingsBlock = document.createElement('div');
    settingsBlock.className = "settings-block";
    container.appendChild(settingsBlock);

    const inputs = [
        { tag: "input", type: "range", id: "select-colors-count", name: "colorsCount", labelTextKey: "colors_range", min: 1, max: 12, value: 3, inGroup: 1 },
        { tag: "select", id: "select-colors-gain", name: "colorsGain", labelTextKey: "main_color", min: 0, max: colorsGainOptions.length - 1, value: LEVELS.color, options: colorsGainOptions, inGroup: 2 },
    ];

    const groups = [
        { groupName: "select-tiles-amount", legendTextKey: "colors_range" },
        { groupName: "select-palette-parameters", legendTextKey: "colors_range" }
    ];

    const colorsForm = Form(inputs, groups);
    settingsBlock.appendChild(colorsForm);
    colorsForm.addEventListener('change', refresh);

    const brightnessOptions = [
        { icon: Icon(iconset.brightness_auto), dataset: ["selection", "0"] },
        { icon: Icon(iconset.brightness_bright), dataset: ["selection", "1"] },
        { icon: Icon(iconset.brightness_middle), dataset: ["selection", "2"] },
        { icon: Icon(iconset.brightness_dark), dataset: ["selection", "3"] }
    ];

    const brightnessSelector = Selector(brightnessOptions, LEVELS.lightness, "brightness", setColorsLightness);
    settingsBlock.appendChild(brightnessSelector);

    const colorsField = document.createElement('div');
    colorsField.className = "colors-field";
    colorsField.classList.add(viewTabsVariants[LEVELS.view]);

    const results = document.createElement("div");
    results.className = "color-selection__results";

    const actions = document.createElement("div");
    actions.className = "color-selection__actions";

    const refreshIcon = Icon(iconset.refresh);
    const refreshButton = Button("", "control", refreshIcon);
    refreshButton.addEventListener("click", changeColors);

    const iconInfoExpand = Icon(iconset.info);
    const iconInfoCollapse = Icon(iconset.expand);
    const infoButton = Button("", "control", [iconInfoExpand, iconInfoCollapse]);
    infoButton.addEventListener("click", showInfo);

    actions.append(refreshButton, infoButton);
    container.append(colorsField, results, actions);

    addTiles(3);

    return container;

    function changeView(selected) {
        setCurrentBoundedClass(colorsField, selected.dataset.variant, viewTabsVariants);
        if (selected.firstElementChild.classList.contains("no-display")) { colorsField.classList.add("with-gap") }
        else { if (colorsField.classList.contains("with-gap")) { colorsField.classList.remove("with-gap") } }
    }

    function createTile(order) {
        const tile = document.createElement("div");
        tile.className = "color-tile";
        colorsField.appendChild(tile);

        const iconUnlocked = Icon(iconset.unlocked);
        const iconLocked = Icon(iconset.locked);
        const locker = Button("", "control", [iconUnlocked, iconLocked]);
        tile.appendChild(locker);
        locker.addEventListener("click", () => { tile.classList.toggle("locked") });

        const tileInfo = document.createElement("div");
        tileInfo.className = "color-tile--info";
        tile.appendChild(tileInfo);
        for (let c = 1; c <= 3; c++) {
            const level = document.createElement('span');
            level.className = "color-tile--level";
            level.innerText = "--";
            tileInfo.appendChild(level)
        }

        const removeButton = Button("", "control", Icon(iconset.remove));
        tile.appendChild(removeButton);
        removeButton.addEventListener("click", () => removeTile(tile));

        const tileResult = document.createElement('div');
        tileResult.className = "color-result";
        const thumbnail = document.createElement('span');
        thumbnail.className = "color-thumbnail";
        const colorLevels = document.createElement('span');
        tileResult.append(thumbnail, colorLevels);
        results.appendChild(tileResult);

        TILES[order] = tile;
        THUMBNAILS[order] = thumbnail;

        setTileColor(order)
    }

    function refresh() {

        setGainedColor(colorsForm.elements["colorsGain"].value);

        const deltaCount = Number(colorsForm.elements["colorsCount"].value) - LEVELS.count;
        if (deltaCount > 0) { addTiles(deltaCount) }
        else if (deltaCount < 0) { removeTiles(deltaCount) }
    }

    function addTiles(amount) {
        for (let c = 0; c < amount; c++) {
            createTile(LEVELS.count++)
        }
    }

    function removeTiles(amount) {
        for (let c = 0; c > amount; c--) {
            if (!colorsField.lastElementChild.classList.contains("locked")) {
                colorsField.lastElementChild.remove();
                results.lastElementChild.remove();
                TILES.pop();
                LEVELS.count--
            }
        }
    }

    function removeTile(current) {
        for (let t = 0; t < TILES.length; t++) {
            if (current === TILES[t] && !TILES[t].classList.contains("locked")) {
                TILES[t].remove();
                THUMBNAILS[t].parentNode.remove();
                createTile(t);
            }
        }
    }

    function setTileColor(tileOrder) {

        const colorLevels = TILES[tileOrder].querySelectorAll(".color-tile--level");
        const tileIcons = TILES[tileOrder].querySelectorAll(".icon");

        const [r, g, b] = generateColors(LEVELS.color);

        const color = `rgb(${r}, ${g}, ${b})`;

        const iColor = invertColor(r, g, b);

        // HSL PAL
        // let color = `hsl(${h}, ${s}%, ${l}%)`;

        TILES[tileOrder].style.background = color;
        THUMBNAILS[tileOrder].style.background = color;

        tileIcons.forEach(i => i.style.fill = iColor);

        colorLevels[0].textContent = r;
        colorLevels[1].textContent = g;
        colorLevels[2].textContent = b;
        THUMBNAILS[tileOrder].nextElementSibling.textContent = color;
    }

    function changeColors() {
        let locks = 0;
        for (let t = 0; t < TILES.length; t++) {
            if (TILES[t]) {
                if (!TILES[t].classList.contains("locked")) { setTileColor(t) }
                else { locks++ }
            }
        }
        if (locks < TILES.length) { addTemporaryClassName(refreshButton, "rotate", 500) }
        else { addTemporaryClassName(refreshButton, "dont", 500) }
    }

    function showInfo() {
        addTemporaryClassName(this, "rotate", 500)
    }

    function invertColor(rl, gl, bl) {
        const sortedLevels = [rl, gl, bl].sort((a, b) => b - a);

        if (sortedLevels[0] < 160) { return `rgb(${rl + 88}, ${gl + 88}, ${bl + 88})` }
        else { return `rgb(${rl * 0.5}, ${gl * 0.5}, ${bl * 0.5})` }
    }

    function setColorsLightness(selected) {
        const selectedValue = Number(selected.dataset.selection)
        if (selectedValue > 0) {
            switch (selectedValue) {
                case 3: LEVELS.min = 0; LEVELS.max = 100; break;
                case 2: LEVELS.min = 100; LEVELS.max = 200; break;
                case 1: LEVELS.min = 200; LEVELS.max = 255; break;
            }
        } else { LEVELS.min = 0; LEVELS.max = 255 }
    }

    function setGainedColor(v) { LEVELS.color = Number(v) }

    function generateColors(gainedLevel) {

        const levels = [
            Randoms.getRange(LEVELS.min, LEVELS.max),
            Randoms.getRange(LEVELS.min, LEVELS.max),
            Randoms.getRange(LEVELS.min, LEVELS.max)
        ];

        if (gainedLevel > 0) {

            switch (Number(gainedLevel)) {
                case 1: {
                    levels[0] = Randoms.getRange(LEVELS.max - 33, LEVELS.max);
                    levels[1] = Randoms.getRange(LEVELS.min, levels[0] * 0.9);
                    levels[2] = levels[1];
                } break;
                case 2: {
                    levels[1] = Randoms.getRange(LEVELS.min, LEVELS.max * 0.65);
                    levels[0] = Math.floor(levels[1] * 1.54);
                    if (levels[0] > 255) { levels[0] = 255 }
                    levels[2] = Randoms.getRange(0, levels[1] * 0.5);
                } break;
                case 3: {
                    levels[0] = Randoms.getRange(LEVELS.min, LEVELS.max);
                    levels[1] = levels[0];
                    levels[2] = Randoms.getRange(0, levels[1] * 0.5);
                } break;
                case 4: {
                    levels[1] = Randoms.getRange(LEVELS.max - 33, LEVELS.max);
                    levels[0] = Randoms.getRange(LEVELS.min, levels[1] * 0.9);
                    levels[2] = levels[0];
                } break;
                case 5: {
                    levels[1] = Randoms.getRange(LEVELS.max - 33, LEVELS.max);
                    levels[2] = Randoms.getRange(levels[1], LEVELS.max);
                    levels[0] = Randoms.getRange(LEVELS.min, levels[1] * 0.9);
                } break;
                case 6: {
                    levels[2] = Randoms.getRange(LEVELS.max - 33, LEVELS.max);
                    levels[0] = Randoms.getRange(LEVELS.min, levels[2] * 0.9);
                    levels[1] = levels[0];
                } break;
                case 7: {
                    levels[0] = Randoms.getRange(LEVELS.max - 33, LEVELS.max);
                    levels[1] = Randoms.getRange(LEVELS.min, levels[0] * 0.9);
                    levels[2] = Randoms.getRange(levels[0], LEVELS.max);
                } break;
            }
        }
        return levels
    }
}