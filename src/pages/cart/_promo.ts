import { promoObj } from '../../types/types';
import promos from '../../../assets/libs/promos';
import { calcFinalPrice } from './functions';

JSON.parse(localStorage.getItem('promo') as string) ?? localStorage.setItem('promo', JSON.stringify([]));
let promosArray: promoObj[] = JSON.parse(localStorage.getItem('promo') as string);

let cartTotalSpan: HTMLSpanElement;
let newTotalSp: HTMLSpanElement;

function promogenerator(
    input: HTMLInputElement,
    button: HTMLButtonElement,
    cartTotal: HTMLSpanElement,
    newTotalSpan: HTMLSpanElement,
    couponDiv: HTMLDivElement
) {
    const promoList = promos;
    const promoInput = input as HTMLInputElement;
    const promoBtn = button as HTMLButtonElement;
    cartTotalSpan = cartTotal;
    newTotalSp = newTotalSpan;
    let trueCode: promoObj | undefined;
    promoInput.addEventListener('input', function (event) {
        event.preventDefault();
        promoBtn.disabled = true;
        trueCode = promoList.find((promo: promoObj) => promo.id === promoInput.value.toLocaleUpperCase());
        if (trueCode) {
            promoBtn.disabled = false;
            if (
                promosArray.find((promo) => {
                    if (trueCode) {
                        return promo.id === trueCode.id;
                    }
                })
            ) {
                return;
            } else {
                promoBtn.classList.add('active-promo');
                promoBtn.innerText = 'Apply!';
            }
        }
        if (!trueCode) {
            promoBtn.disabled = true;
            promoBtn.classList.remove('active-promo');
            promoBtn.innerText = 'Enter code';
        }
    });
    promoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!promoBtn.disabled) {
            if (
                promosArray.find((promo) => {
                    if (trueCode) {
                        return promo.id === trueCode.id;
                    }
                })
            ) {
                return;
            } else {
                if (trueCode) {
                    promosArray.push(trueCode);
                    localStorage.setItem('promo', JSON.stringify(promosArray));
                    createNewTotalSpan(cartTotalSpan, newTotalSp);
                    addActiveCoupon(couponDiv);
                }
            }
        }
    });
}

export function addActiveCoupon(couponDiv: HTMLDivElement) {
    const couponHolder = couponDiv;
    couponHolder.innerHTML = '';
    promosArray = JSON.parse(localStorage.getItem('promo') as string);
    promosArray.forEach((promo) => {
        const promoLine = document.createElement('div') as HTMLDivElement;
        promoLine.classList.add('active-promo-line');
        promoLine.innerHTML = `<span>${promo.name} -${promo.disc}%</span> <button data-id='${promo.id}' class="promo-remove-btn">Remove</button>`;
        couponHolder.append(promoLine);
        setDeleteListeners(promoLine.children);
    });
}

function setDeleteListeners(btn: HTMLCollection) {
    const collection = Array.from(btn);
    const button: HTMLButtonElement = collection.find((el) => el.tagName === 'BUTTON') as HTMLButtonElement;
    button.addEventListener('click', () => {
        promosArray = JSON.parse(localStorage.getItem('promo') as string);
        const ind = promosArray.findIndex((promo) => promo.id === button.dataset.id);
        promosArray.splice(ind, 1);
        localStorage.setItem('promo', JSON.stringify(promosArray));
        button.parentElement?.remove();
        createNewTotalSpan(cartTotalSpan, newTotalSp);
    });
}

export function createNewTotalSpan(spanTotal: HTMLSpanElement, newTotalSpan: HTMLSpanElement) {
    promosArray = JSON.parse(localStorage.getItem('promo') as string);
    const sumInTotal = Number(cartTotalSpan.innerText.slice(0, -2));
    const newTotal = newTotalSpan;
    newTotal.innerText = '';
    const reducedPrice = calcFinalPrice(promosArray, sumInTotal);
    newTotal.innerText = `${Math.round(reducedPrice)} ₴`;
    spanTotal.classList.add('crossed');
    if (promosArray.length === 0) {
        spanTotal.classList.remove('crossed');
        newTotal.innerText = '';
    }
}

export default promogenerator;
