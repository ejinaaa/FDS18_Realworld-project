import View from '../utils/View';
import dateConverter from '../utils/dateConverter';
import navigateTo from '../utils/navigateTo';
import UserInfo from '../interface/UserInfo';
import Comment from '../interface/Comment';
import request from '../api/request';
import Articles from '../interface/Articles';

let isLoading = false;
let nowSlug = '';
let currentUserInfo: UserInfo;
let isCurrentUserArticle: boolean = false;
let nowArticleData: Articles;

class Article extends View {
  private slug: string = '';

  constructor() {
    super();
    this.setTitle('Article');
  }

  skeleton(): string {
    return `<div class="article-page">

      <div class="banner">
        <div class="container">
    
          <h1 class="article-heading-skeleton heading-skeleton"></h1>
    
          <div class="article-meta skeleton-article-meta">
            <a><span class="author-img-skeleton heading-skeleton"></span></a>
            <div class="info">
              <a class="author author-name-skeleton heading-skeleton"></a>
              <span class="date create-at-skeleton heading-skeleton"></span>
            </div>
          </div>
    
        </div>
      </div>
    
      <div class="container page">
    
        <div class="row article-content">
          <div class="col-md-12">
            <p style="min-height: 250px">
              <span class="article-body-skeleton1 skeleton"></span>
              <span class="article-body-skeleton2 skeleton"></span>
              <span class="article-body-skeleton3 skeleton"></span>
              <span class="article-body-skeleton4 skeleton"></span>
              <span class="article-body-skeleton5 skeleton"></span>
              <span class="article-body-skeleton6 skeleton"></span>
              <span class="article-body-skeleton7 skeleton"></span>
              <span class="article-body-skeleton8 skeleton"></span>
              <span class="article-body-skeleton9 skeleton"></span>
              <span class="article-body-skeleton10 skeleton"></span>
            </p>
          </div>
        </div>
    
        <hr/>
    
        <div class="article-actions">
          <div class="article-meta skeleton-comment-meta">
            <a><span class="comment-author-img-skeleton skeleton"></span></a>
            <div class="info">
              <a class="author comment-author-name-skeleton skeleton"></a>
              <span class="date comment-create-at-skeleton skeleton"></span>
            </div>
    
            <button class="btn btn-sm btn-outline-secondary">
              ${isCurrentUserArticle ? `<i class="ion-edit"></i> Edit Article` : `<i class="ion-plus-round"></i> Follow`}
            </button>
            &nbsp;
            <button class="btn btn-sm ${isCurrentUserArticle ? 'btn-outline-danger' : 'btn-outline-primary'}">
              ${isCurrentUserArticle ? `<i class="ion-trash-a"></i> Delete Article` :  `<i class="ion-heart"></i> Favorite Post <span class="counter">()</span>`}
            </button>
          </div>
        </div>
    
        <div class="row">
    
          <div class="col-xs-12 col-md-8 offset-md-2">
    
            <form class="card comment-form">
              <div class="card-block">
                <textarea class="form-control comment-body" placeholder="Write a comment..." rows="3"></textarea>
              </div>
              <div class="card-footer">
                <span class="comment-author-img-skeleton skeleton"></span>
                <button class="btn btn-sm btn-primary">
                  Post Comment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>`;
  }

