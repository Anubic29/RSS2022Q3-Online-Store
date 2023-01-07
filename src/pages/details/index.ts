// import { route, handleLocation } from '../../router/router';
import { handleLocation, route } from '../../router/router';
import dataProducts from '../../../assets/libs/data';
import type { ProductCard, CartProduct, ParamsObjGenerate } from '../../types/types';
import '../../../assets/icons/rate-star.svg';
import { refreshCartHead } from '../cart/index';

// const currentProduct: ProductCard = dataProducts[0];

function generateContentDetails(params?: ParamsObjGenerate, orderParams?: string[]) {
    console.log(params);
    console.log(orderParams);
    console.log(route);
    const path = window.location.pathname;
    const idProd = path.substring(path.lastIndexOf('/') + 1);
    const currentProduct: ProductCard | undefined = dataProducts.find((prodCard) => prodCard.id === +idProd);

    const mainBlock = document.createElement('div');
    mainBlock.className = 'page-details';

    if (currentProduct !== undefined) {
        mainBlock.innerHTML = `
        <div class="main-inner">
        <ul class="path">
            <li class="path-step path-step-store">
                <a href="/" onclick="route()">Store</a>
            </li>
            <li class="path-step path-step-category">
                <a href="/?category=${currentProduct.category}" onclick="route()">${currentProduct.category}</a>
            </li>
            <li class="path-step path-step-brand">
                <a href="/?brand=${currentProduct.brand}" onclick="route()">${currentProduct.brand}</a>
            </li>
            <li class="path-step path-step-product">${currentProduct.title}</li>
        </ul>
        <div class="details-block">
            <div class="title-block">
            <h2 class="title">${currentProduct.title}</h2>
            <div class="rating-block">
                <div class="rating-stars">
                <img src="../assets/icons/rate-star.svg" alt="">
                <img src="../assets/icons/rate-star.svg" alt="">
                <img src="../assets/icons/rate-star.svg" alt="">
                <img src="../assets/icons/rate-star.svg" alt="">
                <img src="../assets/icons/rate-star.svg" alt="">
                </div>
                <p class="rating">Rating: ${currentProduct.rating}</p>
            </div>
            </div>
            <div class="product-content-block">
            <div class="image-block">
                <img class="main-image" src="${currentProduct.images[0]}" alt=""></img>
                <ul class="images-list"></ul>
            </div>
            <div class="info-block">
                <ul class="info-list">
                <li>Category: <span>${currentProduct.category}</span></li>
                <li>Brand: <span>${currentProduct.brand}</span></li>
                <li>Discount Percentage: <span>${currentProduct.discountPercentage}</span></li>
                <li>Stock: <span>${currentProduct.stock}</span></li>
                </ul>
                <div class="price-block">
                <h2 class="price">$${currentProduct.price}</h2>
                <h2 class="cost">$${Math.round(
                    currentProduct.price - (currentProduct.discountPercentage / 100) * currentProduct.price
                )}</h2>
                </div>
                <div class="description-block">
                <h2 class="info-title">Description:</h2>
                <hr>
                <p class="description">${currentProduct.description}</p>
                </div>
            </div>
            </div>
        </div>
        </div>
        `;

        const imageBlock = mainBlock.querySelector('.image-block') as Element;

        const mainImage = mainBlock.querySelector('.main-image') as HTMLImageElement;
        const imagesList = imageBlock.querySelector('.images-list');
        if (imagesList instanceof Element) {
            currentProduct.images.forEach((image) => {
                const li = document.createElement('li');

                const img = document.createElement('img');
                img.src = image;
                img.alt = '';
                img.addEventListener('mouseover', () => {
                    mainImage.src = image;
                });
                li.append(img);

                imagesList.append(li);
            });
        }

        const priceBlock = mainBlock.querySelector('.price-block');
        if (priceBlock instanceof Element) {
            priceBlock.append(generateBtnsBlock(currentProduct));
        }
    } else {
        mainBlock.innerHTML = `
        <div class="main-inner">
            <h1 class="not-found">Product number ${idProd} is not found</h1>
        </div>
        `;
    }

    return mainBlock;
}
console.log(JSON.parse(localStorage.getItem('cartList') as string));

function generateBtnsBlock(currentProduct: ProductCard) {
    const cartList: CartProduct[] = JSON.parse(localStorage.getItem('cartList') ?? '[]');

    const btnsBlock = document.createElement('div');
    btnsBlock.className = 'btns-block';

    const btnAddRem = document.createElement('button');
    btnAddRem.className = 'btn';
    btnAddRem.textContent =
        cartList.findIndex((product) => product.id === currentProduct.id) === -1 ? 'Add to cart' : 'Remove from cart';
    btnAddRem.addEventListener('click', () => {
        const idProdCart = cartList.findIndex((product) => product.id === currentProduct.id);
        if (idProdCart === -1) {
            cartList.push({
                id: currentProduct.id,
                count: 1,
                finalPrice: Math.round(
                    currentProduct.price - (currentProduct.discountPercentage / 100) * currentProduct.price
                ),
            });
            btnAddRem.textContent = 'Remove from cart';
        } else {
            cartList.splice(idProdCart, 1);
            btnAddRem.textContent = 'Add to cart';
        }
        localStorage.setItem('cartList', JSON.stringify(cartList));
        refreshCartHead();
    });

    const btnBuyNow = document.createElement('button');
    btnBuyNow.className = 'btn';
    btnBuyNow.textContent = 'Buy now';
    btnBuyNow.addEventListener('click', () => {
        if (cartList.findIndex((product) => product.id === currentProduct.id) === -1) {
            cartList.push({
                id: currentProduct.id,
                count: 1,
                finalPrice: Math.round(
                    currentProduct.price - (currentProduct.discountPercentage / 100) * currentProduct.price
                ),
            });
            localStorage.setItem('cartList', JSON.stringify(cartList));
        }
        refreshCartHead();
        sessionStorage.setItem('buy', 'true');
        window.history.pushState({}, '', '/cart');
        handleLocation();
    });

    btnsBlock.append(btnAddRem);
    btnsBlock.append(btnBuyNow);
    return btnsBlock;
}

export default generateContentDetails;
