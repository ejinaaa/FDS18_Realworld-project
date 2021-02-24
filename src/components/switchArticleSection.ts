import getData from './getData';
import getArticlesHtml from './getArticlesHtml';
import articlesSkeleton from './articlesSkeleton';
import Articles from '../interface/Articles';

let articleState: string | null = 'My Articles';

const switchArticleSection = async (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const $articlesContainer = document.querySelector('.articles-container') as HTMLElement;
  const articleTabs: NodeListOf<Element> = document.querySelectorAll('.nav-link');

  if (!target.matches('.nav-link')) return;

  $articlesContainer.innerHTML = articlesSkeleton();
  
  const slug: string = window.location.pathname.split('@')[1];
  const userName: string = await (await getData(`/profiles/${slug}`)).profile.username;
  const userArticlesInfo: Articles[] = await (await getData(`articles/?author=${userName}&limit=10`)).articles;
  const favoritedArticlesInfo: Articles[] = await (await getData(`articles/?favorited=${userName}&limit=10`)).articles;

  articleState = target.textContent;

  $articlesContainer.innerHTML = articleState === 'My Articles' ? await getArticlesHtml(userArticlesInfo) : await getArticlesHtml(favoritedArticlesInfo);

  articleTabs.forEach(tab => tab.classList.remove('active'));
  target.classList.add('active');
};

export default switchArticleSection;