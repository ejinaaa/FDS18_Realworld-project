import View from '../utils/View';
import footer from './footer';
import header from './header';

class Login extends View {
  constructor() {
    super();
    this.setTitle('login');
  }

  // eslint-disable-next-line class-methods-use-this
  async getHtml(): Promise<string> {
    return `${header()}<div class="auth-page">
    <div class="container page">
      <div class="row">
  
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign in</h1>

          <p class="text-xs-center">
            <a href="/register">Need an account?</a>
          </p>
  
          <form>
            <fieldset class="form-group">
              <input class="form-control form-control-lg" type="text" placeholder="Email">
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg" type="password" placeholder="Password">
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              Sign up
            </button>
          </form>
        </div>
  
      </div>
    </div>
  </div>${footer()}`;
  }
}

export default Login;
