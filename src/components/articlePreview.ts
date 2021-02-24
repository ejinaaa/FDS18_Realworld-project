import axios from 'axios';
import View from '../utils/View';
import fetchTags from './fetchTags';
import fetchArticles from './fetchArticles';
import getData from './getData';
import dateConverter from '../utils/dateConverter';
import navigateTo from '../utils/navigateTo';

let isLoading = false;

class Article extends View {
  private slug: string = '';

  constructor() {
    super();
    this.setTitle('Article');
  }

  skeleton(): string {
    return '';
  }

  async getHtml(): Promise<string> {
    const slug = window.location.pathname.split('@')[1];
    const articleData = (await axios.get(`https://conduit.productionready.io/api/articles/${slug}`)).data.article;
    const author = articleData.author;
    const commentsData = (await axios.get(`https://conduit.productionready.io/api/articles/${slug}/comments`)).data.comments;
    
    isLoading = true;
    
    return `<div class="article-page">

      <div class="banner">
        <div class="container">
    
          <h1>${articleData.title}</h1>
    
          <div class="article-meta">
            <a href="/profile@${author.username}"><img src="${author.image}"/></a>
            <div class="info">
              <a href="/profile@${author.username}" class="author">${author.username}</a>
              <span class="date">${dateConverter(articleData.createdAt)}</span>
            </div>
            <button class="btn btn-sm btn-outline-secondary">
              <i class="ion-plus-round"></i>
              &nbsp;
              Follow ${author.username}
            </button>
            &nbsp;&nbsp;
            <button class="btn btn-sm btn-outline-primary">
              <i class="ion-heart"></i>
              &nbsp;
              Favorite Post <span class="counter">(${articleData.favoritesCount})</span>
            </button>
          </div>
    
        </div>
      </div>
    
      <div class="container page">
    
        <div class="row article-content">
          <div class="col-md-12">
            <p style="min-height: 250px">${articleData.body}</p>
          </div>
        </div>
    
        <hr/>
    
        <div class="article-actions">
          <div class="article-meta">
            <a href="/profile@${author.username}"><img src="${author.image}" /></a>
            <div class="info">
              <a href="/profile@${author.username}" class="author">${author.username}</a>
              <span class="date">${dateConverter(articleData.createdAt)}</span>
            </div>
    
            <button class="btn btn-sm btn-outline-secondary">
              <i class="ion-plus-round"></i>
              &nbsp;
              Follow ${author.username}
            </button>
            &nbsp;
            <button class="btn btn-sm btn-outline-primary">
              <i class="ion-heart"></i>
              &nbsp;
              Favorite Post <span class="counter">(${articleData.favoritesCount})</span>
            </button>
          </div>
        </div>
    
        <div class="row">
    
          <div class="col-xs-12 col-md-8 offset-md-2">
    
            <form class="card comment-form">
              <div class="card-block">
                <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
              </div>
              <div class="card-footer">
                <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
                <button class="btn btn-sm btn-primary">
                  Post Comment
                </button>
              </div>
            </form>
            
            ${commentsData.map((comment: any) => `
              <div class="card">
                <div class="card-block">
                  <p class="card-text">${comment.body}</p>
                </div>
                <div class="card-footer">
                  <a href="/profile@${comment.author.username}" class="comment-author">
                    <img src="${comment.author.image}" class="comment-author-img" />
                  </a>
                  &nbsp;
                  <a href="/profile@${comment.author.username}" class="comment-author">J${comment.author.username}</a>
                  <span class="date-posted">${dateConverter(comment.createdAt)}</span>
                </div>
              </div>`).join('')}   
            </div>
          </div>
        </div>
      </div>`;
  }

  eventBinding(): void {
    const $articlePage = document.querySelector('.article-page') as HTMLDivElement;

    $articlePage.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      const parentNode = target.parentNode as HTMLAnchorElement;
      if (target.matches('[href] > *')) {
        e.preventDefault();
        navigateTo(parentNode.href);
      }
    });
  }
}

export default Article;
