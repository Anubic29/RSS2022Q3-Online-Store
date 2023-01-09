import { isTelValid } from '../pages/cart/functions';

describe('must return true if number has + at the beginning and is not less then 9 digits long', () => {
    const tooShortNum = '+3801111';
    const noPlusSigh = '38068611111111';
    const correctNum = '+38068111111111';

    test('must return false if phone number does not match requirements', () => {
        const tooShirt = isTelValid(tooShortNum);
        const noPlus = isTelValid(noPlusSigh);

        expect(tooShirt).toBe(false);
        expect(noPlus).toBe(false);
    });

    test('must return true if phone number is correct', () => {
        const correct = isTelValid(correctNum);

        expect(correct).toBe(true);
    });
});
