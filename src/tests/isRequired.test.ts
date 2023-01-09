import { isRequired } from '../pages/cart/functions';

describe('must return false if input is empty and true otherwise', () => {
    const inputEmpty = '';
    const inputFilledOut = 'Vasya Pupkin';

    test('must return false if input is empty', () => {
        const empty = isRequired(inputEmpty);

        expect(empty).toBe(false);
    });

    test('must return true if input is filled', () => {
        const filled = isRequired(inputFilledOut);
        expect(filled).toBe(true);
    });
});
