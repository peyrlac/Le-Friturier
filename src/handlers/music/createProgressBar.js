function createProgressBar(total, current, size = 10, line = '▬', slider = '🔘') {
    const safeSize = Number.isInteger(size) && size >= 2 ? size : 10;

    if (!Number.isFinite(total) || total <= 0 || !Number.isFinite(current)) {
        return slider + line.repeat(safeSize - 1);
    }

    const ratio = Math.min(1, Math.max(0, current / total));
    const sliderPosition = Math.round(ratio * (safeSize - 1));

    return line.repeat(sliderPosition)
        + slider
        + line.repeat(safeSize - sliderPosition - 1);
}

module.exports = createProgressBar;
