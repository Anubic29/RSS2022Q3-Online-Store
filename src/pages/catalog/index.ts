import { route } from '../../router/router';
import dataProducts from '../../../assets/libs/data';
import type { ProductCard } from '../../types/types';
import '../../../assets/icons/search-plus.svg';

function generateContentCatalog() {
    const mainBlock = document.createElement('div');
    mainBlock.className = 'page-catalog';

    const title = document.createElement('h1');
    title.textContent = 'Catalog';

    const link = document.createElement('a');
    link.text = 'Details';
    link.href = '/details';
    link.addEventListener('click', route);

    mainBlock.append(title);
    mainBlock.append(link);

    console.log();
    dataProducts.forEach((elem) => {
        mainBlock.append(generateProductCard(elem));
    });

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
