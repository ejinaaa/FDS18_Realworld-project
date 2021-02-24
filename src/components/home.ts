import View from '../utils/View';
import fetchTags from './fetchTags';
import fetchArticles from './fetchArticles';
import navigateTo from '../utils/navigateTo';
import dateConverter from '../utils/dateConverter';
import articlesSkeleton from './articlesSkeleton';

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

  skeleton(): string {
    return `<div class="home-page">
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
            ${articlesSkeleton()}            
          </div>
    
          <div class="col-md-3">
            <div class="sidebar">
            <p>Popular Tags</p>
            
            <div class="tag-list">
              Loading...
            </div>
          </div>
        </div>
  
      </div>
    </div>
  
  </div>`;
  }

  async getHtml(): Promise<string> {
    posts = await fetchArticles();
    tags = await fetchTags();
    
    return `<div class="home-page">
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
            return `<div class="article-preview">
              <div class="article-meta">
                <a href="/profile"><img src="${post.author.image}"/></a>
                <div class="info">
                  <a href="/profile@${post.author.username}" class="author">${post.author.username}</a>
                  <span class="date">${dateConverter(post.createdAt)}</span>
                </div>
                <button class="btn btn-outline-primary btn-sm pull-xs-right">
                  <i class="ion-heart"></i> ${post.favoritesCount}
                </button>
              </div>
              <a href="/article@${post.slug}" class="preview-link">
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
  
  </div>`;
  }

  eventBinding(): void {
    const $colMd9 = document.querySelector('.col-md-9') as HTMLDivElement;

    $colMd9.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      const parentNode = target.parentNode as HTMLAnchorElement;
      if (target.matches('[href] > *')) {
        e.preventDefault();
        navigateTo(parentNode.href);
      }
    });
  }
}

export default Home;
