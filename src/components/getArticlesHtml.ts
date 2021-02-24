import dateConverter from '../utils/dateConverter';

const getArticlesHtml = async (articlesInfo: any) => {
  return articlesInfo.map((articleInfo: any) => {
    const authorInfo = articleInfo.author;
    const tagList = articleInfo.tagList.map((tag: any) => `<li class="tag-default tag-pill tag-outline">${tag}</li>`).join('');
    return `<div class="article-preview">
      <div class="article-meta">
        <a href="/profile@${authorInfo.username}"><img src="${authorInfo.image}" /></a>
        <div class="info">
          <a href="/profile@${authorInfo.username}" class="author">${authorInfo.username}</a>
          <span class="date">${dateConverter(articleInfo.createdAt)}</span>
        </div>
        <button class="btn btn-outline-primary btn-sm pull-xs-right">
          <i class="ion-heart"></i> ${authorInfo.favorited ? authorInfo.favoritesCount : 0}
        </button>
      </div>
      <a href="/article@${articleInfo.slug}" class="preview-link">
        <h1>${articleInfo.title}</h1>
        <p>${articleInfo.description}</p>
        <span>Read more...</span>
        <ul class="tag-list">
          ${tagList}
        </ul>
      </a>
    </div>`;
  }).join('');
};



export default getArticlesHtml;