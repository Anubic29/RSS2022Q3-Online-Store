import type { ParamsObjGenerate } from '../types/types';
import { convertQueryParams } from '../router/functions';

describe('router module - convertQueryParams', () => {
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

    test('convert query parameters "sort=price-ASC&category=smartphones↕laptops↕groceries&brand=Apple↕Huawei↕Samsung"', () => {
        expect(convertQueryParams(queryParams1)).toStrictEqual([resultObj1, resultOrder1]);
    });
    test('convert query parameters "stock=82↕150&category=sunglasses↕womens-jewellery↕womens-bags↕womens-watches↕mens-watches↕mens-shoes"', () => {
        expect(convertQueryParams(queryParams2)).toStrictEqual([resultObj2, resultOrder2]);
    });
});
