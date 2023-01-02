import { CartProduct, ParamsObjGenerate } from '../../types/types';
import { cartBody, cartBodyGenerator } from './index';
export let currentPage = 1;
let userLimit: number | undefined;
export let paginationLimit = userLimit || 5;
const productsArray = (): Array<CartProduct> => JSON.parse(localStorage.getItem('cartList') as string) ?? [];

export let pageCount = Math.ceil(productsArray().length / paginationLimit);

export function setCurRange(curPage: number) {
    return curPage * paginationLimit;
}
export function setPrevRange(curPage: number) {
    return (curPage - 1) * paginationLimit;
}

let prevRange: number;
let currRange: number;

let parameters: ParamsObjGenerate;
let orderParameters: string[];

export function setPaginationListeners(num: HTMLDivElement, prev: HTMLDivElement, next: HTMLDivElement) {
    parameters = {};
    orderParameters = [];
    prev.addEventListener('click', () => {
        if (currentPage === 1) {
            return;
        } else {
            cartBody.innerHTML = '';
            currentPage -= 1;
            currRange = currentPage * paginationLimit;
            prevRange = (currentPage - 1) * paginationLimit;
            cartBodyGenerator(cartBody, currRange, prevRange);
        }
        num.innerText = `${currentPage.toString()} / ${pageCount.toString()}`;
        parameters['page'] = [currentPage.toString()];
        if (!orderParameters.includes('page')) {
            orderParameters.push('page');
        }
        generateQueryParameters();
    });
    next.addEventListener('click', () => {
        if (currentPage === pageCount) {
            return;
        } else {
            cartBody.innerHTML = '';
            currentPage += 1;
            currRange = currentPage * paginationLimit;
            prevRange = (currentPage - 1) * paginationLimit;
            cartBodyGenerator(cartBody, currRange, prevRange);
            num.innerText = `${currentPage.toString()} / ${pageCount.toString()}`;
        }
        parameters['page'] = [currentPage.toString()];
        if (!orderParameters.includes('page')) {
            orderParameters.push('page');
        }
        generateQueryParameters();
    });
}

export function setProdsPerPageListeners(input: HTMLInputElement, pages: HTMLDivElement) {
    const inputNumber = input;
    const pagesNumber = pages;
    inputNumber.addEventListener('change', function () {
        if (Number(this.value) < 1) {
            this.value = '1';
            return;
        }
        const value = this.value;
        paginationLimit = Number(value);
        pageCount = Math.ceil(productsArray().length / paginationLimit);
        if (parameters['page']) {
            console.log(parameters['page']);
            checkIfPageTrue(Number(parameters['page']));
        } else {
            currentPage = 1;
        }
        pagesNumber.innerText = `${currentPage} / ${pageCount}`;
        currRange = currentPage * paginationLimit;
        prevRange = (currentPage - 1) * paginationLimit;
        cartBody.innerHTML = '';
        cartBodyGenerator(cartBody, currRange, prevRange);
        if (this.value) {
            parameters['limit'] = [this.value];
            parameters['page'] = currentPage.toString();
        }
        if (!orderParameters.includes('limit')) {
            orderParameters.push('limit');
        }
        generateQueryParameters();
    });
}
export function checkIfPageTrue(numOfPage: number) {
    currentPage = numOfPage <= pageCount ? numOfPage : pageCount;
}

export function calcPageCount() {
    pageCount = Math.ceil(productsArray().length / paginationLimit);
}

export function refreshPageInQueryParams() {
    if (orderParameters.includes('page')) {
        parameters['page'] = currentPage.toString();
        generateQueryParameters();
    }
}

async function generateQueryParameters() {
    orderParameters.sort((a, b) => a.length - b.length);
    const res = orderParameters.map((param) => `${param}=${parameters[param]}`).join('&');
    window.history.pushState({}, '', res ? `?${res}` : '/cart');
}
