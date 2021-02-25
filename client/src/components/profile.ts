import View from '../utils/View';
import request from '../api/request';
import getArticlesHtml from './getArticlesHtml';
import articlesSkeleton from './articlesSkeleton';
import switchHeaderNav from './switchHeaderNav';
import showArticle from './showArticle';
import switchArticleSection from './switchArticleSection';
import toggleFavoriteArticle from './toggleFavoriteArticle';

class Profile extends View {
  constructor() {
    super();
    this.setTitle('settings');
  }

  skeleton() {
    return `<div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
  
          <div class="col-xs-12 col-md-10 offset-md-1" style="height: 209px">
            <img src="https://static.productionready.io/images/smiley-cyrus.jpg" class="user-img" />
            <h4 style="width: 200px; height: 26px; background-color: #ccc; margin: 0 auto 8px auto;"></h4>
            <p style="width: 200px; height: 24px; background-color: #ccc; margin: 0 auto 8px auto;"></p>
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
          ${articlesSkeleton()}
        </div>
      </div>
    </div>
  
  </div>`;
  }

  // eslint-disable-next-line class-methods-use-this
  async getHtml(): Promise<string> {
    const slug = window.location.pathname.split('@')[1];
    let currentUserName;
    if (this.USER_TOKEN) {
      currentUserName = (await request.getCurrentUserInfo()).data.user.username;
    }
    const userInfo = (await request.getUserProfile(slug)).data.profile;
    const userArticlesInfo = (await request.getArticles(`author=${slug}`)).data.articles;
    const [ userImgUrl, userName, userBio, userFollowing ] = [ userInfo.image, userInfo.username, userInfo.bio, userInfo.following ];

    return `<div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
  
          <div class="col-xs-12 col-md-10 offset-md-1" style="height: 209px">
            <img src="${userImgUrl ? userImgUrl : 'https://static.productionready.io/images/smiley-cyrus.jpg'}" class="user-img" />
            <h4>${userName ? userName : ''}</h4>
            <p>${userBio ? userBio : ''}</p>
            ${this.USER_TOKEN ? `<button class="btn btn-sm btn-outline-secondary action-btn" style="position: absolute; right: 10px; bottom: 10px; color: ${slug === currentUserName? '#b85c5c' : ''}; border-color: ${slug === currentUserName? '#b85c5c' : ''}">${slug === currentUserName? 'Sign out' : userFollowing ? 'Unfollow' : 'Follow'}</button>` : ''}
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

  eventBinding(): void {
    const $signoutFollowBtn = document.querySelector('.profile-page .btn') as HTMLButtonElement;
    const $articleTab = document.querySelector('.nav-pills') as HTMLUListElement;
    const $articleContainer = document.querySelector('.articles-container') as HTMLDivElement;

    $signoutFollowBtn.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLButtonElement;
      const userName: string = window.location.pathname.split('@')[1];
      
      if (target.textContent === 'Sign out') {
        localStorage.removeItem('JWT');
        switchHeaderNav();
      }
      if (target.textContent === 'Follow') {
        request.followUser(userName);
        target.textContent = 'Unfollow';
      }
      if (target.textContent === 'Unfollow') {
        request.unfollowUser(userName);
        target.textContent = 'Follow';
      }
    });
    $articleTab.addEventListener('click', switchArticleSection);
    $articleContainer.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest('.preview-link')) showArticle(e);
      if (target.closest('.btn')) toggleFavoriteArticle(e);
    });
  }
}

export default Profile;