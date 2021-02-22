import Home from '../components/home';
import Login from '../components/login';
import Register from '../components/register';
import Article from '../components/articlePreview';

const $root = document.getElementById('root') as HTMLDivElement;

const routerHandler = async () => {
  const routes = [
    { path: '/', View: Home },
    { path: '/login', View: Login },
    { path: '/register', View: Register },
    { path: '/article', View: Article }
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

export default routerHandler;
