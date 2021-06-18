import routerHandler from './routerHandler';

const navigateTo = (url: string) => {
  if(window.location.href === url) return;
  window.history.pushState(null, '', url);
  routerHandler();
};

export default navigateTo;
