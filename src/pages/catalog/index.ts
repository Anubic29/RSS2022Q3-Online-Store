import { route, handleLocation } from '../../router/router';
import dataProducts from '../../../assets/libs/data';
import type { ProductCard, ParamsObjGenerate } from '../../types/types';

import '../../../assets/icons/rate-star.svg';
import '../../../assets/icons/search-plus.svg';
import '../../../assets/icons/4-dots.svg';
import '../../../assets/icons/5-dots-g.svg';

let mainBlockG: HTMLDivElement;
let parameters: ParamsObjGenerate;
let orderParameters: string[];

function generateContentCatalog(params?: ParamsObjGenerate, orderParams?: string[]) {
    parameters = params ? params : {};
    orderParameters = orderParams ? orderParams : [];
    console.log(route);
    const mainBlock = document.createElement('div');
    mainBlock.className = 'page-catalog';

    mainBlock.innerHTML = `
    <div class="main-inner">
        <div class="head-line">
        <div class="reset-copy-wrap">
            <div class="reset-filter">
            <div class="reset-checkbox filter-checkbox">
                <span class="cross-line"></span>
                <span class="cross-line"></span>
            </div>
            <span class="reset-span">reset</span>
            </div>
            <div class="copy-link">
            <div class="copy-icon"></div>
            <span class="copy-span">copy link</span>
            </div>
        </div>
        <p class="prods-per-page">Products on the page:
            <span class="prods-count"></span>
        </p>
        <div class="sort-by-wrap">
            <select name="sort-variant" class="sort-by-select">
                <option value="" disabled selected hidden>Sort by:</option>
                <option class="sort-option" value="by-price">increasing price</option>
                <option class="sort-option" value="by-rating">increasing rating</option>
            </select>
        </div>

        <label class="switch-layout">
            <img class="left-dots-bg" src="../assets/icons/5-dots-g.svg" alt="">
            <img src="../assets/icons/4-dots.svg" alt="" class="right-dots-bg">
            <input id="switch-layout-checkbox" type="checkbox">
            <span class="layout-slider"></span>
        </label>
        </div>
        <div class="under-head-line">
        <div class="filter-panel"></div>
        <div class="cards-area"></div>
        </div>
    </div>
    `;

    const btnReset = mainBlock.querySelector('.reset-filter') as HTMLDivElement;
    btnReset.addEventListener('click', () => {
        window.history.pushState({}, '', '/');
        handleLocation();
    });

    const btnCopyLink = mainBlock.querySelector('.copy-link') as HTMLDivElement;
    const spanBtnCopyLink = btnCopyLink.querySelector('.copy-span') as HTMLSpanElement;
    btnCopyLink.addEventListener('click', () => {
        if (!btnCopyLink.classList.contains('active-copy-link')) {
            navigator.clipboard.writeText(window.location.href).catch((err) => {
                console.log('Something went wrong', err);
            });
            btnCopyLink.classList.add('active-copy-link');
            spanBtnCopyLink.textContent = 'copied!';
            setTimeout(() => {
                btnCopyLink.classList.remove('active-copy-link');
                spanBtnCopyLink.textContent = 'copy link';
            }, 1000);
        }
    });

    const checkboxSwitchLayout = mainBlock.querySelector('#switch-layout-checkbox') as HTMLInputElement;
    if (parameters['big'] && parameters['big'][0] === 'true') {
        checkboxSwitchLayout.checked = true;
    }
    checkboxSwitchLayout.addEventListener('change', () => {
        if (!orderParameters.includes('big')) {
            orderParameters.push('big');
        }
        parameters['big'] = [`${checkboxSwitchLayout.checked}`];
        generateQueryParameters();
        fillProductList(filterProductList());
    });

    mainBlockG = mainBlock;

    const filters = mainBlock.querySelector('.filter-panel');
    if (filters instanceof Element) {
        filters.append(generateFilterPanel());
    }

    fillProductList(filterProductList());

    return mainBlock;
}

async function fillProductList(products: ProductCard[]) {
    const cardsArea = mainBlockG.querySelector('.cards-area');
    if (cardsArea instanceof Element) {
        cardsArea.innerHTML = '';
        products.forEach((product) => {
            cardsArea.append(generateProductCard(product));
        });
        if (products.length === 0) {
            const hTitle = document.createElement('h1');
            hTitle.textContent = 'No products found';
            cardsArea.append(hTitle);
        }
    }
}

