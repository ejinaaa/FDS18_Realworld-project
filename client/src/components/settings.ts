import View from '../utils/View';
import navigateTo from '../utils/navigateTo';
import request from '../api/request';
import settingsSkeleton from './settingsSkeleton';

class Settings extends View {
  constructor() {
    super();
    this.setTitle('settings');
  }

  skeleton(): string {
    return settingsSkeleton();
  }

  // eslint-disable-next-line class-methods-use-this
  async getHtml(): Promise<string> {
    const userInfo = (await request.getCurrentUserInfo()).data.user;
    const [ userImgUrl, userName, userBio, userEmail ]: string[] = [ userInfo.image, userInfo.username, userInfo.bio, userInfo.email ];
      
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
                    <input class="form-control form-control-lg setting-input-name" type="text" placeholder="Your Name" value="${userName ? userName : ''}" disabled>
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
                  </fieldset>
                  <button class="btn btn-lg btn-primary pull-xs-right setting-btn">
                    Update Settings
                  </button>
            </form>
          </div>
    
        </div>
      </div>
    </div>`;
  }

  async eventBinding(): Promise<void> {
    try {
      const $settingBtn = document.querySelector('.setting-btn') as HTMLButtonElement;
      
      const updateSettings = async (e: MouseEvent) => {
        e.preventDefault();
        
        const $inputImgUrl = document.querySelector('.setting-input-img-url') as HTMLInputElement;
        const $inputBio = document.querySelector('.setting-input-bio') as HTMLInputElement;
        const $inputEmail = document.querySelector('.setting-input-email') as HTMLInputElement;
        const $inputPassword = document.querySelector('.setting-input-pw') as HTMLInputElement;
        
        const image = $inputImgUrl.value ? $inputImgUrl.value : '';
        const bio = $inputBio.value ? $inputBio.value : '';
        const email = $inputEmail.value ? $inputEmail.value : '';
        const password = $inputPassword.value ? $inputPassword.value : '';

        const userName = (await request.updateUserInfo(email, bio, image, password)).data.user.username;

        navigateTo(`/profile@${userName}`);
      };
      
      $settingBtn.addEventListener('click', updateSettings);
    } catch(err) {
      const errorObj = err.response.data.errors;
      const errorName: string[] = Object.keys(errorObj);
      const errorMessage: string[][] = Object.values(errorObj);
      
      console.log(`${errorName} ${errorMessage}`);
    }
  }
}

export default Settings;
