import { handleLocation } from '../../router/router';
import dataProducts from '../../../assets/libs/data';
import type { CartProduct, ProductCard, ParamsObjGenerate, promoObj, soldProducts } from '../../types/types';
import '../../../assets/icons/search-plus.svg';
import '../../../assets/icons/arrow.svg';
import '../../../assets/icons/empty-cart.svg';
import promogenerator from './_promo';
import { createNewTotalSpan, addActiveCoupon } from './_promo';
import { setInputListeners } from './_modal';
import { maxValueRating, colorEmptyStar, colorFilledStar } from '../../../assets/libs/vars';

let parameters: ParamsObjGenerate;
let orderParameters: string[];

let currentPage = 1;
let paginationLimit = 5;

let currRange = setCurRange(1);
let prevRange = setPrevRange(1);
let totalSumSpanGlobal: HTMLSpanElement;
let newTotalSpanGlobal: HTMLSpanElement;
let modalG: HTMLDivElement;
let bgG: HTMLDivElement;
const body = document.querySelector('body') as HTMLBodyElement;

const cartCountHead = document.getElementById('cart-prod-count') as HTMLElement;
const totalCountHead = document.getElementById('total-numbers') as HTMLElement;
export let cartBody: HTMLOListElement;

const productsArray = (): Array<CartProduct> => JSON.parse(localStorage.getItem('cartList') as string) ?? [];
const soldArray = (): Array<soldProducts> => JSON.parse(localStorage.getItem('soldProducts') as string) ?? [];
const promosArray: promoObj[] = JSON.parse(localStorage.getItem('promo') as string)
    ? JSON.parse(localStorage.getItem('promo') as string)
    : [];
const totalSum = () => productsArray().reduce((acc: number, cur: CartProduct) => acc + cur.finalPrice * cur.count, 0);
const productsInCart = (prodAr: CartProduct[]): Array<ProductCard> => {
    const idArray = prodAr.map((obj) => obj.id);
    return dataProducts.filter((el) => {
        if (idArray.includes(el.id)) {
            return el;
        }
    });
};

let pageCount = Math.ceil(productsArray().length / paginationLimit);

function setCurRange(curPage: number, limit?: number) {
    const pageLim = limit || paginationLimit;
    return curPage * pageLim;
}

function setPrevRange(curPage: number, limit?: number) {
    const pageLim = limit || paginationLimit;
    return (curPage - 1) * pageLim;
}

function setPaginationListeners(
    num: HTMLDivElement,
    prev: HTMLDivElement,
    next: HTMLDivElement,
    params?: ParamsObjGenerate,
    orderParams?: string[]
) {
    parameters = params ? params : {};
    orderParameters = orderParams ? orderParams : [];
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
        if (!orderParameters.includes('limit')) {
            parameters['limit'] = [paginationLimit.toString() as string];
            orderParameters.push('limit');
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
        if (!orderParameters.includes('limit')) {
            parameters['limit'] = [paginationLimit.toString() as string];
            orderParameters.push('limit');
        }
        generateQueryParameters();
    });
}

function setProdsPerPageListeners(
    input: HTMLInputElement,
    pages: HTMLDivElement,
    params?: ParamsObjGenerate,
    orderParams?: string[]
) {
    parameters = params ? params : {};
    orderParameters = orderParams ? orderParams : [];
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
            parameters['page'] = [currentPage.toString() as string];
        }
        if (!orderParameters.includes('limit')) {
            orderParameters.push('limit');
        }
        generateQueryParameters();
    });
}
function checkIfPageTrue(numOfPage: number) {
    currentPage = numOfPage <= pageCount ? numOfPage : pageCount;
}

function calcPageCount(limit: number) {
    pageCount = Math.ceil(productsArray().length / limit);
}

function refreshPageInQueryParams() {
    if (orderParameters.includes('page')) {
        checkIfPageTrue(currentPage);
        parameters['page'] = [currentPage.toString() as string];
        generateQueryParameters();
    }
}

async function generateQueryParameters() {
    orderParameters.sort((a, b) => a.length - b.length);
    const res = orderParameters.map((param) => `${param}=${parameters[param]}`).join('&');
    window.history.pushState({}, '', res ? `?${res}` : '/cart');
}

