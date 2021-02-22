import axios from 'axios';
import View from '../utils/View';
import renderFooter from './renderFooter';
import renderHeader from './renderHeader';
import fetchTags from './fetchTags';
import fetchArticles from './fetchArticles';

interface Articles {
  author: { bio: string | null, following: boolean, image: string, username: string };
  body: string;
  createdAt: string;
  description: string;
  favorited: boolean;
  favoritesCount: boolean;
  slug: string;
  tagList: string[];
  title: string;
  updateAt: string;
}

let posts: Articles[] = [];
let tags: string[] = [];

class Home extends View {
  constructor() {
    super();
    this.setTitle('Home');
  }

  async getHtml(): Promise<string> {
    const headerHtml = await renderHeader();
    posts = await fetchArticles();
    tags = await fetchTags();
    
    return `${headerHtml}<div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
  
    <div class="container page">
      <div class="row">
  
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link disabled" href="">Your Feed</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="">Global Feed</a>
              </li>
            </ul>
          </div>
          ${posts.map(post => {
            const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            const createDate = new Date(post.createdAt);
            const createAt = `${day[createDate.getDay()]} ${month[createDate.getMonth()]} ${createDate.getDate()} ${createDate.getFullYear()}`;
          return `<div class="article-preview">
            <div class="article-meta">
              <a href="profile.html"><img src="${post.author.image}" /></a>
              <div class="info">
                <a href="" class="author">${post.author.username}</a>
                <span class="date">${createAt}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                <i class="ion-heart"></i> ${post.favoritesCount}
              </button>
            </div>
            <a id="${post.slug}" href="/article" class="preview-link">
              <h1>${post.title}</h1>
              <p>${post.description}</p>
              <span>Read more...</span>
            </a>
          </div>`}).join('')}
          
        </div>
  
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
  
            <div class="tag-list">
              ${tags.map(tag => `<a href="" class="tag-pill tag-default">${tag}</a>`).join('')}
            </div>
          </div>
        </div>
  
      </div>
    </div>
  
  </div>${renderFooter()}`;
  }

  eventBinding(): void {

  }
}

export default Home;
