import { route } from '../../router/router';

function generateContent404() {
    const link = document.createElement('a');
    link.text = '404 to cart';
    link.href = '/cart';
    link.addEventListener('click', route);
    return link;
}

export default generateContent404;
