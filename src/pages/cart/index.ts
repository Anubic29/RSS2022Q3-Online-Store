// import { route } from '../../router/router';
import {
    setPaginationListeners,
    setProdsPerPageListeners,
    checkIfPageTrue,
    calcPageCount,
    refreshPageInQueryParams,
} from './_pagination';
import { setCurRange, setPrevRange, paginationLimit, currentPage, pageCount } from './_pagination';
import dataProducts from '../../../assets/libs/data';
import type { CartProduct, ProductCard, ParamsObjGenerate } from '../../types/types';
import '../../../assets/icons/search-plus.svg';
import '../../../assets/icons/arrow.svg';
import '../../../assets/icons/empty-cart.svg';
// import { route } from '../../router/router';

const currRange = setCurRange(1);
const prevRange = setPrevRange(1);
const cartCountHead = document.getElementById('cart-prod-count') as HTMLElement;
const totalCountHead = document.getElementById('total-numbers') as HTMLElement;
export let cartBody: HTMLOListElement;
const productsArray = (): Array<CartProduct> => JSON.parse(localStorage.getItem('cartList') as string) ?? [];
const totalSum = () => productsArray().reduce((acc: number, cur: CartProduct) => acc + cur.finalPrice * cur.count, 0);
const productsInCart = (prodAr: CartProduct[]): Array<ProductCard> => {
    const idArray = prodAr.map((obj) => obj.id);
    return dataProducts.filter((el) => {
        if (idArray.includes(el.id)) {
            return el;
        }
    });
};

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
    console.log(params);
    console.log(orderParams);
    const mainBlock = document.createElement('div');
    mainBlock.className = 'page-cart';
    mainBlock.innerHTML = `
        <div class="main-inner card-page">
      <nav class="cart-nav-line">
        <div class="header-h2-wrap">
          <h2 class="cart-header">Cart</h2>
          <img src="../assets/icons/cart.svg" alt="cart-icon" class="cart-header-icon">
        </div>
        <div class="items-count counter">
          <span class="items-count-span">items</span>
          <div class="pagination-container">
            <div class="pag-array pag-left pagination-button" id="subtr-prods-p-p">
              <img src="../assets/icons/arrow.svg">
            </div>
            <div class="pagination-number">
                <input  id="prods-p-p-inp" class="pagination-number-input" type="number" value="${paginationLimit}">
            </div>
            <div class="pag-array pag-right pagination-button" id="add-prods-p-p">
              <img src="../assets/icons/arrow.svg">
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
            <div></div>
            <form action="#" class="coupon-form">
              <label class="coupon-q">Got a coupon?</label>
              <input type="text" placeholder="Enter promocode" class="coupon-input">
              <button type="submit" class="coupon-submit">Enter code</button>
              <span class="coupon-status">Status unknown.</span>
            </form>
          </div>
          <section class="summary-block">
            <h2 class="summary-title">Summary</h2>
            <p class="total-prod-count">Products count:<span class="total-span total-count-num">${prodsInCartCount()}
                </span></p>
            <p class="total-prod-sum">Total:<span class="total-span total-sum-num">${totalSum()} ₴</span></p>
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
    setPaginationListeners(paginationNumber, prevButton, nextButton);
    setProdsPerPageListeners(prodsPerPage, paginationNumber);
    cartBody = mainBlock.querySelector('.all-items-holder') as HTMLOListElement;
    cartBodyGenerator(cartBody, currRange, prevRange);
    return mainBlock;
}

export function cartBodyGenerator(cartBody: HTMLOListElement, cur: number, prev: number) {
    if (cartBody instanceof Element) {
        const products = productsInCart(productsArray());
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
                            <img src="../assets/icons/rate-star.svg" alt="" class="rate-star r1">
                            <img src="../assets/icons/rate-star.svg" alt="" class="rate-star r2">
                            <img src="../assets/icons/rate-star.svg" alt="" class="rate-star r3">
                            <img src="../assets/icons/rate-star.svg" alt="" class="rate-star r4">
                            <img src="../assets/icons/rate-star.svg" alt="" class="rate-star r5">
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
                      <input class="user-set-count" data-id="${obj.id}" type="number" min="0" max="${
            obj.stock
        }" value="${itemInCart.count}">
                    </div>
                    <div id="plus" class="prod-count" data-type="plus" data-id=${obj.id}>+</div>
                    <div class="stock">${obj.stock} in stock</div>
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
    } else {
        item.innerHTML = '';
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
            input.addEventListener('change', function (): void {
                const productsFromStorage = productsArray();
                const id = this.dataset.id as string;
                let value = this.value as string;
                console.log(id, value);
                const input = getCountInput(id);
                console.log(input);
                if (Number(value) <= 0) {
                    const ifDelete = confirm(`Are you sure you want to delete this product from the cart?`);
                    if (ifDelete) {
                        deleteTheItem(productsFromStorage, id);
                    } else {
                        return;
                    }
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
    calcPageCount();
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

export default generateContentCart;
