import type { ProductCard, ParamsObjGenerate } from '../../types/types';

function getPercentBetweenTwoValues(min: number, max: number, value: number) {
    return Math.round(((value - min) / (max - min)) * 100);
}

function filterProductList(receivedList: ProductCard[], parameters: ParamsObjGenerate) {
    let result: ProductCard[] = [...receivedList];
    let temp: ProductCard[];

    Object.keys(parameters).forEach((param) => {
        switch (param) {
            case 'category':
            case 'brand':
                temp = [];
                parameters[param].forEach((value) => {
                    temp.push(...result.filter((obj) => obj[param] === value));
                });
                result = temp;
                break;
            case 'price':
            case 'stock':
                temp = [
                    ...result.filter(
                        (obj) => obj[param] >= +parameters[param][0] && obj[param] <= +parameters[param][1]
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

function sortProductList(receivedList: ProductCard[], parameters: ParamsObjGenerate) {
    let result: ProductCard[] = [...receivedList];

    const sort = parameters['sort'];
    if (sort === undefined) return result;
    if (sort[0] === undefined) return result;

    const [sortValue, sortOrder] = sort[0].split('-');
    let isValidValue = false;

    switch (sortValue) {
        case 'price':
        case 'rating':
            result = result.sort((a, b) => a[sortValue] - b[sortValue]);
            isValidValue = true;
            break;
        case 'discount':
            result = result.sort((a, b) => a['discountPercentage'] - b['discountPercentage']);
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

function searchProductInList(receivedList: ProductCard[], fieldsForSearch: string[], value: string) {
    let result: { [key: string]: number | string | string[] }[] = [...receivedList];

    result = result.filter((obj) => {
        for (let i = 0; i < fieldsForSearch.length; i++) {
            if (`${obj[fieldsForSearch[i]]}`.toLowerCase().includes(value)) {
                return true;
            }
        }
        return false;
    });

    return result as ProductCard[];
}

export { getPercentBetweenTwoValues, filterProductList, sortProductList, searchProductInList };