function generateProductCard(data: ProductCard) {
    const card = document.createElement('article');
    card.className = 'prod-card';

    card.innerHTML = `
    <div class="v prod-card-inner">
        <div class="discount">-${data.discountPercentage}%</div>
        <div class="stock">${data.stock} in stock</div>
        <div class="prod-img-wrap">
        <div class="prod-img" style="background-image: url(${data.thumbnail})">
            <img src="/assets/icons/search-plus.svg" alt="more info icon" class="img-more-info-icon">
        </div>
        </div>
        <div class="rating-line">
        <div class="rating-stars">
            <div class="stars-wrap">
            <img src="../assets/icons/rate-star.svg" alt="" class="rate-star r1">
            <img src="../assets/icons/rate-star.svg" alt="" class="rate-star r2">
            <img src="../assets/icons/rate-star.svg" alt="" class="rate-star r3">
            <img src="../assets/icons/rate-star.svg" alt="" class="rate-star r4">
            <img src="../assets/icons/rate-star.svg" alt="" class="rate-star r5">
            </div>
            <p class="rating-nums">${data.rating}</p>
        </div>
        <p class="category">${data.category}</p>
        <p class="title">${data.title}</p>
        <p class="brand">${data.brand.length > 24 ? data.brand.substring(0, 21).trim() + '...' : data.brand}</p>
        <div class="price-wrap">
            <p class="price">${data.price} ₴</p>
            <p class="reduced-price">${Math.round(data.price - (data.discountPercentage / 100) * data.price)} ₴</p>
        </div>
        <div class="card-buttons-wrap">
            <button class="btn card-btn card-btn-info">
            More info
            </button>
            <button class="btn card-btn card-btn-cart">
            <img src="../assets/icons/cart.svg" alt="cart button icon" class="cart-icon">
            </button>
        </div>
        </div>
    </div>
    `;

    return card;
}

function generateFilterPanel() {
    const categoryValues = [...new Set(dataProducts.map((obj) => obj.category))];
    const brandValues = [...new Set(dataProducts.map((obj) => obj.brand))];
    const priceValues = dataProducts.map((obj) => obj.price);
    const stockValues = dataProducts.map((obj) => obj.stock);

    const filter = document.createElement('div');
    filter.className = 'filter-inner';

    filter.innerHTML = `
        <div class="filter-category filter-feature-list">
            <h2 class="filter-title">Category<h2>
            <div class="filter-category-list filter-value-list"></div>
        </div>
        <div class="filter-brand filter-feature-list">
            <h2 class="filter-title">Brand<h2>
            <div class="filter-brand-list filter-value-list"></div>
        </div>
        <div class="filter-price filter-feature-2-range">
            <h2 class="filter-title">Price<h2>
        </div>
        <div class="filter-stock filter-feature-2-range">
            <h2 class="filter-title">Stock<h2>
        </div>
    `;

    const filterCategoryList = filter.querySelector('.filter-category-list');
    if (filterCategoryList instanceof Element) {
        categoryValues.forEach((value) => {
            filterCategoryList.append(
                createCheckbox(value, 'category', dataProducts.filter((obj) => obj.category === value).length)
            );
        });
    }

    const filterBrandList = filter.querySelector('.filter-brand-list');
    if (filterBrandList instanceof Element) {
        brandValues.forEach((value) => {
            filterBrandList.append(
                createCheckbox(value, 'brand', dataProducts.filter((obj) => obj.brand === value).length)
            );
        });
    }

    const filterPrice = filter.querySelector('.filter-price.filter-feature-2-range');
    if (filterPrice instanceof Element) {
        filterPrice.append(
            createTwoRange(
                Math.min(...priceValues),
                Math.max(...priceValues),
                'price',
                parameters['price'] ? +parameters['price'][0] : parameters['price'],
                parameters['price'] ? +parameters['price'][1] : parameters['price']
            )
        );
    }

    const filterStock = filter.querySelector('.filter-stock.filter-feature-2-range');
    if (filterStock instanceof Element) {
        filterStock.append(
            createTwoRange(
                Math.min(...stockValues),
                Math.max(...stockValues),
                'stock',
                parameters['stock'] ? +parameters['stock'][0] : parameters['stock'],
                parameters['stock'] ? +parameters['stock'][1] : parameters['stock']
            )
        );
    }

    return filter;
}

function createCheckbox(value: string, type: string, amount: number) {
    const label = document.createElement('label');
    label.className = 'checkbox-container';
    label.dataset.value = value;

    const spanText = document.createElement('span');
    spanText.textContent = value;
    label.append(spanText);

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = value;
    input.name = `filter-${type}`;
    input.checked = parameters[type] && parameters[type].includes(value);
    input.addEventListener('change', (event) => {
        const elem = event.target as HTMLInputElement;
        setFilterCheckBox(type, value, elem.checked);
    });
    label.append(input);

    const span = document.createElement('span');
    span.className = 'checkmark';
    label.append(span);

    const amountBlock = document.createElement('span');
    amountBlock.className = 'amount-block';

    const currAmount = document.createElement('span');
    currAmount.className = 'curr-amount';

    const genAmount = document.createElement('span');
    genAmount.className = 'gen-amount';
    genAmount.textContent = `${amount}`;

    amountBlock.append('(', currAmount, '/', genAmount, ')');

    label.append(amountBlock);

    return label;
}

