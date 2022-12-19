import { route } from '../../router/router';

function generateContent404() {
    const mainBlock = document.createElement('div');
    mainBlock.className = 'page-404';

    const title = document.createElement('h1');
    title.textContent = '404';

    const link = document.createElement('a');
    link.text = 'Cart';
    link.href = '/cart';
    link.addEventListener('click', route);

    mainBlock.append(title);
    mainBlock.append(link);

    return mainBlock;
}

export default generateContent404;
