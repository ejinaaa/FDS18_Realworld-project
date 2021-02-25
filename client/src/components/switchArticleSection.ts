import getArticlesHtml from './getArticlesHtml';
import articlesSkeleton from './articlesSkeleton';
import Articles from '../interface/Articles';
import request from '../api/request';

let articleState: string | null = 'My Articles';

const switchArticleSection = async (e: MouseEvent) => {
  try {
    const target = e.target as HTMLElement;
    const $articlesContainer = document.querySelector('.articles-container') as HTMLElement;
    const articleTabs = document.querySelectorAll('.nav-link');

    if (!target.matches('.nav-link')) return;

    $articlesContainer.innerHTML = articlesSkeleton();
    
    const userName = window.location.pathname.split('@')[1];
    const userArticlesInfo: Articles[] = (await request.getArticles(`author=${userName}`)).data.articles;
    const favoritedArticlesInfo: Articles[] = (await request.getArticles(`favorited=${userName}`)).data.articles;

    articleState = target.textContent;

    $articlesContainer.innerHTML = articleState === 'My Articles' ? await getArticlesHtml(userArticlesInfo) : await getArticlesHtml(favoritedArticlesInfo);

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