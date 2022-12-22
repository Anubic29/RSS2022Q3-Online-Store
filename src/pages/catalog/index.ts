import { route } from '../../router/router';
import dataProducts from '../../../assets/libs/data';

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

    console.log(dataProducts);

    return mainBlock;
}

export default generateContentCatalog;
