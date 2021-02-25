import request from '../api/request';
import Articles from '../interface/Articles';

const toggleFavoriteArticle = async (e: MouseEvent) => {
  try {
    const targetElement = e.target as HTMLElement;
    const targetParentElement = targetElement.closest('.article-meta') as HTMLDivElement;
    const targetParentSiblingElement = targetParentElement?.nextElementSibling as HTMLAnchorElement;
    const targetBtn = targetElement.closest('.btn') as HTMLButtonElement;

    const slug = targetParentSiblingElement.href.split('@')[1];
    const selectedArticleFavorited: boolean = (await request.getArticle(slug)).data.article.favorited;
    
    let articleInfo: Articles;

    if (!selectedArticleFavorited) {
      articleInfo = (await request.favoriteArticle(slug)).data.article;
    } else {
      articleInfo = (await request.unfavoriteArticle(slug)).data.article;
    }

    const favoritesCount = articleInfo.favoritesCount;

    targetBtn.innerHTML = `<i class="ion-heart"></i> ${favoritesCount}`;
  } catch (err) {
    const errorObj = err.response.data.errors;
    const errorName: string[] = Object.keys(errorObj);
    const errorMessage: string[][] = Object.values(errorObj);
    
    console.log(`${errorName} ${errorMessage}`);
  }
};

export default toggleFavoriteArticle;