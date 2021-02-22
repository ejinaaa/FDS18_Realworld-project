import axios from "axios";

const renderHeader = async (): Promise<string> => {
  const userToken = window.localStorage.getItem('JWT');
  const nowPage = window.location.pathname;
  let userName;
  
  // console.log(userToken)
  if (userToken) {
      const response = await axios('https://conduit.productionready.io/api/user', {
        headers: {
          Authorization: `Token ${userToken}`
        }
      });
      userName = response.data.user.username;
  }

  return `<nav class="navbar navbar-light">
  <div class="container">
    <a class="navbar-brand" href="/">conduit</a>
    <ul class="nav navbar-nav pull-xs-right">
      <li class="nav-item">
        <!-- Add "active" class when you're on that page" -->
        <a class="nav-link ${nowPage === '/' ? 'active' : ''}" href="/">Home</a>
      </li>
      <li class="nav-item">
      ${userToken ? `<a class="nav-link" href="">
      <i class="ion-compose"></i>&nbsp;New Post
    </a>` : ''}
      </li>
      <li class="nav-item">
        <a class="nav-link ${
          nowPage === '/login' ? 'active' : ''
        }" href="${userToken ? '/settings' : '/login'}">
          ${userToken ? 'Settings' : 'Sign in'}
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link ${
          nowPage === '/register' ? 'active' : ''
        }" href="${userToken ? '/profile' : '/register'}">${userToken ? 'Profile' : 'Sign up'}</a>
      </li>
    </ul>
  </div>
</nav>`;
};

export default renderHeader;
