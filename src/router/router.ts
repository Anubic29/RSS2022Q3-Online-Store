import { generateContent404 } from '../pages/404';
import { generateContentCart } from '../pages/cart';
import { generateContentCatalog } from '../pages/catalog';
import { generateContentDetails } from '../pages/details';
import type { ParamsObjGenerate } from '../types/types';

import { convertQueryParams, generateQueryParameters } from './functions';

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
    '/details/': generateContentDetails,
};

const handleLocation = async () => {
    window.scroll({ top: 0 });

    const path = window.location.pathname;
    let route = routes[path] || routes['404'];
    if (path.match(/^\/details\//) && path.indexOf('/', 1) === path.lastIndexOf('/')) {
        route = routes['/details/'];
    }
    const mainPage = document.getElementById('main-page');
    if (mainPage instanceof Element) {
        mainPage.innerHTML = '';
        mainPage.append(route(...convertQueryParams(window.location.search.substring(1))));
    }
};

export { route, handleLocation, convertQueryParams, generateQueryParameters };