refreshCartHead();
prodsInCartCount();

function prodsInCartCount() {
    const products: Array<CartProduct> = productsArray();
    const counter = products.reduce((acc: number, cur: CartProduct) => acc + cur.count, 0);
    return counter;
}

function theProdInCartCount(id: number) {
    const products: Array<CartProduct> = productsArray();
    const theProd = products.find((prod) => prod.id === id) as CartProduct;
    return theProd.count;
}

export function refreshCartHead(): void {
    const counter: number = prodsInCartCount();
    productsInCart(productsArray());
    cartCountHead.innerText = counter.toString();
    totalCountHead.innerText = `${totalSum()} ₴`;
}

function refreshSummary(): void {
    const counter: number = prodsInCartCount();
    const countProdsPlace = document.querySelector('.total-prod-count span') as HTMLSpanElement;
    const totalSumPlace = document.querySelector('.total-prod-sum span') as HTMLSpanElement;
    countProdsPlace.innerText = `${counter.toString()}`;
    totalSumPlace.innerText = `${totalSum()} ₴`;
    createNewTotalSpan(totalSumSpanGlobal, newTotalSpanGlobal);
}

function refreshCountInProdRow(id: string): void {
    const theProdFullData = dataProducts.find((prod) => prod.id === Number(id)) as ProductCard;
    const theProdFromStorage = productsArray().find((prod) => prod.id === Number(id)) as CartProduct;
    const totalSumPlace = Array.from<HTMLParagraphElement>(document.querySelectorAll('p.reduced-price')).find(
        (p) => p.dataset.id === id
    ) as HTMLParagraphElement;
    const countProdsPlace = Array.from<HTMLParagraphElement>(document.querySelectorAll('p.price')).find(
        (p) => p.dataset.id === id
    ) as HTMLParagraphElement;
    countProdsPlace.innerText = `${theProdFullData.price * theProdFromStorage.count} ₴`;
    totalSumPlace.innerText = `${
        Math.round(theProdFullData.price - (theProdFullData.discountPercentage / 100) * theProdFullData.price) *
        theProdFromStorage.count
    } ₴`;
}

