import type { ProductCard, ParamsObjGenerate } from '../types/types';
import { sortProductList } from '../pages/catalog/functions';
import dataProducts from '../../assets/libs/data';

describe('catalog module - sortProductList', () => {
    const list: ProductCard[] = [...dataProducts.filter((obj) => obj.category === 'laptops')];
    const parameters1: ParamsObjGenerate = {
        sort: ['price-ASC'],
    };
    const result1: ProductCard[] = [...list].sort((a, b) => a.price - b.price);
    const parameters2: ParamsObjGenerate = {
        sort: ['discount-DESC'],
    };
    const result2: ProductCard[] = [...list].sort((a, b) => b.discountPercentage - a.discountPercentage);

    test('sort list by parameters (sort=price-ASC)', () => {
        expect(sortProductList(list, parameters1)).toStrictEqual(result1);
    });
    test('sort list by parameters (sort=discount-DESC)', () => {
        expect(sortProductList(list, parameters2)).toStrictEqual(result2);
    });
});
