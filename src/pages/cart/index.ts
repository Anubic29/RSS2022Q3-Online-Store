import { route } from '../../router/router';
import type { ParamsObjGenerate } from '../../types/types';

function generateContentCart(params?: ParamsObjGenerate) {
    console.log(params);
    const mainBlock = document.createElement('div');
    mainBlock.className = 'page-cart';

    const title = document.createElement('h1');
    title.textContent = 'Cart';

    const link = document.createElement('a');
    link.text = 'Catalog';
    link.href = '/';
    link.addEventListener('click', route);

    mainBlock.append(title);
    mainBlock.append(link);

    return mainBlock;
}

export default generateContentCart;
