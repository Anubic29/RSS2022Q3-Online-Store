import { catalogProductCard } from '../pages/catalog/classes';
import { searchProductInList } from '../pages/catalog/functions';
import dataProducts from '../../assets/libs/data';

describe('catalog module - searchProductInList', () => {
    const list: catalogProductCard[] = dataProducts
        .filter((obj) => obj.id <= 15)
        .map((obj) => new catalogProductCard(obj, {}));
    const fieldsForSearch = ['title', 'brand', 'category', 'description'];

    const result1 = [...list].filter((obj) => {
        return fieldsForSearch.map((field) => `${obj.data[field]}`.toLowerCase().includes('app')).includes(true);
    });
    const result2 = [...list].filter((obj) => {
        return fieldsForSearch.map((field) => `${obj.data[field]}`.toLowerCase().includes('smart')).includes(true);
    });

    test('search for elements in list by value "app"', () => {
        expect(searchProductInList(list, fieldsForSearch, 'app')).toStrictEqual(result1);
    });
    test('search for elements in list by value "smart"', () => {
        expect(searchProductInList(list, fieldsForSearch, 'smart')).toStrictEqual(result2);
    });
});
