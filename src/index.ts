import './index.html';
import './index.scss';
import { route, handleLocation } from './router/router';
import {} from './types/index';

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
