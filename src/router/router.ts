import generateContent404 from '../pages/404';
import generateContentCart from '../pages/cart';
import generateContentCatalog from '../pages/catalog';
import generateContentDetails from '../pages/details';
import type { ParamsObjGenerate } from '../types/types';

const route = (event: Event) => {
    event = event || window.event;
    event.preventDefault();
    let target = event.target as HTMLElement;
    while (target.tagName !== 'A') {
        target = target.parentNode as HTMLElement;
    }
    window.history.pushState({}, '', (target as HTMLLinkElement).href);
    handleLocation();
};

const routes: { [index: string]: (params?: ParamsObjGenerate, orderParams?: string[]) => HTMLElement } = {
    '404': generateContent404,
    '/': generateContentCatalog,
    '/cart': generateContentCart,
    '/details': generateContentDetails,
};

const handleLocation = async () => {
    window.scroll({ top: 0 });

    const path = window.location.pathname;
    const route = routes[path] || routes['404'];
    const mainPage = document.getElementById('main-page');
    if (mainPage instanceof Element) {
        mainPage.innerHTML = '';
        mainPage.append(route(...convertQueryParams(window.location.search.substring(1))));
    }
};

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

export { route, handleLocation };
