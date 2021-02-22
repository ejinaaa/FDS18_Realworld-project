import Home from './components/home';
import Login from './components/login';
import Register from './components/register';

const $root = document.getElementById('root') as HTMLDivElement;

const router = async () => {
  const routes = [
    { path: '/', View: Home },
    { path: '/login', View: Login },
    { path: '/register', View: Register }
  ];

  const potentialmatches = routes.map(route => ({
    route,
    isMatch: window.location.pathname === route.path
  }));

  let match = potentialmatches.find(potentialmatch => potentialmatch.isMatch);

  if (!match) {
    match = {
      route: routes[0],
      isMatch: true
    };
    window.history.pushState(null, '', '/');
  }

  const view = new match.route.View();

  $root.innerHTML = await view.getHtml();
  view.eventBinding();
};

const navigateTo = (url: string) => {
  window.history.pushState(null, '', url);
  router();
};

// 이벤트 핸들러 등록

document.addEventListener('DOMContentLoaded', router);

window.addEventListener('popstate', router);

$root.addEventListener('click', e => {
  const target = e.target as HTMLAnchorElement;

  if (target.matches('[href]')) {
    e.preventDefault();
    navigateTo(target.href);
  }
});
