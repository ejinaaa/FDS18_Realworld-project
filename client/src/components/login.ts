import View from '../utils/View';
import request from '../api/request';
import switchHeaderNav from './switchHeaderNav';

class Login extends View {
  constructor() {
    super();
    this.setTitle('login');
  }

  skeleton(): string {
    return '';
  }

  // eslint-disable-next-line class-methods-use-this
  async getHtml(): Promise<string> {
    return `<div class="auth-page">
    <div class="container page">
      <div class="row">
  
        <div class="col-md-6 offset-md-3 col-xs-12 login-container">
          <h1 class="text-xs-center">Sign in</h1>

          <p class="text-xs-center">
            <a href="/register">Need an account?</a>
          </p>
  
          <form>
            <fieldset class="form-group">
              <input class="form-control form-control-lg login-input-email" type="text" placeholder="Email">
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg login-input-pw" type="password" placeholder="Password">
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right login-btn">
              Sign up
            </button>
          </form>
        </div>
  
      </div>
    </div>
  </div>`;
  }

  eventBinding(): void {
    const $loginBtn = document.querySelector('.login-btn') as HTMLButtonElement;
    const $loginContainer = document.querySelector('.login-container') as HTMLDivElement;
    const $errorMessages = document.createElement('ul') as HTMLUListElement;

    const signin = async (e: MouseEvent) => {
      try {
        e.preventDefault();
        
        const $inputEmail = document.querySelector('.login-input-email') as HTMLInputElement;
        const $inputPassword = document.querySelector('.login-input-pw') as HTMLInputElement;
        const email = $inputEmail.value;
        const password = $inputPassword.value;

        const userToken: string = (await request.signin(email, password)).data.user.token;

        localStorage.setItem('JWT', userToken);
        switchHeaderNav();

        $errorMessages.innerHTML = '';
        $inputEmail.value = '';
        $inputPassword.value = '';
      } catch (err) {
        const errorObj = err.response.data.errors;
        const errorName: string[] = Object.keys(errorObj);
        const errorMessage: string[][] = Object.values(errorObj);
        
        $errorMessages.innerHTML = `<li>${errorName} ${errorMessage}</li>`;
      }
    };

    $loginContainer.insertBefore($errorMessages, $loginContainer.lastElementChild);
    $errorMessages.classList.add('error-messages');

    $loginBtn.addEventListener('click', signin);
  }
}

export default Login;
