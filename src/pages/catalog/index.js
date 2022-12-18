import { route } from '../../router/router';

function generateContentCatalog() {
    const link = document.createElement('a');
    link.text = 'catalog to details';
    link.href = '/catalog';
    link.addEventListener('click', route);
    return link;
}

export default generateContentCatalog;
