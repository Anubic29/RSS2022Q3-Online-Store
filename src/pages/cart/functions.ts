import type { promoObj } from '../../types/types';

function calcFinalPrice(promosArray: promoObj[], sumInTotal: number) {
    const result = sumInTotal;
    let allDiscounts = 0;
    promosArray.forEach((promo) => {
        allDiscounts += promo.disc;
    });
    return Math.round(result - (allDiscounts / 100) * result);
}
const isRequired = (val: string) => {
    return val === '' ? false : true;
};
const isNameValid = (name: string) => {
    const re = /^[A-Za-zа-яА-Я][A-Za-zа-яА-Я]{2,}\s+[A-ZА-Я][A-Za-zа-яА-Я]{2,}/;
    return re.test(name);
};
const isTelValid = (tel: string) => {
    const re = /\+[0-9]{9,}/;
    return re.test(tel);
};
const isAdrValid = (adr: string) => {
    const re = /[A-Za-zа-яА-Я]{5,}\s+[A-Za-zа-яА-Я]{5,}\s+[A-Za-zа-яА-Я]{5,}/;
    return re.test(adr);
};
const isEmailValid = (email: string) => {
    const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};
const isCardNomValid = (nums: string) => {
    const re = /[0-9]{16}/;
    return re.test(nums);
};
const isDateValid = (date: string) => {
    const re = /[0-1][0-2]\/[0-9]{2}/;
    return re.test(date);
};
const isCvvValid = (cvv: string) => {
    const re = /[0-9]{3}/;
    return re.test(cvv);
};

export {
    calcFinalPrice,
    isRequired,
    isNameValid,
    isTelValid,
    isEmailValid,
    isAdrValid,
    isCardNomValid,
    isDateValid,
    isCvvValid,
};
