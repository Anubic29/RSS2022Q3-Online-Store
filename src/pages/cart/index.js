import { route } from '../../router/router';

function generateContentCart() {
    const link = document.createElement('a');
    link.text = 'cart to catalog';
    link.href = '/';
    link.addEventListener('click', route);
    return link;
}

export default generateContentCart;
