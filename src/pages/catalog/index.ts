import { route } from '../../router/router';
import dataProducts from '../../../assets/libs/data';
import type { ProductCard } from '../../types/types';

import '../../../assets/icons/rate-star.svg';
import '../../../assets/icons/search-plus.svg';
import '../../../assets/icons/4-dots.svg';
import '../../../assets/icons/5-dots-g.svg';

function generateContentCatalog() {
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
            <span class="prods-count">${dataProducts.length}</span>
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
            <input type="checkbox">
            <span class="layout-slider"></span>
        </label>
        </div>
        <div class="under-head-line">
        <div class="filters">
            Filters
        </div>
        <div class="cards-area"></div>
        </div>
    </div>
    `;

    const cardsArea = mainBlock.querySelector('.cards-area');
    if (cardsArea instanceof Element) {
        dataProducts.forEach((elem) => {
            cardsArea.append(generateProductCard(elem));
        });
    }

    return mainBlock;
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
        <p class="brand">${data.brand}</p>
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

export default generateContentCatalog;
