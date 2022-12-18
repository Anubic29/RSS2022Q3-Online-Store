import { route } from '../../router/router';

function generateContentDetails() {
    const mainBlock = document.createElement('div');
    mainBlock.className = 'page-details';

    const title = document.createElement('h1');
    title.textContent = 'Details';

    const link = document.createElement('a');
    link.text = '404';
    link.href = '/arr';
    link.addEventListener('click', route);

    mainBlock.append(title);
    mainBlock.append(link);

    return mainBlock;
}

export default generateContentDetails;
