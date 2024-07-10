function range(min, max) {
    if (min > max) { return Math.round(Math.random() * (min - max) + max) }
    else { return Math.round(Math.random() * (max - min) + min) }
}

export const Randoms = {
    getRange: range,
    getRGB: () => `${range(0, 255)},${range(0, 255)},${range(0, 255)}`
}