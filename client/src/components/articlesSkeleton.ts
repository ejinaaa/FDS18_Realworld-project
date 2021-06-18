const ONE_PAGE_ARTICLE_CNT = 10;

const articlesSkeleton = () => `${Array.from({ length: ONE_PAGE_ARTICLE_CNT }).map(post => {
  return `<div class="skeleton-wrap article-preview">
    <div class="skeleton-article-meta">
      <span class="skeleton skeleton-img"></span>
      <div class="skeleton skeleton-info">
        <span class="skeleton skeleton-author"></span>
        <span class="skeleton skeleton-date"></span>
      </div>
    </div>
    <a href="" class="preview-link">
      <h1 class="skeleton skeleton-heading"></h1>
      <p class="skeleton skeleton-content"></p>
      <span class="skeleton-more"></span>
    </a>
  </div>`}).join('')}`;

export default articlesSkeleton;