function generateContentCart(params?: ParamsObjGenerate, orderParams?: string[]) {
    currentPage = 1;
    if (params && params.page) {
        currentPage = Number(params.page);
    }
    if (params && params.limit) {
        paginationLimit = Number(params.limit);
    }
    currRange = currentPage * paginationLimit;
    prevRange = (currentPage - 1) * paginationLimit;
    calcPageCount(paginationLimit);
    const mainBlock = document.createElement('div');
    mainBlock.className = 'page-cart';
    mainBlock.innerHTML = `
        <div class="modal" id="modal">
        <button class="close-btn">&times;</button>
          <form class="form">
            <div class="modal-header">
              <h2 class="modal-title">Personal details</h2>
            </div>
            <div class="input-wrap">
              <input class="form-input customer-name" id="user-name" type="text" name="customer-name" placeholder="Name & surname">
              <small></small>
            </div>
            <div class="input-wrap">
              <input class="form-input tel" id="tel" type="tel" name="tel" placeholder="Phone number">
              <small></small>
            </div>
            <div class="input-wrap">
              <input class="form-input adress" id="adress" type="text" name="adress" placeholder="Delivery adress">
              <small></small>
            </div>
            <div class="input-wrap">
              <input class="form-input email" id="email" type="email" name="email" placeholder="E-mail adress">
              <small></small>
            </div>
            <h2 class="payment-title">Payment information</h2>
            <div class="card-num-wrap">
              <input class="form-input card-no" id="card" type="number" name="card-no" placeholder="Payment card number"  maxlength="16">
              <div class="card-type"></div>
              <small></small>
            </div>
            <div class="card-details">
              <div class="input-wrap">
                <input class="form-input valid" id="date" type="text" name="valid" placeholder="MM/YY">
                <small></small>
              </div>
              <div class="input-wrap">
                <input class="form-input cvv" id="cvv" type="number" name="cvv" placeholder="CVV" maxlength="3">
                <small></small>
              </div>
            </div>
            <button type="submit" class="order-btn">Confirm order</button>
            </form>
        </div>
        <div class="overlay" id="overlay"></div>
        <div class="main-inner card-page">
      <nav class="cart-nav-line">
        <div class="header-h2-wrap">
          <h2 class="cart-header">Cart</h2>
          <img src="../assets/icons/cart.svg" alt="cart-icon" class="cart-header-icon">
        </div>
        <div class="items-count counter">
          <span class="items-count-span">items</span>
          <div class="pagination-container">
            <div class="pagination-number pagination-number-p">
                <input  id="prods-p-p-inp" class="pagination-number-input" type="number" value="${paginationLimit}">
            </div>
          </div>
        </div>
        <div class="pages-count counter">
          <span class="items-count-span">page</span>
          <div class="pagination-container">
            <div class="pag-array pag-left pagination-button" id ="page-prev-button">
              <img src="../assets/icons/arrow.svg">
            </div>
            <div class="pagination-number" id="page-pagination-number">${currentPage} / ${pageCount}</div>
            <div class="pag-array pag-right pagination-button" id ="page-next-button">
              <img src="../assets/icons/arrow.svg">
            </div>
          </div>
        </div>
      </nav>
      <div class="cart-body">
        <div class="cart-body-wrap">
          <ol id="paginated-list" class="all-items-holder">
          </ol>
          <div class="coupon-block">
            <form class="coupon-form">
              <label class="coupon-q">Got a coupon?</label>
              <input type="text" placeholder="Enter promocode" class="coupon-input">
              <button class="coupon-submit" disabled>Enter code</button>
              <span class="coupon-status">Promo for test: 'RS', 'EPM'</span>
              <div class="active-coupons"></div>
            </form>
          </div>
          <section class="summary-block">
            <h2 class="summary-title">Summary</h2>
              <p class="total-prod-count">Products count:
                <span class="total-span total-count-num">${prodsInCartCount()}</span>
              </p>
            <p class="total-prod-sum">Total:
              <span class="total-span total-sum-num">${totalSum()} ₴</span>
              <span class="new-total"> </span>
            </p>
            <button class="cart-order-btn">Place order</button>
          </section>
        </div>
      </div>
    </div>
    `;

    const paginationNumber = mainBlock.querySelector('#page-pagination-number') as HTMLDivElement;
    const nextButton = mainBlock.querySelector('#page-next-button') as HTMLDivElement;
    const prevButton = mainBlock.querySelector('#page-prev-button') as HTMLDivElement;
    const prodsPerPage = mainBlock.querySelector('#prods-p-p-inp') as HTMLInputElement;
    const promoInput = mainBlock.querySelector('.coupon-input') as HTMLInputElement;
    const promoBtn = mainBlock.querySelector('.coupon-submit') as HTMLButtonElement;
    const totalSumSpan = mainBlock.querySelector('.total-sum-num') as HTMLSpanElement;
    const newTotalSpan = mainBlock.querySelector('.new-total') as HTMLSpanElement;
    const couponDiv = mainBlock.querySelector('.active-coupons') as HTMLDivElement;
    const checkoutBtn = mainBlock.querySelector('.cart-order-btn') as HTMLButtonElement;
    const modal = mainBlock.querySelector('.modal') as HTMLDivElement;
    const bg = mainBlock.querySelector('.overlay') as HTMLDivElement;

    totalSumSpanGlobal = totalSumSpan;
    newTotalSpanGlobal = newTotalSpan;
    modalG = modal;
    bgG = bg;

    setPaginationListeners(paginationNumber, prevButton, nextButton, params, orderParams);
    setProdsPerPageListeners(prodsPerPage, paginationNumber);
    promogenerator(promoInput, promoBtn, totalSumSpan, newTotalSpan, couponDiv);
    cartBody = mainBlock.querySelector('.all-items-holder') as HTMLOListElement;
    cartBodyGenerator(cartBody, currRange, prevRange);
    if (promosArray.length > 0) {
        createNewTotalSpan(totalSumSpan, newTotalSpan);
        addActiveCoupon(couponDiv);
    }
    setInputListeners(checkoutBtn, modal, bg, cartBody);
    if (sessionStorage.getItem('buy') === 'true') {
        modalG.classList.add('active');
        bgG.classList.add('active');
        body.classList.add('modal-active');
        sessionStorage.clear();
    }
    return mainBlock;
}

