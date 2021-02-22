const $root = document.getElementById('root') as HTMLDivElement;

import routerHandler from './utils/routerHandler';
import navigateTo from './utils/navigateTo';

// 이벤트 핸들러 등록

document.addEventListener('DOMContentLoaded', routerHandler);

window.addEventListener('popstate', routerHandler);

$root.addEventListener('click', e => {
  const target = e.target as HTMLAnchorElement;
  e.preventDefault();

  const reset = target.closest('a');
  if (target.matches('[href]')) {
    e.preventDefault();
    navigateTo(target.href); 
  }
});
