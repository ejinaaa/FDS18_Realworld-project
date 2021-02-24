import getData from "./getData";

const renderHeader = async () => {
  const userToken = window.localStorage.getItem('JWT');
  const currentPage = window.location.pathname;
  let userName = '';
  
  if (userToken) {
      const userInfo = await getData('user'); 
      userName = await userInfo.data.user.username;
  }

  return `<nav class="navbar navbar-light">
  <div class="container">
    <a class="navbar-brand" href="/">conduit</a>
    <ul class="nav navbar-nav pull-xs-right">
      <li class="nav-item">
        <!-- Add "active" class when you're on that page" -->
        <a class="nav-link ${currentPage === '/' ? 'active' : ''}" href="/">Home</a>
      </li>
      <li class="nav-item">
      ${userToken ? `<a class="nav-link ${currentPage === '/editor' ? 'active' : ''}" href="/editor">
      <i class="ion-compose"></i>&nbsp;New Post
    </a>` : ''}
      </li>
      <li class="nav-item">
        <a class="nav-link ${
          currentPage === '/login' ? 'active' : currentPage === '/settings' ? 'active' : ''
        }" href="${userToken ? '/settings' : '/login'}">
          ${userToken ? '<i class="ion-gear-a"></i>&nbsp;Settings' : 'Sign in'}
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link ${
          currentPage === '/register' ? 'active' : currentPage === '/profile' ? 'active' : ''
        }" href="${userToken ? `/profile@${userName}` : '/register'}">${userToken ? userName : 'Sign up'}</a>
      </li>
    </ul>
  </div>
</nav>`;
};

export default renderHeader;