  async getHtml(): Promise<string> {
    nowSlug = window.location.pathname.split('@')[1];

    nowArticleData = (await request.getArticle(nowSlug)).data.article;
    const author = nowArticleData.author
    const commentsData = (await request.getComments(nowSlug)).data.comments;

    if (this.USER_TOKEN) {
      currentUserInfo = (await request.getCurrentUserInfo()).data.user;
      isCurrentUserArticle = currentUserInfo.username === author.username;
    }
      
    


    isLoading = true;
    
    return `<div class="article-page">

      <div class="banner">
        <div class="container">
    
          <h1>${nowArticleData.title}</h1>
    
          <div class="article-meta">
            <a href="/profile@${author.username}"><img src="${author.image}"/></a>
            <div class="info">
              <a href="/profile@${author.username}" class="author">${author.username}</a>
              <span class="date">${dateConverter(nowArticleData.createdAt)}</span>
            </div>
            <button class="btn btn-sm btn-outline-secondary ${isCurrentUserArticle ? 'edit-article-btn' : 'follow-user-btn'}">
              ${isCurrentUserArticle ? `<i class="ion-edit"></i> Edit Article` : `<i class="ion-plus-round"></i> Follow ${author.username}`}
            </button>
            &nbsp;
            <button class="btn btn-sm ${isCurrentUserArticle ? 'btn-outline-danger delete-article-btn' : 'btn-outline-primary favorite-article-btn'}">
              ${isCurrentUserArticle ? `<i class="ion-trash-a"></i> Delete Article` :  `<i class="ion-heart"></i> Favorite Post <span class="counter">(${nowArticleData.favoritesCount})</span>`}
            </button>
          </div>
    
        </div>
      </div>
    
      <div class="container page">
    
        <div class="row article-content">
          <div class="col-md-12">
            <p style="min-height: 250px">${nowArticleData.body}</p>
          </div>
        </div>
    
        <hr/>
    
        <div class="article-actions">
          <div class="article-meta">
            <a href="/profile@${author.username}"><img src="${author.image}" /></a>
            <div class="info">
              <a href="/profile@${author.username}" class="author">${author.username}</a>
              <span class="date">${dateConverter(nowArticleData.createdAt)}</span>
            </div>
    
            <button class="btn btn-sm btn-outline-secondary ${isCurrentUserArticle ? 'edit-article-btn' : 'follow-user-btn'}">
              ${isCurrentUserArticle ? `<i class="ion-edit"></i> Edit Article` : `<i class="ion-plus-round"></i> Follow ${author.username}`}
            </button>
            &nbsp;
            <button class="btn btn-sm ${isCurrentUserArticle ? 'btn-outline-danger delete-article-btn' : 'btn-outline-primary favorite-article-btn'}">
              ${isCurrentUserArticle ? `<i class="ion-trash-a"></i> Delete Article` :  `<i class="ion-heart"></i> Favorite Post <span class="counter">(${nowArticleData.favoritesCount})</span>`}
            </button>
          </div>
        </div>
    
        <div class="row">
    
          <div class="col-xs-12 col-md-8 offset-md-2">
    
            <form class="card comment-form">
              <div class="card-block">
                <textarea class="form-control comment-body" placeholder="Write a comment..." rows="3"></textarea>
              </div>
              ${currentUserInfo ? 
              `<div class="card-footer">
                <img src="${currentUserInfo.image}" class="comment-author-img" />
                <button class="btn btn-sm btn-primary">
                  Post Comment
                </button>
              </div>` : ''
              }
            </form>
            
            <section class="comments-section">
              ${commentsData.map((comment: Comment) => `
              <div id="${comment.id}" class="card">
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
                  ${currentUserInfo.username === comment.author.username ? '<span class="mod-options"><i class="ion-trash-a"></i></span>' : ''}
                </div>
              </div>`).join('')} 
            </section>
          </div>
        </div>
      </div>
    </div>`;
  }

  eventBinding(): void {
    const $articlePage = document.querySelector('.article-page') as HTMLDivElement;
    const $commentForm = document.querySelector('.comment-form') as HTMLFormElement;
    const $commentsSection = document.querySelector('.comments-section') as HTMLElement;
    const $editArticleBtns = Array.from(document.querySelectorAll('.edit-article-btn'));
    const $deleteArticleBtns = Array.from(document.querySelectorAll('.delete-article-btn'));

    $articlePage.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      const parentNode = target.parentNode as HTMLAnchorElement;
      if (target.matches('[href] > *')) {
        e.preventDefault();
        navigateTo(parentNode.href);
      }
    });

    $commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const $commentBody = document.querySelector('.comment-body') as HTMLTextAreaElement;
      const $firstComment = $commentsSection.firstChild as HTMLDivElement;

      const commentValue = $commentBody.value;

      if (commentValue.trim() === '') return;

      const resComment: Comment = ( await request.createComment(nowSlug, commentValue)).data.comment;

      $commentBody.value = '';
      $commentBody.focus();

      const $comment = document.createElement('div');
      $comment.classList.add('card');
      $comment.id = resComment.id.toString();
      $comment.innerHTML = `<div class="card-block">
      <p class="card-text">${resComment.body}</p>
    </div>
    <div class="card-footer">
      <a href="/profile@${resComment.author.username}" class="comment-author">
        <img src="${resComment.author.image}" class="comment-author-img" />
      </a>
      &nbsp;
      <a href="/profile@${resComment.author.username}" class="comment-author">J${resComment.author.username}</a>
      <span class="date-posted">${dateConverter(resComment.createdAt)}</span>
      <span class="mod-options"><i class="ion-trash-a"></i></span>
    </div>`;

      $firstComment.before($comment);
    });

    $commentsSection.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains('mod-options') && !target.classList.contains('ion-trash-a')) return;
      
      let commentId: number = 0;
      let idOwningNode: HTMLDivElement;

      if (target.classList.contains('mod-options')) {
        const parentNode = target.parentNode as HTMLDivElement;
        idOwningNode = parentNode.parentNode as HTMLDivElement;
        commentId = +idOwningNode.id;
      } else {
        const parentNode = target.parentNode as HTMLSpanElement;
        const grandParentNode = parentNode.parentNode as HTMLDivElement;
        idOwningNode = grandParentNode.parentNode as HTMLDivElement;
        commentId = +idOwningNode.id;
      }
      
      try {

        const res = await request.deleteComment(nowSlug, commentId);
        
        if (res.status === 200) idOwningNode.remove();
      } catch(error) {
        throw new Error(error);
      }
    });

    $editArticleBtns.forEach($editArticleBtn => { 
      $editArticleBtn.addEventListener('click', async () => {
        navigateTo(`/editor@${nowSlug}`);
      });
    });
    
    $deleteArticleBtns.forEach($deleteArticleBtn => {
      $deleteArticleBtn.addEventListener('click', () => {
        const nowArticleAuthorName = nowArticleData.author.username;
        request.deleteArticle(nowSlug);
        navigateTo('/home');
      });
    });
  }
}

export default Article;
