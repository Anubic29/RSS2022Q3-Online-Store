import type { ParamsObjGenerate } from '../types/types';
import { catalogProductCard } from '../pages/catalog/classes';
import { sortProductList } from '../pages/catalog/functions';
import dataProducts from '../../assets/libs/data';

describe('catalog module - sortProductList', () => {
    const list: catalogProductCard[] = dataProducts
        .filter((obj) => obj.category === 'laptops')
        .map((obj) => new catalogProductCard(obj, {}));
    const parameters1: ParamsObjGenerate = {
        sort: ['price-ASC'],
    };
    const result1 = [...list].sort((a, b) => a.data.price - b.data.price);
    const parameters2: ParamsObjGenerate = {
        sort: ['discount-DESC'],
    };
    const result2 = [...list].sort((a, b) => b.data.discountPercentage - a.data.discountPercentage);

    test('sort list by parameters (sort=price-ASC)', () => {
        expect(sortProductList(list, parameters1)).toStrictEqual(result1);
    });
    test('sort list by parameters (sort=discount-DESC)', () => {
        expect(sortProductList(list, parameters2)).toStrictEqual(result2);
    });
});
