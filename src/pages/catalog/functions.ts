function getPercentBetweenTwoValues(min: number, max: number, value: number) {
    return Math.round(((value - min) / (max - min)) * 100);
}

export { getPercentBetweenTwoValues };
