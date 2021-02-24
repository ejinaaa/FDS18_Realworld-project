import routerHandler from './utils/routerHandler';
import navigateTo from './utils/navigateTo';
import renderHeader from './components/renderHeader';
import renderFooter from './components/renderFooter';
import './scss/style.scss';

const $root = document.getElementById('root') as HTMLDivElement;

// 이벤트 핸들러 등록

document.addEventListener('DOMContentLoaded', async () => {
  const $header = document.createElement('header');
  const $main = document.createElement('main');
  const $footer = document.createElement('footer');

  $header.innerHTML = await renderHeader();
  $footer.innerHTML = renderFooter();

  $root.appendChild($header);
  $root.appendChild($main);
  $root.appendChild($footer);

  routerHandler();
});

window.addEventListener('popstate', routerHandler);

$root.addEventListener('click', e => {
  const target = e.target as HTMLAnchorElement;
  
  if (target.matches('[href]')) {
    e.preventDefault();
    navigateTo(target.href); 
  }
});
