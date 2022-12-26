import { route } from '../../router/router';
import '../../../assets/icons/search-plus.svg';
import '../../../assets/icons/arrow.svg';

function generateContentCart() {
    const mainBlock = document.createElement('div');
    mainBlock.className = 'page-cart';
    mainBlock.innerHTML = `
        <div class="main-inner card-page">
      <nav class="cart-nav-line">
        <div class="header-h2-wrap">
          <h2 class="cart-header">Кошик</h2>
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
          <div class="all-items-holder">
            <div class="one-item-block">
              <div class="item-card">
                <div class="v prod-card-inner">
                  <div class="image-block">
                    <div class="discount">-15%</div>
                    <div class="prod-img-wrap">
                      <div class="prod-img" style="background-image: url(thumbnail)">
                        <img src="/assets/icons/search-plus.svg" alt="more info icon" class="img-more-info-icon">
                      </div>
                    </div>
                  </div>
                  <div class="text-block">
                  <p class="category">category</p>
                  <p class="title">title</p>
                  <p class="brand">brand</p>
                    <div class="rating-line">
                      <div class="rating-stars">
                        <div class="stars-wrap">
                          <img src="../assets/icons/rate-star.svg" alt="" class="rate-star r1">
                          <img src="../assets/icons/rate-star.svg" alt="" class="rate-star r2">
                          <img src="../assets/icons/rate-star.svg" alt="" class="rate-star r3">
                          <img src="../assets/icons/rate-star.svg" alt="" class="rate-star r4">
                          <img src="../assets/icons/rate-star.svg" alt="" class="rate-star r5">
                        </div>
                        <p class="rating-nums">4.5</p>
                      </div>
                      </div>
                      <p class="desctiption">Amet culpa reprehenderit et erehenderit et excepteur. Laborum voluptate eu incididunt laboris qui irure est velit et adipisicing officia cillum duis. Non proident sint occaecat culpa. Labore aute voluptate id ullamco. Magna et reprehenderit aute anim ipsum proident esse irure cupidatat velit nulla Lorem aliquip.</p>
                  </div>
                </div>
                <hr>
              </div>
              <div class="item-count">
                <div class="prod-count-control">
                  <div class="prod-count">—</div>
                  <div class="prod-count-number">0</div>
                  <div class="prod-count">+</div>
                </div>
                <div class="stock">152 in stock</div>
              </div>
              <div class="item-sum-col">
                <div class="price-wrap">
                  <p class="price">price ₴</p>
                  <p class="reduced-price">1250 ₴</p>
                  </div>
                  <div class="continue-btn">
                    <a href="/" class="continue-btn-text">Continue shopping</a>
                  </div>
              </div>
            </div>
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
            <p class="total-prod-count">Products count:<span class="total-span total-count-num">1</span></p>
            <p class="total-prod-sum">Total:<span class="total-span total-sum-num">15000 ₴</span></p>
            <button class="cart-order-btn">Place order</button>
          </section>
        </div>
      </div>
    </div>
    `;

    const title = document.createElement('h1');
    title.textContent = 'Cart';

    const link = document.createElement('a');
    link.text = 'Catalog';
    link.href = '/';
    link.addEventListener('click', route);

    return mainBlock;
}

export default generateContentCart;
