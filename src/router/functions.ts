import type { ParamsObjGenerate } from '../types/types';

function convertQueryParams(strParams: string): [ParamsObjGenerate, string[]] {
    const paramsObj: ParamsObjGenerate = {};
    const orderParams: string[] = [];
    if (strParams !== '') {
        decodeURI(strParams)
            .split('&')
            .forEach((row) => {
                if (row.includes('=') && row.length > 3 && row.indexOf('=', row.indexOf('=') + 1) === -1) {
                    const [name, value] = row.split('=');
                    if (value.includes('↕')) {
                        paramsObj[name] = value.split('↕');
                    } else {
                        paramsObj[name] = [value];
                    }
                    orderParams.push(name);
                }
            });
    }
    return [paramsObj, orderParams];
}

function generateQueryParameters(orderParameters: string[], parameters: ParamsObjGenerate) {
    const res = orderParameters.map((param) => `${param}=${parameters[param].join('↕')}`).join('&');
    return res;
}

export { convertQueryParams, generateQueryParameters };
