import { route } from '../../router/router';

function generateContentCatalog() {
    const mainBlock = document.createElement('div');
    mainBlock.className = 'page-catalog';

    const title = document.createElement('h1');
    title.textContent = 'Catalog';

    const link = document.createElement('a');
    link.text = 'Details';
    link.href = '/details';
    link.addEventListener('click', route);

    mainBlock.append(title);
    mainBlock.append(link);

    return mainBlock;
}

export default generateContentCatalog;
