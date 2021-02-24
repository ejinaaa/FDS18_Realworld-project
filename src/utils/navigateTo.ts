import routerHandler from './routerHandler';

const navigateTo = (url: string) => {
  window.history.pushState(null, '', url);
  console.log(window.location.pathname);
  routerHandler();
};

export default navigateTo;
