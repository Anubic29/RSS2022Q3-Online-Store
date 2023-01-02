import { CartProduct } from '../../types/types';
import { cartBody, cartBodyGenerator } from './index';
export let currentPage = 1;
export let paginationLimit = 5;
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

export function setPaginationListeners(num: HTMLDivElement, prev: HTMLDivElement, next: HTMLDivElement) {
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
    });
    next.addEventListener('click', () => {
        console.log(currentPage, pageCount);
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
        const length = productsArray().length;
        const value = this.value;
        paginationLimit = Number(value);
        pageCount = Math.ceil(length / paginationLimit);
        currentPage = 1;
        pagesNumber.innerText = `${currentPage} / ${pageCount}`;
        currRange = currentPage * paginationLimit;
        prevRange = (currentPage - 1) * paginationLimit;
        cartBody.innerHTML = '';
        cartBodyGenerator(cartBody, currRange, prevRange);
    });
}
