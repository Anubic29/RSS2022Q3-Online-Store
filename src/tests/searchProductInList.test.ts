import type { ProductCard } from '../types/types';
import { searchProductInList } from '../pages/catalog/functions';
import dataProducts from '../../assets/libs/data';

describe('catalog module - searchProductInList', () => {
    type PsevdoProdCard = { [key: string]: number | string | string[] };
    const list: ProductCard[] = [...dataProducts.filter((obj) => obj.id <= 15)];
    const fieldsForSearch = ['title', 'brand', 'category', 'description'];

    const result1: ProductCard[] = [...list].filter((obj: PsevdoProdCard) => {
        return fieldsForSearch.map((field) => `${obj[field]}`.toLowerCase().includes('app')).includes(true);
    });
    const result2: ProductCard[] = [...list].filter((obj: PsevdoProdCard) => {
        return fieldsForSearch.map((field) => `${obj[field]}`.toLowerCase().includes('smart')).includes(true);
    });

    test('search for elements in list by value "app"', () => {
        expect(searchProductInList(list, fieldsForSearch, 'app')).toStrictEqual(result1);
    });
    test('search for elements in list by value "smart"', () => {
        expect(searchProductInList(list, fieldsForSearch, 'smart')).toStrictEqual(result2);
    });
});
