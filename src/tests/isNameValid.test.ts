import { isNameValid } from '../pages/cart/functions';

describe('must return true if input has two words minimum 3 charecters lonh each and false othewise', () => {
    const shortName = 'Va Pu';
    const carrectName = 'Vasya Pupkin';
    const nameWithNumbers = 'Vas1a P0pk1n';

    test("must return false if name doesn't match requirements", () => {
        const tooShort = isNameValid(shortName);
        const hasNumbers = isNameValid(nameWithNumbers);

        expect(tooShort).toBe(false);
        expect(hasNumbers).toBe(false);
    });

    test('must return true if input has 2 words. 3 or more characters long each', () => {
        const correct = isNameValid(carrectName);

        expect(correct).toBe(true);
    });
});
