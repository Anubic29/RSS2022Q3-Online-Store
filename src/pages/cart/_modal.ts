import { refreshCartHead } from './index';
import '../../../assets/img/master.png';
import '../../../assets/img/express.png';
import '../../../assets/img/visa.png';

function checkout(modal: HTMLDivElement, bg: HTMLDivElement, bodyOfCart: HTMLOListElement) {
    const modalForm = modal;
    const overlay = bg;
    const body = document.querySelector('body') as HTMLBodyElement;
    const cartBody = bodyOfCart;
    localStorage.setItem('cartList', '[]');
    localStorage.setItem('promo', '[]');
    modalForm.classList.remove('active');
    overlay.classList.remove('active');
    body.classList.remove('modal-active');
    const mainBlock = cartBody.parentElement as HTMLDivElement;
    const redirectPage = document.createElement('div');
    redirectPage.classList.add('redirect');
    redirectPage.innerHTML = `
        <div class="redirect-body">
          <span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </span>
          <div class="base">
            <span></span>
            <div class="face"></div>
          </div>
        </div>
        <div class="longfazers">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
    `;
    refreshCartHead();
    mainBlock.innerHTML = '';
    mainBlock.append(redirectPage);
    const text = document.createElement('p');
    text.classList.add('redirect-p');
    mainBlock.append(text);
    text.innerText = `Thanks! Flying to main...\n3 seconds left`;
    let secs = 2;
    setInterval(function () {
        text.innerText = `Thanks! Flying to main...\n${secs} seconds left`;
        secs -= 1;
    }, 1000);
    window.setTimeout(callback, 3000);
}

function callback() {
    window.location.href = '/';
}

