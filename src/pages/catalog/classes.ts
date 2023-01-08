import type { ProductCard, CartProduct } from '../../types/types';
import { maxValueRating, colorFilledStar, colorEmptyStar } from '../../../assets/libs/vars';
import { handleLocation } from '../../router/router';
import { refreshCartHead } from '../cart/index';

function openDetailsPage(id: number) {
    window.history.pushState({}, '', `/details/${id}`);
    handleLocation();
}

class catalogProductCard {
    readonly data: ProductCard;
    readonly htmlElement: HTMLDivElement;

    constructor(data: ProductCard) {
        this.data = data;
        this.htmlElement = document.createElement('div');
        this.htmlElement.className = 'prod-card';
        this.htmlElement.innerHTML = `
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
                <div class="rate-stars"></div>
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
        </div>`;

        const rateStars = this.htmlElement.querySelector('.rate-stars') as HTMLDivElement;
        const ratePercent = (+data.rating.toFixed(1) / maxValueRating) * 100;
        rateStars.style.background = `linear-gradient(to right, ${colorFilledStar} 0%, ${colorFilledStar} ${ratePercent}%, ${colorEmptyStar} ${ratePercent}%)`;

        const prodImg = this.htmlElement.querySelector('.prod-img') as HTMLDivElement;
        prodImg.addEventListener('click', () => {
            openDetailsPage(data.id);
        });

        const btnMoreInfo = this.htmlElement.querySelector('.card-btn-info') as HTMLButtonElement;
        btnMoreInfo.addEventListener('click', () => {
            openDetailsPage(data.id);
        });

        const btnBuy = this.htmlElement.querySelector('.card-btn-cart') as HTMLButtonElement;
        const cartList: CartProduct[] = JSON.parse(localStorage.getItem('cartList') ?? '[]');
        if (cartList.findIndex((product) => product.id === data.id) !== -1) {
            btnBuy.classList.add('remove');
        } else {
            btnBuy.classList.remove('remove');
        }
        btnBuy.addEventListener('click', () => {
            const cartList: CartProduct[] = JSON.parse(localStorage.getItem('cartList') ?? '[]');
            const idProdCart = cartList.findIndex((product) => product.id === data.id);
            if (idProdCart === -1) {
                cartList.push({
                    id: data.id,
                    count: 1,
                    finalPrice: Math.round(data.price - (data.discountPercentage / 100) * data.price),
                });
                btnBuy.classList.add('remove');
            } else {
                cartList.splice(idProdCart, 1);
                btnBuy.classList.remove('remove');
            }
            localStorage.setItem('cartList', JSON.stringify(cartList));
            refreshCartHead();
        });
    }

    getElement(big?: boolean) {
        const result = this.htmlElement.cloneNode(true) as HTMLDivElement;
        if (big) result.classList.add('prod-card-big');
        console.log(this.htmlElement);
        return result;
    }
}

export { catalogProductCard };
