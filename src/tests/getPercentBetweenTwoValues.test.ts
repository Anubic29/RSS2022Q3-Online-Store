// import { getPercentBetweenTwoValues } from '../pages/catalog/index';

function getPercentBetweenTwoValues(min: number, max: number, value: number) {
    return Math.round(((value - min) / (max - min)) * 100);
}

describe('catalog module', () => {
    test('percent value 320 between 175 and 465 to equal 50%', () => {
        expect(getPercentBetweenTwoValues(175, 465, 320)).toBe(50);
    });
    test('percent value 175 between 150 and 250 to equal 25%', () => {
        expect(getPercentBetweenTwoValues(150, 250, 175)).toBe(25);
    });
});