function createTwoRange(min: number, max: number, name: string, getMin?: number, getMax?: number) {
    const dualSlider = document.createElement('div');
    dualSlider.className = 'dual-slider-container';

    dualSlider.innerHTML = `
    <div class="values-container">
        <p class="value-1">${getMin ?? min}</p>
        <p>-</p>
        <p class="value-2">${getMax ?? max}</p>
    </div>
    <div class="sliders-control">
        <input class="range-1" type="range" value="${getMin ?? min}" min="${min}" max="${max}">
        <input class="range-2" type="range" value="${getMax ?? max}" min="${min}" max="${max}">
    </div>
    `;

    const paragValue1 = dualSlider.querySelector('.value-1') as HTMLElement;
    const paragValue2 = dualSlider.querySelector('.value-2') as HTMLElement;

    const slider1 = dualSlider.querySelector('.range-1') as HTMLInputElement;
    const slider2 = dualSlider.querySelector('.range-2') as HTMLInputElement;

    const minPercent = getPercentBetweenTwoValues(min, max, getMin ?? min);
    const maxPercent = getPercentBetweenTwoValues(min, max, getMax ?? max);

    slider2.setAttribute(
        'style',
        `background: linear-gradient(to right, #C6C6C6, #C6C6C6 ${minPercent}%, #46C2CB ${minPercent}%, #46C2CB ${maxPercent}%, #C6C6C6 ${maxPercent}%);`
    );

    slider1.addEventListener('input', () => {
        inputEventForDualSlider(slider1, slider2, min, max, paragValue1, paragValue2, name);
    });

    slider2.addEventListener('input', () => {
        inputEventForDualSlider(slider1, slider2, min, max, paragValue1, paragValue2, name);
    });

    return dualSlider;
}

function getPercentBetweenTwoValues(min: number, max: number, value: number) {
    return Math.round((value / (max + min)) * 100);
}

function inputEventForDualSlider(
    slider1: HTMLInputElement,
    slider2: HTMLInputElement,
    min: number,
    max: number,
    paragValue1: HTMLElement,
    paragValue2: HTMLElement,
    paramName: string
) {
    const minValue = Math.min(+slider1.value, +slider2.value);
    const maxValue = Math.max(+slider1.value, +slider2.value);

    paragValue1.textContent = `${minValue}`;
    paragValue2.textContent = `${maxValue}`;

    const minPercent = getPercentBetweenTwoValues(min, max, minValue);
    const maxPercent = getPercentBetweenTwoValues(min, max, maxValue);

    slider2.setAttribute(
        'style',
        `background: linear-gradient(to right, #C6C6C6, #C6C6C6 ${minPercent}%, #46C2CB ${minPercent}%, #46C2CB ${maxPercent}%, #C6C6C6 ${maxPercent}%);`
    );

    if (parameters[paramName] == undefined) {
        orderParameters.push(paramName);
    }
    parameters[paramName] = [`${minValue}`, `${maxValue}`];

    generateQueryParameters();
    fillProductList(filterProductList());
}

function setFilterCheckBox(key: string, value: string, checked: boolean) {
    if (checked) {
        if (parameters[key] === undefined) {
            parameters[key] = [value];
            orderParameters.push(key);
        } else {
            parameters[key].push(value);
        }
    } else {
        if (parameters[key].length > 1) {
            parameters[key].splice(parameters[key].indexOf(value), 1);
        } else {
            delete parameters[key];
            orderParameters.splice(orderParameters.indexOf(key), 1);
        }
    }
    generateQueryParameters();
    fillProductList(filterProductList());
}

async function generateQueryParameters() {
    const res = orderParameters.map((param) => `${param}=${parameters[param].join('↕')}`).join('&');
    window.history.pushState({}, '', res ? `?${res}` : '/');
}

function filterProductList() {
    let result: ProductCard[] = dataProducts;
    let temp: ProductCard[];

    orderParameters.forEach((param) => {
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

    adjustFilterAmounts(result);

    return result;
}

async function adjustFilterAmounts(list: ProductCard[]) {
    const filterPanel = mainBlockG.querySelector('.filter-panel') as HTMLDivElement;
    const filterCategoryList = filterPanel.querySelector('.filter-category-list') as HTMLDivElement;
    const filterBrandList = filterPanel.querySelector('.filter-brand-list') as HTMLDivElement;

    ([...filterCategoryList.childNodes] as HTMLLabelElement[]).forEach((label: HTMLLabelElement) => {
        const amount = list.filter((elem) => elem.category === label.dataset.value).length;
        const spanAmount = label.querySelector('.curr-amount') as Element;
        spanAmount.textContent = `${amount}`;
        if (amount > 0) {
            label.classList.add('actual');
        } else {
            label.classList.remove('actual');
        }
    });

    ([...filterBrandList.childNodes] as HTMLLabelElement[]).forEach((label: HTMLLabelElement) => {
        const amount = list.filter((elem) => elem.brand === label.dataset.value).length;
        const spanAmount = label.querySelector('.curr-amount') as Element;
        spanAmount.textContent = `${amount}`;
        if (amount > 0) {
            label.classList.add('actual');
        } else {
            label.classList.remove('actual');
        }
    });

    const productsAmount = mainBlockG.querySelector('.prods-count');
    if (productsAmount instanceof Element) {
        productsAmount.textContent = `${list.length}`;
    }
}

export default generateContentCatalog;
