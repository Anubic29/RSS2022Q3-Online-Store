import { route, handleLocation, generateQueryParameters } from '../../router/router';
import dataProducts from '../../../assets/libs/data';
import type { ParamsObjGenerate, CatalogProductCardFunctions } from '../../types/types';
import { catalogProductCard } from './classes';
import { refreshCartHead } from '../cart/index';

import { getPercentBetweenTwoValues, filterProductList, sortProductList, searchProductInList } from './functions';

import '../../../assets/icons/rate-star.svg';
import '../../../assets/img/stars.png';
import '../../../assets/icons/search-plus.svg';
import '../../../assets/icons/4-dots.svg';
import '../../../assets/icons/5-dots-g.svg';

let mainBlockG: HTMLDivElement;
let parameters: ParamsObjGenerate;
let orderParameters: string[];

let prodList: catalogProductCard[];

let canAdjustSliders = false;

function generateContentCatalog(params?: ParamsObjGenerate, orderParams?: string[]) {
    parameters = params ? params : {};
    orderParameters = orderParams ? orderParams : [];
    console.log(route);
    const functions: CatalogProductCardFunctions = { handleLocation, refreshCartHead };
    prodList = dataProducts.map((obj) => new catalogProductCard(obj, functions));

    const mainBlock = document.createElement('div');
    mainBlock.className = 'page-catalog';

    canAdjustSliders = true;

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
        <div class="sort-by-wrap"></div>

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

    const searchBarInput = document.querySelector('#product-search') as HTMLInputElement;
    const btnSearchReset = document.querySelector('.search-btn-reset') as HTMLButtonElement;
    if (searchBarInput instanceof Element) {
        searchBarInput.value = parameters['search'] ? parameters['search'][0] : '';

        if (btnSearchReset instanceof Element && parameters['search'] && parameters['search'][0]) {
            btnSearchReset.style.display = 'block';
            btnSearchReset.addEventListener('click', async () => {
                btnSearchReset.style.display = 'none';
                orderParameters.splice(orderParameters.indexOf('search'), 1);
                await pushQueryParameters();
                handleLocation();
            });
        }
    }

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
        pushQueryParameters();
        fillProductList(adjustProductList());
    });

    mainBlockG = mainBlock;

    const sortPanel = mainBlock.querySelector('.sort-by-wrap');
    if (sortPanel instanceof Element) {
        sortPanel.append(generateSortPanel());
    }

    const filters = mainBlock.querySelector('.filter-panel');
    if (filters instanceof Element) {
        filters.append(generateFilterPanel());
    }

    fillProductList(adjustProductList());

    return mainBlock;
}

async function fillProductList(products: catalogProductCard[]) {
    const cardsArea = mainBlockG.querySelector('.cards-area');
    if (cardsArea instanceof Element) {
        const isBigCard = parameters['big'] && parameters['big'][0] === 'true';
        cardsArea.innerHTML = '';
        products.forEach((product) => {
            cardsArea.append(product.setBig(isBigCard).getElement());
        });
        if (products.length === 0) {
            const hTitle = document.createElement('h1');
            hTitle.className = 'not-found';
            hTitle.textContent = 'No products found';
            cardsArea.append(hTitle);
        }
    }
}

function generateSortPanel() {
    const fieldsForSort = ['price', 'rating', 'discount'];

    const sortSelect = document.createElement('select');
    sortSelect.name = 'sort-variant';
    sortSelect.className = 'sort-by-select';

    sortSelect.innerHTML = `
        <option value="" disabled hidden>Sort by:</option>
    `;

    fieldsForSort.forEach((name) => {
        sortSelect.innerHTML += `
            <option class="sort-option" value="${name}-ASC">Sort by ${name} ASC</option>
            <option class="sort-option" value="${name}-DESC">Sort by ${name} DESC</option>
        `;
    });

    const arrSortOptions = [...sortSelect.childNodes].filter(
        (node) => node.nodeType == Node.ELEMENT_NODE
    ) as HTMLOptionElement[];
    const foundedOption =
        parameters['sort'] !== undefined
            ? arrSortOptions.find((option) => option.value === parameters['sort'][0])
            : parameters['sort'];

    if (foundedOption !== undefined) {
        foundedOption.setAttribute('selected', 'selected');
    } else {
        arrSortOptions[0].setAttribute('selected', 'selected');
    }

    sortSelect.addEventListener('change', () => {
        if (!orderParameters.includes('sort')) {
            orderParameters.push('sort');
        }
        parameters['sort'] = [sortSelect.value];

        pushQueryParameters();
        fillProductList(adjustProductList());
    });

    return sortSelect;
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

    pushQueryParameters();
    fillProductList(adjustProductList());
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
    canAdjustSliders = true;
    pushQueryParameters();
    fillProductList(adjustProductList());
}

