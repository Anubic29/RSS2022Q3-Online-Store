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

export { getPercentBetweenTwoValues, filterProductList };
