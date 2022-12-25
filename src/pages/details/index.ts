import { route } from '../../router/router';
import dataProducts from '../../../assets/libs/data';
import type { ProductCard } from '../../types/types';
import '../../../assets/icons/rate-star.svg';

const currentProduct: ProductCard = dataProducts[0];

function generateContentDetails() {
    console.log(route);
    const mainBlock = document.createElement('div');
    mainBlock.className = 'page-details';

    mainBlock.innerHTML = `
    <div class="main-inner">
      <ul class="path">
        <li class="path-step path-step-store">Store</li>
        <li class="path-step path-step-category">${currentProduct.category}</li>
        <li class="path-step path-step-brand">${currentProduct.brand}</li>
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
              <div class="btns-block">
                <button class="btn">Add to cart</button>
                <button class="btn">Buy now</button>
              </div>
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

    const imagesList = mainBlock.querySelector('.images-list');
    if (imagesList instanceof Element) {
        currentProduct.images.forEach((image) => {
            const li = document.createElement('li');

            const img = document.createElement('img');
            img.src = image;
            img.alt = '';
            li.append(img);

            imagesList.append(li);
        });
    }

    return mainBlock;
}

export default generateContentDetails;
