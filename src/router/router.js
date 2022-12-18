import '../index.html';
import '../style.scss';
import generateContent404 from '../pages/404';
import generateContentCart from '../pages/cart';
import generateContentCatalog from '../pages/catalog';
import generateContentDetails from '../pages/details';

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, '', event.target.href);
    handleLocation();
};

const routes = {
    404: generateContent404,
    '/': generateContentCatalog,
    '/cart': generateContentCart,
    '/details': generateContentDetails,
};

const handleLocation = async () => {
    const path = window.location.pathname;
    console.log(window.location.search.substring(1));
    const route = routes[path] || routes[404];
    document.getElementById('main-page').innerHTML = '';
    document.getElementById('main-page').append(route());
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();

export { route };
