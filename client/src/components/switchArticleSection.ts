import getArticlesHtml from './getArticlesHtml';
import articlesSkeleton from './articlesSkeleton';
import Articles from '../interface/Articles';
import request from '../api/request';
import navigateTo from '../utils/navigateTo';

let articleState: string | null;

const switchArticleSection = async (e: MouseEvent) => {
  try {
    const target = e.target as HTMLElement;
    const $articlesContainer = document.querySelector('.articles-container') as HTMLElement;
    const articleTabs = document.querySelectorAll('.nav-link');
    const ARTICLE_LIMIT = 10;

    if (!target.matches('.nav-link')) return;

    $articlesContainer.innerHTML = articlesSkeleton();
    
    const $navElement = document.querySelector('.nav-user') as HTMLAnchorElement;
    const userToken = localStorage.getItem('JWT');
    const userName = $navElement.classList.contains('.current-user-name') ? $navElement.textContent : '';
    
    articleState = target.textContent;

    if (articleState === 'Your Feed') {
      const followingArticlesInfo: Articles[] = userToken ? (await request.getArticles(`favorited=${userName}`)).data.articles : [];
      
      $articlesContainer.innerHTML = await getArticlesHtml(followingArticlesInfo);
    }
    if (articleState === 'Global Feed') {
      navigateTo('/');
    }
    if (articleState === 'My Articles') {
      const userArticlesInfo: Articles[] = (await request.getArticles(`author=${userName}`)).data.articles;
      
      $articlesContainer.innerHTML = await getArticlesHtml(userArticlesInfo);
    }
    if (articleState === 'Favorited Articles') {
      const favoritedArticlesInfo: Articles[] = (await request.getArticles(`favorited=${userName}`)).data.articles;
      
      $articlesContainer.innerHTML = await getArticlesHtml(favoritedArticlesInfo);
    }

    articleTabs.forEach(tab => tab.classList.remove('active'));
    target.classList.add('active');
  } catch(err) {
    const errorObj = err.response.data.errors;
    const errorName: string[] = Object.keys(errorObj);
    const errorMessage: string[][] = Object.values(errorObj);
    
    console.log(`${errorName} ${errorMessage}`);
  }
};

export default switchArticleSection;