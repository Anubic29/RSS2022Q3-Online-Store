import type { ParamsObjGenerate } from '../types/types';
import { catalogProductCard } from '../pages/catalog/classes';
import { filterProductList } from '../pages/catalog/functions';
import dataProducts from '../../assets/libs/data';

describe('catalog module - filterProductList', () => {
    const list: catalogProductCard[] = dataProducts
        .filter((obj) => obj.id <= 15)
        .map((obj) => new catalogProductCard(obj, {}));
    const parameters1: ParamsObjGenerate = {
        category: ['laptops'],
    };
    const result1 = [...list].filter((obj) => obj.data.category === 'laptops');
    const parameters2: ParamsObjGenerate = {
        category: ['laptops'],
        brand: ['Samsung'],
    };
    const result2 = [...list].filter((obj) => obj.data.category === 'laptops' && obj.data.brand === 'Samsung');

    test('filter list by parameters (category=laptops)', () => {
        expect(filterProductList(list, parameters1)).toStrictEqual(result1);
    });
    test('filter list by parameters (category=laptops brand=Samsung)', () => {
        expect(filterProductList(list, parameters2)).toStrictEqual(result2);
    });
});