export function setInputListeners(
    btn: HTMLButtonElement,
    modal: HTMLDivElement,
    bg: HTMLDivElement,
    bodyOfCart: HTMLOListElement
) {
    const checkoutBtn = btn;
    const modalForm = modal;
    const overlay = bg;
    const closeCross = modalForm.querySelector('.close-btn') as HTMLButtonElement;
    const body = document.querySelector('body') as HTMLBodyElement;

    checkoutBtn.addEventListener('click', () => {
        modalForm.classList.add('active');
        overlay.classList.add('active');
        body.classList.add('modal-active');
    });
    closeCross.addEventListener('click', () => {
        modalForm.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('modal-active');
    });
    overlay.addEventListener('click', () => {
        modalForm.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('modal-active');
    });

    const block = modal;
    const nameInput = block.querySelector('.form-input.customer-name') as HTMLInputElement;
    const telInput = block.querySelector('.form-input.tel') as HTMLInputElement;
    const adressInput = block.querySelector('.form-input.adress') as HTMLInputElement;
    const emailnput = block.querySelector('.form-input.email') as HTMLInputElement;
    const cardNoInput = block.querySelector('.form-input.card-no') as HTMLInputElement;
    const validInput = block.querySelector('.form-input.valid') as HTMLInputElement;
    const cvvInput = block.querySelector('.form-input.cvv') as HTMLInputElement;
    const form = block.querySelector('form') as HTMLFormElement;
    const cardTypeImg = block.querySelector('.card-type') as HTMLDivElement;

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

    const showError = (input: HTMLInputElement, message: string) => {
        const formField = input.parentElement as HTMLDivElement;
        formField.classList.remove('success');
        formField.classList.add('error');
        const error = formField.querySelector('small') as HTMLSpanElement;
        error.textContent = message;
    };

    const showSuccess = (input: HTMLInputElement) => {
        const formField = input.parentElement as HTMLDivElement;

        formField.classList.remove('error');
        formField.classList.add('success');

        const error = formField.querySelector('small') as HTMLSpanElement;
        error.textContent = '';
    };

    const checkUsername = () => {
        let valid = false;
        const username = nameInput.value.trim();
        if (!isRequired(username)) {
            showError(nameInput, "Can't be blank.");
            return valid;
        }
        if (!isNameValid(username)) {
            showError(nameInput, `Name and surname, 3 characters or more each.`);
            return valid;
        }
        showSuccess(nameInput);
        valid = true;
        return valid;
    };

    const checkTel = () => {
        let valid = false;
        const tel = telInput.value.trim();
        if (!isRequired(tel)) {
            showError(telInput, "Can't be blank.");
            return valid;
        }
        if (!isTelValid(tel)) {
            showError(telInput, `Phone number should start with + and be not less then 9 numbers long!`);
            return valid;
        }
        showSuccess(telInput);
        valid = true;
        return valid;
    };

    const checkAdress = () => {
        let valid = false;
        const adress = adressInput.value.trim();
        if (!isRequired(adress)) {
            showError(adressInput, "Can't be blank.");
            return valid;
        }
        if (!isAdrValid(adress)) {
            showError(adressInput, `Adress needs 3 words. Not less then 5 characters length for each!`);
            return valid;
        }
        showSuccess(adressInput);
        valid = true;
        return valid;
    };

    const checkEmail = () => {
        let valid = false;
        const email = emailnput.value.trim();
        if (!isRequired(email)) {
            showError(emailnput, "Can't be blank.");
            return valid;
        }
        if (!isEmailValid(email)) {
            showError(emailnput, `Enter a valid email`);
            return valid;
        }
        showSuccess(emailnput);
        valid = true;
        return valid;
    };
    const checkCardNom = () => {
        let valid = false;
        const card = cardNoInput.value.trim();
        cardTypeImg.setAttribute('style', 'background-image: url()');
        switch (card[0]) {
            case '4':
                cardTypeImg.setAttribute('style', 'background-image: url(../assets/img/visa.png)');
                break;
            case '5':
                cardTypeImg.setAttribute('style', 'background-image: url(../assets/img/master.png)');
                break;
            case '6':
                cardTypeImg.setAttribute('style', 'background-image: url(../assets/img/express.png)');
                break;
            default:
                cardTypeImg.setAttribute('style', 'background-image: url()');
                break;
        }
        if (card.length > 16) {
            cardNoInput.value = card.slice(0, -1);
        }
        if (!isRequired(card)) {
            showError(cardNoInput, "Can't be blank.");
            return valid;
        }
        if (!isCardNomValid(card)) {
            showError(cardNoInput, `Enter 16 digits`);
            return valid;
        }
        showSuccess(cardNoInput);
        valid = true;
        return valid;
    };
    const checkData = () => {
        let valid = false;
        const data = validInput.value.trim();
        if (data.toLocaleLowerCase() !== data.toLocaleUpperCase()) {
            validInput.value = '';
        }
        if (data.length === 2) {
            if (Number(validInput.value) > 12 || Number(validInput.value) < 1) {
                showError(validInput, "Month can't be greater then 12");
                validInput.value = '';
                return valid;
            }
            validInput.value = `${validInput.value}/`;
        }
        if (data.length > 5) {
            validInput.value = data.slice(0, -1);
        }
        if (!isRequired(data)) {
            showError(validInput, "Can't be blank.");
            return valid;
        }
        if (!isDateValid(data)) {
            showError(validInput, `Enter 4 digits. No need to enter slash /`);
            return valid;
        }
        showSuccess(validInput);
        valid = true;
        return valid;
    };
    const checkCvv = () => {
        let valid = false;
        const cvv = cvvInput.value.trim();
        if (cvv.length > 3) {
            cvvInput.value = cvv.slice(0, -1);
        }
        if (!isRequired(cvv)) {
            showError(cvvInput, "Can't be blank.");
            return valid;
        }
        if (!isCvvValid(cvv)) {
            showError(cvvInput, `Enter 3 digits`);
            return valid;
        }
        showSuccess(cvvInput);
        valid = true;
        return valid;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameValidation = checkUsername();
        const telValidation = checkTel();
        const adressValidation = checkAdress();
        const emailValidation = checkEmail();
        const cardValidation = checkCardNom();
        const dateValidation = checkData();
        const cvvValidation = checkCvv();
        const isFormValid =
            nameValidation &&
            telValidation &&
            adressValidation &&
            emailValidation &&
            cardValidation &&
            dateValidation &&
            cvvValidation;
        if (isFormValid) {
            checkout(modal, bg, bodyOfCart);
        }
    });

    validInput.addEventListener('keydown', function (event) {
        const key = event.key;
        if (key === 'Backspace' || key === 'Delete') {
            validInput.value = '';
        }
    });

    form.addEventListener('input', function (e) {
        const input = e.target as HTMLInputElement;
        switch (input.id) {
            case 'user-name':
                checkUsername();
                break;
            case 'email':
                checkEmail();
                break;
            case 'adress':
                checkAdress();
                break;
            case 'tel':
                checkTel();
                break;
            case 'card':
                checkCardNom();
                break;
            case 'date':
                checkData();
                break;
            case 'cvv':
                checkCvv();
                break;
        }
    });
}
