import type { ParamsObjGenerate } from '../types/types';
import { generateQueryParameters } from '../router/functions';

describe('router module - generateQueryParameters', () => {
    const queryParams1 = 'sort=price-ASC&category=smartphones↕laptops↕groceries&brand=Apple↕Huawei↕Samsung';
    const queryParams2 =
        'stock=82↕150&category=sunglasses↕womens-jewellery↕womens-bags↕womens-watches↕mens-watches↕mens-shoes';

    const resultObj1: ParamsObjGenerate = {
        sort: ['price-ASC'],
        category: ['smartphones', 'laptops', 'groceries'],
        brand: ['Apple', 'Huawei', 'Samsung'],
    };
    const resultOrder1: string[] = ['sort', 'category', 'brand'];

    const resultObj2: ParamsObjGenerate = {
        stock: ['82', '150'],
        category: ['sunglasses', 'womens-jewellery', 'womens-bags', 'womens-watches', 'mens-watches', 'mens-shoes'],
    };
    const resultOrder2: string[] = ['stock', 'category'];

    test('generate query parameters "sort=price-ASC&category=smartphones↕laptops↕groceries&brand=Apple↕Huawei↕Samsung"', () => {
        expect(generateQueryParameters(resultOrder1, resultObj1)).toStrictEqual(queryParams1);
    });
    test('generate query parameters "stock=82↕150&category=sunglasses↕womens-jewellery↕womens-bags↕womens-watches↕mens-watches↕mens-shoes"', () => {
        expect(generateQueryParameters(resultOrder2, resultObj2)).toStrictEqual(queryParams2);
    });
});
