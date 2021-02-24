import View from '../utils/View';
import getData from './getData';
import navigateTo from '../utils/navigateTo';
import dateConverter from '../utils/dateConverter';
import renderHeader from '../components/renderHeader';

class Profile extends View {
  constructor() {
    super();
    this.setTitle('settings');
  }

  skeleton(): string {
    return '';
  }

  // eslint-disable-next-line class-methods-use-this
  async getHtml(): Promise<string> {
    const userInfoData = await getData('user');
    const userImgUrl = userInfoData.data.user.image;
    const userName = userInfoData.data.user.username;
    const userBio = userInfoData.data.user.bio;
    const userArticlesInfo = await (await getData(`articles/?author=${userName}`)).data.articles;

    const articlesHtml = userArticlesInfo.map((articleInfo: any) => {
      const authorInfo = articleInfo.author;
      const tagList = articleInfo.tagList.map((tag: any) => `<li class="tag-default tag-pill tag-outline">${tag}</li>`).join('');

        return `<div class="article-preview">
        <div class="article-meta">
          <a href=""><img src="${authorInfo.image}" /></a>
          <div class="info">
            <a href="" class="author">${authorInfo.username}</a>
            <span class="date">${dateConverter(articleInfo.createdAt)}</span>
          </div>
          <button class="btn btn-outline-primary btn-sm pull-xs-right">
            <i class="ion-heart"></i> ${authorInfo.favorited ? authorInfo.favoritesCount : 0}
          </button>
        </div>
        <a href="" class="preview-link">
          <h1>${articleInfo.title}</h1>
          <p>${articleInfo.description}</p>
          <span>Read more...</span>
          <ul class="tag-list">
            ${tagList}
          </ul>
        </a>
      </div>`;
    }).join('');

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
  
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <button class="nav-link active" style="outline:none">My Articles</button>
              </li>
              <li class="nav-item">
                <button class="nav-link" style="outline:none">Favorited Articles</button>
              </li>
            </ul>
          </div>
          ${articlesHtml}
        </div>
      </div>
    </div>
  
  </div>`;
  }

  async eventBinding(): Promise<void> {
    const $signoutBtn = document.querySelector('.signout-btn') as HTMLButtonElement;
    const $articleTab = document.querySelector('.nav-pills') as HTMLUListElement;
    
    $articleTab.addEventListener('click', e => {
      const target = e.target as HTMLButtonElement;
      const tabList = document.querySelectorAll('.nav-link');

      if (!target.matches('.nav-link')) return;

      tabList.forEach(tab => tab.classList.remove('active'));
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
