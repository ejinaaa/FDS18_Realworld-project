import View from '../utils/View';
import navigateTo from '../utils/navigateTo';
import articlesSkeleton from './articlesSkeleton';
import Article from '../interface/Articles';
import request from '../api/request';
import getArticlesHtml from './getArticlesHtml';
import showArticle from './showArticle';
import toggleFavoriteArticle from './toggleFavoriteArticle';
import switchArticleSection from './switchArticleSection';

let posts: Article[] = [];
let tags: string[] = [];
let nowPage: number = 1;
let articlesCount = 0;
let slidesX = 0;
const ARTICLE_LIMIT = 10;
const PAGE_MENU_COUNT = 5;

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
    const articleData = (await request.getArticles(`limit=${ARTICLE_LIMIT}&offset=${(nowPage - 1) * ARTICLE_LIMIT}`)).data;
    articlesCount = articleData.articlesCount;
    posts = articleData.articles;
    tags = await (await request.getTags()).data.tags;
    
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
            <a class="nav-link" href="">Your Feed</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="">Global Feed</a>
          </li>
        </ul>
      </div>
        <div class="articles-container">
          ${await getArticlesHtml(posts)}
            <div class="pagination-wraper">
              <ul class="pagination">
                <li class="page-item"><a class="page-link move-first-page">&lt;&lt;</a></li>
                <li class="page-item"><a class="page-link move-prev-page"> &lt; </a></li>
                <li class="page-slides">
                  <ul class="page-numbers" style="transform: translateX(-${slidesX}px)">
                    ${Array.from({ length: articlesCount / ARTICLE_LIMIT }, (_, i) => i + 1).map(page => {
                      return `<li class="page-item ${+nowPage === page ? 'active' : ''}"><a class="page-link page-number">${page}</a></li>`
                    }).join('')}
                  </ul>
                </li>
                <li class="page-item"><a class="page-link move-next-page"> &gt; </a></li>
                <li class="page-item"><a class="page-link move-last-page">&gt;&gt;</a></li>
              </ul>
            </div>
        </div>
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
    const $pagination = document.querySelector('.pagination') as HTMLUListElement;
    const $pageNumbers = document.querySelector('.page-numbers') as HTMLUListElement;
    const $moveFirstPage = document.querySelector('.move-first-page') as HTMLAnchorElement;
    const $movePrevPage = document.querySelector('.move-prev-page') as HTMLAnchorElement;
    const $moveNextPage = document.querySelector('.move-next-page') as HTMLAnchorElement;
    const $moveLastPage = document.querySelector('.move-last-page') as HTMLAnchorElement;
    const $articleContainer = document.querySelector('.articles-container') as HTMLDivElement;
    const $articleTab = document.querySelector('.nav-pills') as HTMLUListElement;

    $articleContainer.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest('.preview-link')) showArticle(e);
      if (target.closest('.btn')) toggleFavoriteArticle(e);
    });

    $articleTab.addEventListener('click', switchArticleSection);

    $pagination.addEventListener('click', async (e) => {
      const target = e.target as HTMLAnchorElement;
      const pageListItem = target.parentNode as HTMLLIElement;

      if (!target.classList.contains('page-number') || pageListItem.classList.contains('active')) return;

      const pageNumber = target.textContent as unknown as number;
      nowPage = pageNumber;

      navigateTo(`/home`);
    });

    $moveFirstPage.addEventListener('click', () => {
      slidesX = 0;
      $pageNumbers.style.transform = `translateX(-${slidesX}px)`;
    });
    $movePrevPage.addEventListener('click', () => {
      slidesX -= ($pageNumbers.clientWidth - 2);
      if (slidesX < 0) {
        slidesX = 0
        return;
      }
      $pageNumbers.style.transform = `translateX(-${slidesX}px)`;
    });
    $moveNextPage.addEventListener('click', () => {
      slidesX += ($pageNumbers.clientWidth - 2);
      if (slidesX > $pageNumbers.scrollWidth - 5) {
        slidesX = $pageNumbers.scrollWidth - 195;
        return;
      }
      $pageNumbers.style.transform = `translateX(-${slidesX}px)`;
    });
    $moveLastPage.addEventListener('click', () => {
      slidesX = $pageNumbers.scrollWidth - $pageNumbers.clientWidth;
      $pageNumbers.style.transform = `translateX(-${slidesX}px)`;
    });
  }
}

export default Home;
