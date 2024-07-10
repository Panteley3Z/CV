export default function convertRGBToHSL(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;

    const values = {
        h: 0,
        s: 0,
        l: 0
    }

    if (delta === 0) { values.h = 0 }
    else if (cmax === r) { values.h = ((g - b) / delta) % 6 }
    else if (cmax === g) { values.h = (b - r) / delta + 2 }
    else { values.h = (r - g) / delta + 4 }

    values.h = Math.round(values.h * 60);
    if (values.h < 0) { values.h += 360 }

    values.l = (cmax + cmin) / 2;

    values.s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * values.l - 1));
    values.s = (values.s * 100).toFixed(1);

    values.l = (values.l * 100).toFixed(1);

    return values;
}