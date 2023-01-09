import { isAdrValid } from '../pages/cart/functions';

describe('Must return true if adress has 3 words, not less then 5 characters each', () => {
    const tooShortWords = 'My City Is';
    const tooShortAdress = 'street Stryiska';
    const correctAdress = 'Mycity street Stryiska';

    test('must return false if adress does not match requirements', () => {
        const tooShortW = isAdrValid(tooShortWords);
        const tooShortA = isAdrValid(tooShortAdress);

        expect(tooShortW).toBe(false);
        expect(tooShortA).toBe(false);
    });

    test('must return true if adress match requirements', () => {
        const correct = isAdrValid(correctAdress);
        expect(correct).toBe(true);
    });
});
