import type { ProductCard, ParamsObjGenerate } from '../types/types';
import { filterProductList } from '../pages/catalog/functions';
import dataProducts from '../../assets/libs/data';

describe('catalog module - filterProductList', () => {
    const list: ProductCard[] = [...dataProducts.filter((obj) => obj.id <= 15)];
    const parameters1: ParamsObjGenerate = {
        category: ['laptops'],
    };
    const result1: ProductCard[] = [...list].filter((obj) => obj.category === 'laptops');
    const parameters2: ParamsObjGenerate = {
        category: ['laptops'],
        brand: ['Samsung'],
    };
    const result2: ProductCard[] = [...list].filter((obj) => obj.category === 'laptops' && obj.brand === 'Samsung');

    test('filter list by parameters (category=laptops)', () => {
        expect(filterProductList(list, parameters1)).toStrictEqual(result1);
    });
    test('filter list by parameters (category=laptops brand=Samsung)', () => {
        expect(filterProductList(list, parameters2)).toStrictEqual(result2);
    });
});
