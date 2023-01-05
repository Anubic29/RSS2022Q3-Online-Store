
import '../../../assets/icons/search-plus.svg';
import '../../../assets/icons/arrow.svg';
import dataProducts from '../../../assets/libs/data';
import { CartProduct, ProductCard, ParamsObjGenerate } from '../../types/types';
import '../../../assets/icons/empty-cart.svg';

const cartCountHead = document.getElementById('cart-prod-count') as HTMLElement;
const totalCountHead = document.getElementById('total-numbers') as HTMLElement;
const productsArray = () => JSON.parse(localStorage.getItem('cartList') as string) ?? [];
const totalSum = () => productsArray().reduce((acc: number, cur: CartProduct) => acc + cur.finalPrice, 0);
const productsInCart = (prodAr: CartProduct[]): Array<ProductCard> => {
    const idArray = prodAr.map((obj) => obj.id);
    return dataProducts.filter((el) => {
        if (idArray.includes(el.id)) {
            return el;
        }
    });
};

refreshCartHead();

export function refreshCartHead(): void {
    const products = productsArray();
    const counter = products.length;
    productsInCart(products);
    cartCountHead.innerText = counter;
    totalCountHead.innerText = `${totalSum()} ₴`;
}

function generateContentCart(params?: ParamsObjGenerate, orderParams?: string[]) {
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
          <div class="pagination-controller">
            <div class="pag-array pag-left">
              <img src="../assets/icons/arrow.svg">
            </div>
            <div class="pagination-number">1</div>
            <div class="pag-array pag-right">
              <img src="../assets/icons/arrow.svg">
            </div>
          </div>
        </div>
        <div class="pages-count counter">
          <span class="items-count-span">page</span>
          <div class="pagination-controller">
            <div class="pag-array pag-left">
              <img src="../assets/icons/arrow.svg">
            </div>
            <div class="pagination-number">1</div>
            <div class="pag-array pag-right">
              <img src="../assets/icons/arrow.svg">
            </div>
          </div>
        </div>
      </nav>
      <div class="cart-body">
        <div class="cart-body-wrap">
          <div id="items-holder" class="all-items-holder">
          </div>
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
            <p class="total-prod-count">Products count:<span class="total-span total-count-num">${
                productsArray().length
            }</span></p>
            <p class="total-prod-sum">Total:<span class="total-span total-sum-num">${totalSum()} ₴</span></p>
            <button class="cart-order-btn">Place order</button>
          </section>
        </div>
      </div>
    </div>
    `;
    const cartBody = mainBlock.querySelector('.all-items-holder');
    if (cartBody instanceof Element) {
        const products = productsInCart(productsArray());
        if (products.length > 0) {
            products.map((obj: ProductCard) => cartBody.append(itemsGenerator(obj)));
        }
        if (products.length === 0) {
            const emptyCartDiv = document.createElement('div') as HTMLDivElement;
            emptyCartDiv.className = 'empty-cart-div';
            const emptyCartImg = document.createElement('img') as HTMLImageElement;
            emptyCartImg.setAttribute('src', '../../../assets/icons/empty-cart.svg');
            emptyCartDiv.append(emptyCartImg);
            cartBody.append(emptyCartDiv);
        }
    }

    return mainBlock;
}

const itemsGenerator = (obj: ProductCard) => {
    const item = document.createElement('div') as HTMLElement;
    item.className = 'one-item-block';
    item.innerHTML = `
            <div class="item-card">
              <div class="prod-card-inner">
                <div class="image-block">
                  <div class="discount">${obj.discountPercentage} %</div>
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
              <div class="prod-count-control">
                <div class="prod-count">—</div>
                <div class="prod-count-number">0</div>
                <div class="prod-count">+</div>
                <div class="stock">${obj.stock} in stock</div>
              </div>
            </div>
            <div class="item-sum-col">
              <div class="price-wrap">
                <p class="price">${obj.price} ₴</p>
                <p class="reduced-price">${Math.round(obj.price - (obj.discountPercentage / 100) * obj.price)} ₴</p>
                </div>
                <div class="continue-btn">
                  <a href="/" class="continue-btn-text">Continue shopping</a>
                </div>
            </div>
            `;
    return item;
};

export default generateContentCart;
