import { route } from '../../router/router';
import type { ParamsObjGenerate } from '../../types/types';

function generateContent404(params?: ParamsObjGenerate, orderParams?: string[]) {
    const mainBlock = document.createElement('div');
    mainBlock.className = 'page-404';

    const title = document.createElement('h1');
    title.textContent = '404';
    title.className = 'h1';

    const text = document.createElement('p');
    text.textContent = 'page not found';
    text.className = 'text';

    const moon = document.createElement('div');
    moon.className = 'moon';

    const link = document.createElement('a');
    link.text = 'Go to cart';
    link.href = '/cart';
    link.className = 'link';
    link.addEventListener('click', route);

    mainBlock.append(title);
    mainBlock.append(text);
    mainBlock.append(link);
    mainBlock.append(moon);

    return mainBlock;
}

export { generateContent404 };