function cartBodyGenerator(cartBody: HTMLOListElement, cur: number, prev: number) {
    if (cartBody instanceof Element) {
        const products = productsInCart(productsArray());
        pageCount = Math.ceil(productsArray().length / paginationLimit);
        if (products.length > 0) {
            products.map((obj: ProductCard) => cartBody.appendChild(itemsGenerator(obj, cur, prev)));
        }
        if (products.length === 0) {
            const emptyCartDiv = document.createElement('div') as HTMLDivElement;
            emptyCartDiv.className = 'empty-cart-div';
            const emptyCartImg = document.createElement('img') as HTMLImageElement;
            emptyCartImg.setAttribute('src', '../../../assets/icons/empty-cart.svg');
            emptyCartDiv.append(emptyCartImg);
            cartBody.append(emptyCartDiv);
        }
        const minusProdsOnPage = Array.from(cartBody.querySelectorAll('.prod-count') as NodeListOf<HTMLDivElement>);
        const countInputs = Array.from(cartBody.querySelectorAll('.user-set-count') as NodeListOf<HTMLInputElement>);
        setMinusListeners(minusProdsOnPage);
        setInputsListenes(countInputs);
    }

    return cartBody;
}

const itemsGenerator = (obj: ProductCard, cur: number, prev: number) => {
    const item = document.createElement('li') as HTMLLIElement;
    let itemNo = 0;
    const ar = productsArray().sort((a, b) => a.id - b.id);
    const itemInCart = ar.filter((item: CartProduct) => {
        itemNo = ar.findIndex((item) => item.id === obj.id) as number;
        if (item.id === obj.id) {
            const selected = item;
            return selected;
        }
    })[0];
    let leftInStock = obj.stock;
    soldArray().find((item) => {
        if (item.id === itemInCart.id) {
            leftInStock = obj.stock - item.sold;
        }
    });
    item.className = 'one-item-block';
    if (itemNo >= prev && itemNo < cur) {
        item.innerHTML = `
                <span class='list-market'>${(itemNo + 1).toString()}</span>
                <div class="item-card">
                  <div class="prod-card-inner">
                    <div class="image-block">
                      <div class="discount">-${obj.discountPercentage} %</div>
                      <div class="prod-img-wrap">
                        <div class="prod-img" style="background-image: url(${obj.thumbnail})">
                          <img src="/assets/icons/search-plus.svg" alt="more info icon" class="img-more-info-icon">
                        </div>
                      </div>
                    </div>
                    <div class="text-block">
                    <p class="category">${obj.category}</p>
                    <p class="title">${obj.title}</p>
                    <p class="brand">${obj.brand}</p>
                      <div class="rating-line">
                        <div class="rating-stars">
                          <div class="stars-wrap">
                          <div class="rate-stars"></div>
                          </div>
                          <p class="rating-nums">${obj.rating}</p>
                        </div>
                        </div>
                        <p class="desctiption">${obj.description}</p>
                    </div>
                  </div>
                  <hr>
                </div>
                <div class="item-count">
                  <div class="prod-count-control" data-id=${obj.id}>
                    <div id="minus" class="prod-count" data-type="minus" data-id=${obj.id}>—</div>
                    <div class="prod-count-number">
                      <input class="user-set-count" data-id="${
                          obj.id
                      }" type="number" min="0" max="${leftInStock}" value="${itemInCart.count}">
                    </div>
                    <div id="plus" class="prod-count" data-type="plus" data-id=${obj.id}>+</div>
                    <div class="stock">${leftInStock} in stock</div>
                  </div>
                </div>
                <div class="item-sum-col">
                  <div class="price-wrap">
                    <p class="price" data-id=${obj.id}>${obj.price * theProdInCartCount(obj.id)}  ₴</p>
                    <p class="reduced-price" data-id=${obj.id}>${
            Math.round(obj.price - (obj.discountPercentage / 100) * obj.price) * theProdInCartCount(obj.id)
        } ₴</p>
                    </div>
                    <div class="continue-btn">
                      <a href="/" class="continue-btn-text">Continue shopping</a>
                    </div>
                </div>
                `;
        const rateStars = item.querySelector('.rate-stars') as HTMLDivElement;
        const ratePercent = (+obj.rating.toFixed(1) / maxValueRating) * 100;
        rateStars.style.background = `linear-gradient(to right, ${colorFilledStar} 0%, ${colorFilledStar} ${ratePercent}%, ${colorEmptyStar} ${ratePercent}%)`;
    } else {
        item.innerHTML = '';
    }
    const prodImg = item.querySelector('.prod-img');
    if (prodImg instanceof Element) {
        prodImg.addEventListener('click', () => {
            window.history.pushState({}, '', `/details/${obj.id}`);
            handleLocation();
        });
    }
    return item;
};

