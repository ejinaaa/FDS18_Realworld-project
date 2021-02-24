import axios, { AxiosResponse } from 'axios';
import View from '../utils/View';
import navigateTo from '../utils/navigateTo';
import getData from './getData';

class Settings extends View {
  constructor() {
    super();
    this.setTitle('settings');
  }

  skeleton(): string {
    return '';
  }

  // eslint-disable-next-line class-methods-use-this
  async getHtml(): Promise<string> {
    const userInfo = await (await getData('user')).data.user;
    const [ userImgUrl, userName, userBio, userEmail ] = [ userInfo.image, userInfo.username, userInfo.bio, userInfo.email ];
    // const userImgUrl = userInfo.data.user.image;
    // const userName = userInfo.data.user.username;
    // const userBio = userInfo.data.user.bio;
    // const userEmail = userInfo.data.user.email;
    
    return `<div class="settings-page">
    <div class="container page">
      <div class="row">
  
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
  
          <form>
            <fieldset>
                <fieldset class="form-group">
                  <input class="form-control setting-input-img-url" type="text" placeholder="URL of profile picture" value="${userImgUrl ? userImgUrl : ''}">
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg setting-input-name" type="text" placeholder="Your Name" value="${userName ? userName : ''}">
                </fieldset>
                <fieldset class="form-group">
                  <textarea class="form-control form-control-lg setting-input-bio" rows="8" placeholder="Short bio about you">${userBio ? userBio : ''}</textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg setting-input-email" type="text" placeholder="Email" value="${userEmail ? userEmail : ''}">
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg setting-input-pw" type="password" placeholder="Password">
                </fieldset>
                <button class="btn btn-lg btn-primary pull-xs-right setting-btn">
                  Update Settings
                </button>
            </fieldset>
          </form>
        </div>
  
      </div>
    </div>
  </div>`;
  }

  async eventBinding(): Promise<void> {
    const $inputImgUrl = document.querySelector('.setting-input-img-url') as HTMLInputElement;
    const $inputBio = document.querySelector('.setting-input-bio') as HTMLInputElement;
    const $inputEmail = document.querySelector('.setting-input-email') as HTMLInputElement;
    const $inputPassword = document.querySelector('.setting-input-pw') as HTMLInputElement;
    const $settingBtn = document.querySelector('.setting-btn') as HTMLButtonElement;

    $settingBtn.addEventListener('click', async e => {
      try {
        e.preventDefault();

        await axios.put('https://conduit.productionready.io/api/user', {
          user:{
            image: $inputImgUrl.value ? $inputImgUrl.value : '',
            bio: $inputBio.value ? $inputBio.value : '',
            email: $inputEmail.value ? $inputEmail.value : '',
            password: $inputPassword.value ? $inputPassword.value : ''
          }
        }, {
          headers: {
            Authorization: `Token ${this.USER_TOKEN}`
          }
        });

        navigateTo('/profile');
      } catch(err) {
        const errorObj = err.response.data;
        console.log(errorObj.errors);
      }
    });
  }
}

export default Settings;
