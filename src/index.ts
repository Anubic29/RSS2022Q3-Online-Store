import './index.html';
import './index.scss';
import { route, handleLocation, convertQueryParams, generateQueryParameters } from './router/router';
import {} from './types/index';

window.onpopstate = handleLocation;
window.route = route;

handleLocation();

const searchBarInput = document.querySelector('#product-search') as HTMLInputElement;
const searchBarBtn = document.querySelector('.search-btn') as HTMLButtonElement;

if (searchBarInput instanceof Element) {
    searchBarInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            startSearch(searchBarInput.value);
        }
    });
}

if (searchBarBtn instanceof Element) {
    searchBarBtn.addEventListener('click', () => {
        startSearch(searchBarInput.value);
    });
}

function startSearch(searchStr: string) {
    if (searchStr) {
        const path = window.location.pathname;
        const [paramValues, paramOrder] = convertQueryParams(window.location.search.substring(1));
        if (path === '/') {
            if (!paramOrder.includes('search')) {
                paramOrder.push('search');
            }
            paramValues['search'] = [searchStr];
            const queryParam = generateQueryParameters(paramOrder, paramValues);
            window.history.pushState({}, '', `/?${queryParam}`);
        } else {
            window.history.pushState({}, '', `/?search=${searchStr}`);
        }
        handleLocation();
    }
}