function setMinusListeners(itemAr: Array<HTMLDivElement>) {
    itemAr.forEach((item) => {
        if (item) {
            item.addEventListener('click', (e) => {
                if (e.target instanceof HTMLDivElement && e.target.dataset.id) {
                    resetProdsCount(e.target.dataset.id, e.target.dataset.type as string);
                }
            });
        }
    });
}

function getCountInput(id: string): HTMLInputElement {
    const items = document.querySelectorAll('.user-set-count') as NodeListOf<HTMLInputElement>;
    const theItem = Array.from(items).find((item: HTMLInputElement) => item.dataset.id === id) as HTMLInputElement;
    return theItem;
}

function setInputsListenes(inputs: HTMLInputElement[]) {
    inputs.forEach((input) => {
        if (input) {
            input.addEventListener('input', function (): void {
                const productsFromStorage = productsArray();
                const id = this.dataset.id as string;
                let value = this.value as string;
                const input = getCountInput(id);
                if (value == '') {
                    return;
                }
                if (Number(value) <= 0) {
                    deleteTheItem(productsFromStorage, id);
                }
                if (Number(value) > Number(input.max)) {
                    value = input.max;
                }
                refresCoundInput(input, value);
                productsFromStorage.map((prod: CartProduct) => {
                    if (prod.id === Number(id)) {
                        prod.count = Number(value);
                    }
                });
                localStorage.setItem('cartList', JSON.stringify(productsFromStorage));
                refreshCartHead();
                refreshSummary();
                refreshCountInProdRow(id);
            });
        }
    });
}

function resetProdsCount(id: string, type: string) {
    const productsFromStorage = productsArray();
    const theItem = getCountInput(id) as HTMLInputElement;
    const theProd = productsFromStorage.find((prod) => prod.id === Number(id)) as CartProduct;
    if (type === 'plus') {
        if (theItem && theProd.count >= Number(theItem.max)) {
            alert('You can not set value greater then it is available in stock');
            return;
        }
        theProd.count += 1;
    }
    if (type === 'minus') {
        if (theProd.count === 1) {
            const ifDelete = confirm(`Are you sure you want to delete this product from the cart?`);
            if (ifDelete) {
                deleteTheItem(productsFromStorage, id);
            } else {
                return;
            }
        }
        theProd.count -= 1;
    }
    refresCoundInput(theItem, theProd.count.toString());
    localStorage.setItem('cartList', JSON.stringify(productsFromStorage));
    refreshCartHead();
    refreshSummary();
    refreshCountInProdRow(id);
}

function deleteTheItem(list: CartProduct[], id: string) {
    const ind = list.map((object) => object.id).indexOf(Number(id));
    const pageNumDiv = document.querySelector('#page-pagination-number') as HTMLDivElement;
    list.splice(ind, 1);
    localStorage.setItem('cartList', JSON.stringify(list));
    const cartBody = document.querySelector('.all-items-holder') as HTMLOListElement;
    cartBody.innerHTML = '';
    calcPageCount(paginationLimit);
    checkIfPageTrue(currentPage);
    refreshPageInQueryParams();
    pageNumDiv.innerHTML = `${currentPage} / ${pageCount}`;
    cartBodyGenerator(cartBody, setCurRange(currentPage), setPrevRange(currentPage));
    return;
}

function refresCoundInput(item: HTMLInputElement, count: string) {
    const theItem: HTMLInputElement = item;
    theItem.setAttribute('value', count);
    theItem.value = count;
}

export { generateContentCart };
