import './index.html';
import './style.scss';
import { route, handleLocation } from './router/router';
import {} from './types/index';

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
