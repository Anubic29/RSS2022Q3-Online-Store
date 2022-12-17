import '../index.html';
import '../style.scss';

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, '', event.target.href);
    handleLocation();
};

const routes = {
    404: '404.html',
    '/': 'catalog.html',
    '/cart': 'cart.html',
    '/details': 'details.html',
};

const handleLocation = async () => {
    const path = window.location.pathname;
    console.log(window.location.search.substring(1));
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById('main-page').innerHTML = html;
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
