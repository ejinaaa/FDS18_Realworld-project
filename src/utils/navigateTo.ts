import routerHandler from './routerHandler';

const navigateTo = (url: string) => {
  window.history.pushState(null, '', url);
  routerHandler();
};

export default navigateTo;
