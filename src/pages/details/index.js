import { route } from '../../router/router';

function generateContentDetails() {
    const link = document.createElement('a');
    link.text = 'details to 404';
    link.href = '/arr';
    link.addEventListener('click', route);
    return link;
}

export default generateContentDetails;
