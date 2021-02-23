import axios from 'axios';
import View from '../utils/View';
import renderFooter from './renderFooter';
import renderHeader from './renderHeader';
import navigateTo from '../utils/navigateTo';

class Edit extends View {
  constructor() {
    super();
    this.setTitle('Create Article');
  }

  async getHtml(): Promise<string> {
    const headerHtml = await renderHeader();
    return `${headerHtml}<div class="editor-page">
    <div class="container page">
      <div class="row">
  
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                  <input type="text" class="article-title form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                  <input type="text" class="article-description form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                  <textarea class="article-body form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input type="text" class="article-tag-list form-control" placeholder="Enter tags"><div class="tag-list"></div>
              </fieldset>
              <button class="btn btn-lg btn-publish pull-xs-right btn-primary" type="button">
                  Publish Article
              </button>
            </fieldset>
          </form>
        </div>
  
      </div>
    </div>
  </div>${renderFooter()}`;
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
      const tagList = $articleTagList.value;

      axios.post('https://conduit.productionready.io/api/articles', {
        article: {
        title,
        description,
        body,
        tagList
        }
      },
      { headers: { Authorization: `Token ${this.USER_TOKEN}` } });

      navigateTo('/');
    });
  }
}

export default Edit;