async function pushQueryParameters() {
    const res = generateQueryParameters(orderParameters, parameters);
    window.history.pushState({}, '', res ? `?${res}` : '/');
}

const fieldsForSearch = ['title', 'brand', 'category', 'price', 'stock', 'description', 'rating', 'discountPercentage'];
function adjustProductList() {
    let result: catalogProductCard[] = [...prodList];

    result = filterProductList(result, parameters);
    if (parameters['search'] && parameters['search'][0]) {
        result = searchProductInList(result, fieldsForSearch, parameters['search'][0]);
    }
    result = sortProductList(result, parameters);

    adjustFilterAmounts(result);
    if (canAdjustSliders) {
        adjustDualSliderValues(result);
    }

    return result;
}

async function adjustFilterAmounts(list: catalogProductCard[]) {
    const filterPanel = mainBlockG.querySelector('.filter-panel') as HTMLDivElement;
    const filterCategoryList = filterPanel.querySelector('.filter-category-list') as HTMLDivElement;
    const filterBrandList = filterPanel.querySelector('.filter-brand-list') as HTMLDivElement;

    ([...filterCategoryList.childNodes] as HTMLLabelElement[]).forEach((label: HTMLLabelElement) => {
        const amount = list.filter((elem) => elem.data.category === label.dataset.value).length;
        const spanAmount = label.querySelector('.curr-amount') as Element;
        spanAmount.textContent = `${amount}`;
        if (amount > 0) {
            label.classList.add('actual');
        } else {
            label.classList.remove('actual');
        }
    });

    ([...filterBrandList.childNodes] as HTMLLabelElement[]).forEach((label: HTMLLabelElement) => {
        const amount = list.filter((elem) => elem.data.brand === label.dataset.value).length;
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

async function adjustDualSliderValues(list: catalogProductCard[]) {
    const filterPanel = mainBlockG.querySelector('.filter-panel') as HTMLDivElement;
    const filterPriceDualSlider = filterPanel.querySelector('.filter-price.filter-feature-2-range') as HTMLDivElement;
    const filterStockDualSlider = filterPanel.querySelector('.filter-stock.filter-feature-2-range') as HTMLDivElement;
    const priceValues = list.map((elem) => elem.data.price);
    const stockValues = list.map((elem) => elem.data.stock);
    const valuesArr = [priceValues, stockValues];

    [filterPriceDualSlider, filterStockDualSlider].forEach((dualSlider, idx) => {
        const min = Math.min(...valuesArr[idx]);
        const max = Math.max(...valuesArr[idx]);
        const paragValue1 = dualSlider.querySelector('.value-1') as HTMLElement;
        const paragValue2 = dualSlider.querySelector('.value-2') as HTMLElement;

        const slider1 = dualSlider.querySelector('.range-1') as HTMLInputElement;
        const slider2 = dualSlider.querySelector('.range-2') as HTMLInputElement;

        paragValue1.textContent = `${min}`;
        paragValue2.textContent = `${max}`;
        slider1.value = `${min}`;
        slider2.value = `${max}`;

        const minPercent = getPercentBetweenTwoValues(+slider2.min, +slider2.max, min);
        const maxPercent = getPercentBetweenTwoValues(+slider2.min, +slider2.max, max);

        slider2.setAttribute(
            'style',
            `background: linear-gradient(to right, #C6C6C6, #C6C6C6 ${minPercent}%, #46C2CB ${minPercent}%, #46C2CB ${maxPercent}%, #C6C6C6 ${maxPercent}%);`
        );
    });

    canAdjustSliders = false;
}

export { generateContentCatalog };
