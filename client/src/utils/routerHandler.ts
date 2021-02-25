import Home from '../components/home';
import Login from '../components/login';
import Register from '../components/register';
import Article from '../components/articlePreview';
import Edit from '../components/edit';
import Settings from '../components/settings';
import Profile from '../components/profile';
import renderHeader from '../components/renderHeader';

const $root = document.getElementById('root') as HTMLDivElement;

const routerHandler = async () => {
  const routes = [
    { path: '/home', View: Home },
    { path: '/login', View: Login },
    { path: '/register', View: Register },
    { path: '/article', View: Article },
    { path: '/editor', View: Edit },
    { path: '/settings', View: Settings },
    { path: '/profile', View: Profile }
  ];

  
  const potentialmatches = routes.map(route => ({
    route,
    // pathname이 route로 시작하는지 검사하는 정규표현식 작성
    isMatch: new RegExp('^' + route.path).test(window.location.pathname)
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

  const $main = document.querySelector('main') as HTMLElement;
  const $header = document.querySelector('header') as HTMLElement;

  $header.innerHTML = await renderHeader();
  window.scrollTo(0, 0);
  $main.innerHTML = view.skeleton();
  $main.innerHTML = await view.getHtml();
  
  view.eventBinding();
};

export default routerHandler;
