const header = (): string => {
  // const userToken = window.localStorage.getItem('jwt');
  const nowPage = window.location.pathname;
  return `<nav class="navbar navbar-light">
  <div class="container">
    <a class="navbar-brand" href="/">conduit</a>
    <ul class="nav navbar-nav pull-xs-right">
      <li class="nav-item">
        <!-- Add "active" class when you're on that page" -->
        <a class="nav-link ${nowPage === '/' ? 'active' : ''}" href="/">Home</a>
      </li>
      <li class="nav-item">
        <!-- <a class="nav-link" href="">
          <i class="ion-compose"></i>&nbsp;New Post
        </a> -->
      </li>
      <li class="nav-item">
        <a class="nav-link ${
          nowPage === '/login' ? 'active' : ''
        }" href="/login">
          Sign in
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link ${
          nowPage === '/register' ? 'active' : ''
        }" href="/register">Sign up</a>
      </li>
    </ul>
  </div>
</nav>`;
};

export default header;
