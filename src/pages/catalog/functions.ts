import type { ParamsObjGenerate } from '../../types/types';
import { catalogProductCard } from './classes';

function getPercentBetweenTwoValues(min: number, max: number, value: number) {
    return Math.round(((value - min) / (max - min)) * 100);
}

function filterProductList(receivedList: catalogProductCard[], parameters: ParamsObjGenerate) {
    let result: catalogProductCard[] = [...receivedList];
    let temp: catalogProductCard[];

    Object.keys(parameters).forEach((param) => {
        switch (param) {
            case 'category':
            case 'brand':
                temp = [];
                parameters[param].forEach((value) => {
                    temp.push(...result.filter((obj) => obj.data[param] === value));
                });
                result = temp;
                break;
            case 'price':
            case 'stock':
                temp = [
                    ...result.filter(
                        (obj) => obj.data[param] >= +parameters[param][0] && obj.data[param] <= +parameters[param][1]
                    ),
                ];
                result = temp;
                break;
            default:
                break;
        }
    });

    return result;
}

function sortProductList(receivedList: catalogProductCard[], parameters: ParamsObjGenerate) {
    let result: catalogProductCard[] = [...receivedList];

    const sort = parameters['sort'];
    if (sort === undefined) return result;
    if (sort[0] === undefined) return result;

    const [sortValue, sortOrder] = sort[0].split('-');
    let isValidValue = false;

    switch (sortValue) {
        case 'price':
        case 'rating':
            result = result.sort((a, b) => a.data[sortValue] - b.data[sortValue]);
            isValidValue = true;
            break;
        case 'discount':
            result = result.sort((a, b) => a.data['discountPercentage'] - b.data['discountPercentage']);
            isValidValue = true;
            break;
        default:
            break;
    }

    if (isValidValue && sortOrder === 'DESC') {
        result = result.reverse();
    }

    return result;
}

function searchProductInList(receivedList: catalogProductCard[], fieldsForSearch: string[], value: string) {
    let result = [...receivedList];

    result = result.filter((obj) => {
        for (let i = 0; i < fieldsForSearch.length; i++) {
            if (`${obj.data[fieldsForSearch[i]]}`.toLowerCase().includes(value)) {
                return true;
            }
        }
        return false;
    });

    return result;
}

export { getPercentBetweenTwoValues, filterProductList, sortProductList, searchProductInList };
