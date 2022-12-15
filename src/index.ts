import './style.scss';

const text = 'Hello World!';

const title = document.querySelector('.title');

if (title instanceof Element) {
  title.textContent = text;
}

console.log(text);
