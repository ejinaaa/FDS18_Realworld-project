import View from '../utils/View';
import navigateTo from '../utils/navigateTo';
import request from '../api/request';
import Article from '../interface/Articles';

let isUpdate = false;
let slug: string | undefined = '';

class Edit extends View {
  constructor() {
    super();
    this.setTitle('Create Article');
  }

  skeleton(): string {
    return '';
  }

  async getHtml(): Promise<string> {
    let title = '';
    let description = '';
    let body = '';
    let tags: string[] = [];

    slug = location.pathname.split('@')[1];
    if(slug) isUpdate = true;

    if(isUpdate) {
      const editArticleData: Article = (await request.getArticle(slug)).data.article;

      title = editArticleData.title;
      description = editArticleData.description;
      body = editArticleData.body;
      tags = editArticleData.tagList;
    }
    return `<div class="editor-page">
    <div class="container page">
      <div class="row">
  
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                  <input type="text" class="article-title form-control form-control-lg" placeholder="Article Title" value="${title}">
              </fieldset>
              <fieldset class="form-group">
                  <input type="text" class="article-description form-control" placeholder="What's this article about?" value="${description}">
              </fieldset>
              <fieldset class="form-group">
                  <textarea class="article-body form-control" rows="8" placeholder="Write your article (in markdown)">${body}</textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input type="text" class="article-tag-list form-control" placeholder="Enter tags" value="${tags}"><div class="tag-list"></div>
              </fieldset>
              <button class="btn btn-lg btn-publish pull-xs-right btn-primary" type="button">
                  Publish Article
              </button>
            </fieldset>
          </form>
        </div>
  
      </div>
    </div>
  </div>`;
  }

  eventBinding(): void {
    const $articleTitle = document.querySelector('.article-title') as HTMLInputElement;
    const $articleDescription = document.querySelector('.article-description') as HTMLInputElement;
    const $articleBody = document.querySelector('.article-body') as HTMLTextAreaElement;
    const $articleTagList = document.querySelector('.article-tag-list') as HTMLInputElement;
    const $btnPublish = document.querySelector('.btn-publish') as HTMLButtonElement;

    $btnPublish.addEventListener('click', () => {
      const title = $articleTitle.value;
      const description = $articleDescription.value;
      const body = $articleBody.value;
      const tagList = $articleTagList.value.split(',');

      if(isUpdate) {
        request.updateArticle(slug as string, title, description, body, tagList);
        navigateTo(`/article@${slug}`);
      }
      else {
        request.createAticle(title, description, body, tagList);
        navigateTo('/home');
      }
    });
  }
}

export default Edit;
