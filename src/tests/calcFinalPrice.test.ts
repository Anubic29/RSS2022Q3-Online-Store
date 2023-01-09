import type { promoObj } from '../types/types';
import { calcFinalPrice } from '../pages/cart/functions';

test('must add actuve discounts taken from the array of discounts and return correct final price', () => {
    const promosArray: promoObj[] = [
        { id: 'RS', name: 'Rolling Scopes School', disc: 10 },
        { id: 'EPM', name: 'EPAM Systems', disc: 10 },
    ];
    const emptyArray: promoObj[] = [];
    const price = 101;
    const result1 = calcFinalPrice(promosArray, price);
    const result2 = calcFinalPrice(emptyArray, price);

    expect(result1).toBe(81);
    expect(result2).toBe(101);
});
