import View from '../utils/View';
import getData from './getData';
import navigateTo from '../utils/navigateTo';
import renderHeader from '../components/renderHeader';
import getArticlesHtml from '../components/getArticlesHtml';

class Profile extends View {
  private articleState: string | null;

  constructor() {
    super();
    this.setTitle('settings');
    this.articleState = 'My Articles';
  }

  skeleton(): string {
    return '';
  }

  // eslint-disable-next-line class-methods-use-this
  async getHtml(): Promise<string> {
    const userInfo = await (await getData('user')).data.user;
    const [ userImgUrl, userName, userBio ] = [ userInfo.image, userInfo.username, userInfo.bio ];
    const userArticlesInfo = await (await getData(`articles/?author=${userName}&limit=10`)).data.articles;

    return `<div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
  
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img src="${userImgUrl ? userImgUrl : 'https://static.productionready.io/images/smiley-cyrus.jpg'}" class="user-img" />
            <h4>${userName ? userName : ''}</h4>
            <p>${userBio ? userBio : ''}</p>
            <button class="btn btn-sm btn-outline-secondary action-btn signout-btn" style="color: #b85c5c; border: 1px solid #b85c5c">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  
    <div class="container">
      <div class="row">
  
      <div class="articles-toggle" style="margin-left: 8.33333%">
        <ul class="nav nav-pills outline-active">
          <li class="nav-item">
            <button class="nav-link active" style="outline:none">My Articles</button>
          </li>
          <li class="nav-item">
            <button class="nav-link" style="outline:none">Favorited Articles</button>
          </li>
        </ul>
      </div>
        <div class="col-xs-12 col-md-10 offset-md-1 articles-container">
          ${await getArticlesHtml(userArticlesInfo)}
        </div>
      </div>
    </div>
  
  </div>`;
  }

  async eventBinding(): Promise<void> {
    const $signoutBtn = document.querySelector('.signout-btn') as HTMLButtonElement;
    const $articleTab = document.querySelector('.nav-pills') as HTMLUListElement;
    
    $articleTab.addEventListener('click', async e => {
      const target = e.target as HTMLButtonElement;
      const $articlesContainer = document.querySelector('.articles-container') as HTMLElement;
      const articleTabs = document.querySelectorAll('.nav-link');
      const userName = await (await getData('user')).data.user.username;
      const userArticlesInfo = await (await getData(`articles/?author=${userName}&limit=10`)).data.articles;
      const favoritedArticlesInfo = await (await getData(`articles/?favorited=${userName}&limit=10`)).data.articles;

      if (!target.matches('.nav-link')) return;

      this.articleState = target.textContent;
      $articlesContainer.innerHTML = this.articleState === 'My Articles' ? await getArticlesHtml(userArticlesInfo) : await getArticlesHtml(favoritedArticlesInfo);

      articleTabs.forEach(tab => tab.classList.remove('active'));
      target.classList.add('active');
    });

    $signoutBtn.addEventListener('click', async () => {
      const $header = document.querySelector('header') as HTMLElement;
      
      localStorage.removeItem('JWT');

      $header.innerHTML = await renderHeader();

      navigateTo('/');
    });
  }
}

export default Profile;
