import axios, { AxiosResponse } from 'axios';
import View from '../utils/View';
import navigateTo from '../utils/navigateTo';

class Register extends View {
  constructor() {
    super();
    this.setTitle('register');
  }

  skeleton(): string {
    return '';
  }

  // eslint-disable-next-line class-methods-use-this
  async getHtml(): Promise<string> {
    return `<div class="auth-page">
    <div class="container page">
      <div class="row">
  
        <div class="col-md-6 offset-md-3 col-xs-12 signup-container">
          <h1 class="text-xs-center">Sign up</h1>
          <p class="text-xs-center">
            <a href="">Have an account?</a>
          </p>
  
          <!-- <ul class="error-messages">
            <li>That email is already taken</li>
          </ul> -->
  
          <form>
            <fieldset class="form-group">
              <input class="form-control form-control-lg signup-input-name" type="text" placeholder="Your Name">
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg signup-input-email" type="text" placeholder="Email">
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg signup-input-pw" type="password" placeholder="Password">
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right signup-btn">
              Sign up
            </button>
          </form>
        </div>
  
      </div>
    </div>
  </div>`;
  }

  eventBinding(): void {
    const $inputName = document.querySelector('.signup-input-name') as HTMLInputElement;
    const $inputEmail = document.querySelector('.signup-input-email') as HTMLInputElement;
    const $inputPassword = document.querySelector('.signup-input-pw') as HTMLInputElement;
    const $signupBtn = document.querySelector('.signup-btn') as HTMLButtonElement;
    const $signupContainer = document.querySelector('.signup-container') as HTMLDivElement;
    const $errorMessages = document.createElement('ul') as HTMLUListElement;

    $signupContainer.insertBefore($errorMessages, $signupContainer.lastElementChild);
    $errorMessages.classList.add('error-messages');
    
    $signupBtn.addEventListener('click', async e => {
      try {
        e.preventDefault();
        
        const userToken = await (await axios.post('https://conduit.productionready.io/api/users', {
          user:{
            username: $inputName.value,
            email: $inputEmail.value,
            password: $inputPassword.value
          }
        })).data.user.token;
        // const token: string = userInfo.data.user.token;

        localStorage.setItem('JWT', userToken);
        
        navigateTo('/');

        $errorMessages.innerHTML = '';
        $inputName.value = '';
        $inputEmail.value = '';
        $inputPassword.value = '';
      } catch (err) {
        const errorObj = err.response.data.errors;
        const [ errorNames, errorMessages ] = [ Object.keys(errorObj), Object.values(errorObj) ];
        // const errorNames = Object.keys(errorObj);
        // const errorMessages = Object.values(errorObj);
        
        $errorMessages.innerHTML = errorMessages.map((message: any, index) => {
          return `<li>${errorNames[index]} ${message.join(', ')}</li>`
        }).join('');
      }
    });
  }
}

export default Register;
